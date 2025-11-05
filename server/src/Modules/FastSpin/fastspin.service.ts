import { BadRequestException, Delete, Injectable } from "@nestjs/common";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import {
  TokenWrapper,
  UserObj,
} from "../../Global/Service/interface/access.code.service.interface";

import * as _ from "lodash";

import { SUCCESS } from "../../Config/result.code";
import { CallbackType, Lang, Status, StatusStr } from "./Enum/fastspin.enum";
import { Config, Game } from "../../Config/config";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { v4 as uuid } from "uuid";
import * as crypto from "crypto";
import { RedisService } from "../../Infrastructure/Redis/redis.service";

const _md5 = (s: string) =>
  crypto.createHash("md5").update(s, "utf8").digest("hex").toLowerCase();

const md5Hex = (buf: Buffer): string => {
  return crypto.createHash("md5").update(buf).digest("hex");
};

const signMd5 = (rawBody: string | Buffer, secret: string | Buffer): string => {
  const bodyBuf = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(rawBody, "utf8");
  const secretBuf = Buffer.isBuffer(secret)
    ? secret
    : Buffer.from(secret, "utf8");
  return md5Hex(Buffer.concat([bodyBuf, secretBuf])); // body後面直接接secret
};

@Injectable()
export class FastSpinService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * get public user id
   * @param a_nOPID
   * @param a_nUserKey
   * @param a_strFix
   * @returns
   */
  getPublicUserID(a_nOPID: number, a_nUserKey: number, a_strFix = "") {
    return [
      a_strFix,
      this.accessCodeService.getOperatorCode(a_nOPID),
      this.accessCodeService.numberPad(a_nUserKey, Config.MAX_USER_ID_BODY_LEN),
    ].join("");
  }

  /**
   * add token sign for fastspin.
   * @param opId
   * @param userKey
   * @param token
   */
  async addTokenSign(opId: number, userKey: number, token: TokenWrapper) {
    const key = this.getPublicUserID(opId, userKey);
    await this.redisService.set(
      key,
      JSON.stringify(token.token),
      Config.REDIS.TRANSDATA_KEEP_SEC,
    );
  }

  /**
   * get user info by acctId
   * @param acctId
   * @returns
   */
  async getUserIndObj(acctId: string): Promise<UserObj> {
    // a_strFix는 보통 prefix로 사용되며, 길이가 고정되어 있거나 규칙이 있다면 그 길이만큼 자릅니다.
    // getOperatorCode( a_nOPID )의 길이는 CConfig.MAX_OPERATOR_KEY_CODE_LENGTH
    // g_f.numberPad( a_nUserKey, CConfig.MAX_USER_ID_BODY_LEN )의 길이는 CConfig.MAX_USER_ID_BODY_LEN
    const prefixLen =
      acctId.length -
      (Config.MAX_OPERATOR_KEY_CODE_LENGTH + Config.MAX_USER_ID_BODY_LEN);
    const a_strFix = acctId.slice(0, prefixLen);
    const opCode = acctId.slice(
      prefixLen,
      prefixLen + Config.MAX_OPERATOR_KEY_CODE_LENGTH,
    );
    const userKeyStr = acctId.slice(
      prefixLen + Config.MAX_OPERATOR_KEY_CODE_LENGTH,
    );
    // userKey는 numberPad로 만들어졌으므로 앞의 0을 제거해서 숫자로 변환
    const userKey = parseInt(userKeyStr, 10);
    const key = await this.getPublicUserID(
      Number(opCode),
      Number(userKey),
      a_strFix,
    );
    const redisResponse: string | null = await this.redisService.get(key);
    const result = redisResponse ? JSON.parse(redisResponse) : null;
    return result;
  }

  /**
   * verify digest
   * @param _digest
   * @param body
   * @returns
   */
  async verifyDigest(_digest: string, req): Promise<Number> {
    let isVerify = Status.Success;

    const _md5Str = await this.getDigest(req);
    console.info("_md5Str >>>>", _md5Str);
    if (!_digest || _md5Str !== _digest) {
      isVerify = Status.SystemError;
    }

    return isVerify;
  }

  /**
   * get digest
   * @param req
   * @returns
   */
  getDigest(req): string {
    const rawBody: Buffer = (req as any).rawBody; // 就是他送來的原始JSON bytes
    return signMd5(rawBody, Game.FASTSPIN.secret_key);
  }

  getKeyDebitTransferPrefix(transferId: string) {
    return `${Config.FASTSPIN_DEBIT_TRANSFER_PREFIX}${transferId}`;
  }

  getKeyDebitReferencePrefix(referenceId: string) {
    return `${Config.FASTSPIN_DEBIT_REFERENCE_PREFIX}${referenceId}`;
  }

  /**
   * transferId is unique for each transaction. If it has been used, it should not be used again. We keep it for 6 hours.
   * @param transferId
   * @returns
   */
  async transferIdCheck(transferId: string): Promise<boolean> {
    const transferkey = this.getKeyDebitTransferPrefix(transferId);
    const isExist = await this.redisService.get(transferkey);
    if (isExist) {
      return false;
    }
    // this transferId only for this transfer ; save 6hr.
    await this.redisService.set(
      transferkey,
      transferId,
      Config.REDIS.TRANSDATA_KEEP_SEC,
    );
    return true;
  }

  /**
   * Process transfer bet transaction
   * @param response
   * @param req
   * @param userObj
   * @param objThirdparty
   * @returns
   */
  async transferBetProcess(
    response: any,
    req: any,
    userObj: any,
    objThirdparty: any,
  ): Promise<void> {
    const isCheck = await this.transferIdCheck(req.transferId);
    if (!isCheck) {
      response.code = Status.DuplicatedSerialNo;
      response.msg = StatusStr.DuplicatedSerialNo;
      return;
    }

    // // gRPC aleady check.
    // save referenceId for cancel check.
    // const referencekey = this.getKeyDebitReferencePrefix(req.referenceId);
    // await this.redisService.set(
    //   referencekey,
    //   req.referenceId,
    //   Config.REDIS.TRANSDATA_KEEP_SEC,
    // );

    // call gRPC server.
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
      round_id: req?.transferId,
      trans_id: req?.transferId,
      amount: req?.amount,
      game_code: req.gameCode,
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: req,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      console.error(["TransferBetProcess processCall error : ", error]);
      response.code =
        this.accessCodeService.convertGrpcErrorStatusToText(
          Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN,
          error.statuscode,
        ) ?? Status.SystemError;
      response.msg = StatusStr.SystemError;
      return;
    } else {
      response.balance = result.balance;
      return;
    }
  }

  /**
   * Process transfer cancel transaction
   * @param response
   * @param req
   * @param userObj
   * @param objThirdparty
   */
  async transferCancelProcess(
    response: any,
    req: any,
    userObj: any,
    objThirdparty: any,
  ): Promise<void> {
    const isCheck = await this.transferIdCheck(req.transferId);
    if (!isCheck) {
      response.code = Status.DuplicatedSerialNo;
      response.msg = StatusStr.SystemError;
      return;
    }

    // gRPC aleady check.
    // // Cancel need check reference Id is same to bet
    // const referencekey = this.getKeyDebitReferencePrefix(req.referenceId);
    // const isExist = await this.redisService.get(referencekey);
    // if (!isExist) {
    //   response.code = Status.RelatedIdNotFound;
    //   response.msg = StatusStr.SystemError;
    //   return;
    // };

    // call gRPC server.
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
      round_id: req?.referenceId,
      trans_id: req?.referenceId,
      amount: req?.amount,
      game_code: req.gameCode,
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: req,
      callbackType: CallbackType.Refund,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      console.error(["transferCancelProcess processCall error : ", error]);

      //ALREADY_REFUNDED response success.
      //TODO: need Code 20203 confirm.
      if (error.statuscode == 20203) {
        response.code = Status.Success;
        response.msg = StatusStr.Success;
        response.balance = result.balance;
        return;
      }

      response.code =
        this.accessCodeService.convertGrpcErrorStatusToText(
          Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN,
          error.statuscode,
        ) ?? Status.SystemError;
      response.msg = StatusStr.SystemError;
      return;
    } else {
      response.balance = result.balance;
      // await this.redisService.del(referencekey); // success and release. // gRPC aleady check.
      return;
    }
  }

  /**
   * Process transfer result transaction
   * @param response
   * @param req
   * @param userObj
   * @param objThirdparty
   * @returns
   */
  async transferPayoutProcess(
    response: any,
    req: any,
    userObj: any,
    objThirdparty: any,
  ): Promise<void> {
    const isCheck = await this.transferIdCheck(req.transferId);
    if (!isCheck) {
      response.code = Status.DuplicatedSerialNo;
      response.msg = StatusStr.SystemError;
      return;
    }

    // call gRPC server.
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
      round_id: req?.referenceId,
      trans_id: req?.transferId,
      amount: req?.amount,
      game_code: req.gameCode,
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: true,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: req,
      callbackType: CallbackType.Result,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      console.error(["transferPayoutProcess processCall error : ", error]);
      response.code =
        this.accessCodeService.convertGrpcErrorStatusToText(
          Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN,
          error.statuscode,
        ) ?? Status.SystemError;
      response.msg = StatusStr.SystemError;
      return;
    } else {
      response.balance = result.balance;
      return;
    }
  }

  /**
   * Process transfer Bonus transaction
   * @param response
   * @param req
   * @param userObj
   * @param objThirdparty
   * @returns
   */
  async transferBonusProcess(
    response: any,
    req: any,
    userObj: any,
    objThirdparty: any,
  ): Promise<void> {
    const isCheck = await this.transferIdCheck(req.transferId);
    if (!isCheck) {
      response.code = Status.DuplicatedSerialNo;
      response.msg = StatusStr.DuplicatedSerialNo;
      return;
    }

    // Game companies may not bring
    const rId = req.roundId ? req.roundId : uuid();

    // call gRPC server. 1-bet, 2-result.
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
      round_id: rId,
      trans_id: req.transferId, // not use input value.
      amount: 0,
      game_code: req.gameCode,
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: req,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      console.error(["transferBonusProcess processCall[2] error : ", error]);
      response.code =
        this.accessCodeService.convertGrpcErrorStatusToText(
          Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN,
          error.statuscode,
        ) ?? Status.SystemError;
      response.msg = StatusStr.SystemError;
      return;
    }

    // call gRPC server. 2-result.
    const objParam2: ObjData = {
      cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
      round_id: rId,
      trans_id: req.transferId + "_bouns",
      amount: req.amount,
      game_code: req.gameCode,
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.EVENT_CASH,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj2 = this.accessCodeService.buildProcessRequest({
      body: req,
      callbackType: CallbackType.Result,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam2,
      lang: Lang.ko,
    });

    const reply2 = await this.coreGrpcService.processCall(processRequestObj2);
    const { result: result2, error: error2 } = reply2;
    if (error2) {
      console.error(["transferBonusProcess processCall[2] error : ", error2]);
      response.code =
        this.accessCodeService.convertGrpcErrorStatusToText(
          Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN,
          error2.statuscode,
        ) ?? Status.SystemError;
      response.msg = StatusStr.SystemError;
      return;
    }

    response.balance = result2.balance;
    return;
  }
}
