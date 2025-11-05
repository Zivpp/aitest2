import { BadRequestException, Delete, Injectable } from "@nestjs/common";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import { UserObj } from "../../Global/Service/interface/access.code.service.interface";

import * as _ from "lodash";

import { SUCCESS } from "../../Config/result.code";
import { CallbackType, Lang, Status } from "./Enum/bng.enum";
import { HandleRawDto } from "./Dto/bng.dto";
import { Config } from "../../Config/config";
import { GetBalanceResponse, LoginResponse } from "./Interface/bng.interface";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { Stats } from "fs";
import { v4 as uuid } from "uuid";

@Injectable()
export class BngService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly coreGrpcService: CoreGrpcService,
  ) {}

  /**
   * login & check user obj & gRPC call
   * @param body
   * @param objThirdparty
   * @param userObj
   */
  async login(
    body: HandleRawDto,
    objThirdparty: any,
    userObj: UserObj,
  ): Promise<LoginResponse> {
    // call gRPC Server
    const objParam: ObjData = {
      round_id: "",
      trans_id: uuid(),
      amount: 0,
      game_code: "",
      table_code: "",
      game_type: "",
      event_type: 0,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: body.uid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.MemberCheck,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    // if error, direct return error object
    if (error) {
      return {
        uid: body.uid,
        error: {
          code: this.accessCodeService.convertGrpcErrorStatusToText(
            Config.GRPC_RES_STATUS_MAP.PROVIDER.BNG,
            error.statuscode,
          ),
        },
      };
    }

    // success
    let response: LoginResponse;
    if (result?.result !== SUCCESS) {
      response = { uid: body.uid, error: { code: Status.INVALID_TOKEN } };
    } else {
      const opCode = this.accessCodeService.getOperatorCode(userObj.op);
      const userOpId = this.accessCodeService.getUserOPID(opCode, userObj.id);
      response = {
        uid: body.uid,
        player: {
          id: userOpId,
          brand: Config.BNG_GROUP.brand,
          currency: Config.CURRENCY.DEF,
          mode: "REAL",
          is_test: JSON.parse(objParam.cp_data).is_test,
        },
        balance: {
          value: result.balance.toString(),
          version: 0,
        },
        tag: "", // todo
        user: userObj,
      };
      // Use obj Result.user.key, but after wrapping it with proc callback,
      // the returned object does not have objResult.user.key, so the following will never be executed.
      let objBalance = await this.accessCodeService.setUserBalance(
        userObj.key.toString(),
        parseFloat(result.balance.toString()),
      );
      response.balance.version = objBalance.balance.version; // ??用意
      delete response.user;
    }
    return response;
  }

  /**
   * get balance
   * @param body
   * @param objThirdparty
   * @param userObj
   * @returns
   */
  async getBalance(
    body: HandleRawDto,
    objThirdparty: any,
    userObj: UserObj,
  ): Promise<GetBalanceResponse> {
    const objData = { ...body };
    const sResponse = { uid: objData.uid, balance: { value: "0", version: 0 } };
    const fResponse = {
      uid: objData.uid,
      balance: { value: "0", version: 0 },
      error: { code: "" },
    };
    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: body.uid, is_test: false }),
      round_id: "",
      trans_id: uuid(),
      amount: 0,
      game_code: "",
      table_code: "",
      game_type: "",
      event_type: 0,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Balance,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;

    sResponse.balance.value = result.balance.toString();
    let objBalance = await this.accessCodeService.setUserBalance(
      userObj.key.toString(),
      parseFloat(result.balance.toString()),
    );
    sResponse.balance.version = objBalance.balance.version;

    return sResponse;
  }

  /**
   * transaction
   * @param body
   * @param objThirdparty
   * @param userObj
   * @returns
   */
  async transaction(body: HandleRawDto, objThirdparty: any, userObj: UserObj) {
    const objData = { ...body };

    // if round_id or uid is not exist, return error
    if (!objData?.args?.round_id || !objData?.uid) {
      return {
        balance: {
          value: "0",
          version: Date.now(),
        },
        uid: null,
        error: {
          code: Status.OTHER_EXCEED,
        },
      };
    }

    let nEventType = Config.BET_EVENT_TYPE.NORMAL;
    if (objData?.args?.bonus) {
      objData.args.bet = "0";
      nEventType = Config.BET_EVENT_TYPE.EVENT_CASH;
    }
    // 라운드 카운트를 기록한다.
    // bet<value>, win<null> = bet
    // bet<null>, win<value> = result
    let response;
    const bet = objData?.args?.bet === null ? null : Number(objData?.args?.bet);
    const win = objData?.args?.win === null ? null : Number(objData?.args?.win);
    if (typeof bet === "number")
      response = await this.transactionBetGRPCCalling(
        objData,
        objThirdparty,
        userObj,
        nEventType,
      );

    // some time bet and win both value | bet X then dont run win
    if (typeof win === "number" && !response?.bError)
      response = await this.transactionResultGRPCCalling(
        objData,
        objThirdparty,
        userObj,
        nEventType,
      );

    let objBalance = await this.accessCodeService.setUserBalance(
      userObj.key.toString(),
      parseFloat(response.balance.value.toString()),
    );
    response.balance.version = objBalance.balance.version;
    delete response.bError;

    return response;
  }

  /**
   *
   * @param objData
   * @param objThirdparty
   * @param userObj
   * @param strBetTransID
   * @param nEventType
   * @returns
   */
  private async transactionBetGRPCCalling(
    objData: HandleRawDto,
    objThirdparty: any,
    userObj: UserObj,
    nEventType: number,
  ) {
    const sResponse = {
      uid: objData.uid,
      balance: { value: "0", version: Date.now() },
      bError: false,
    };
    const fResponse = {
      uid: objData.uid,
      balance: { value: "0", version: Date.now() },
      error: { code: "" },
      bError: true,
    };
    // call gRPC client
    let objParam1: ObjData = {
      round_id: objData.args.round_id?.toString() || "",
      trans_id: [objData.args.round_id, objData.uid].join("-"),
      amount: parseFloat(objData.args.bet || "0"),
      game_code: objData.game_id,
      game_type: Config.GAMECODE.SLOT,
      event_type: nEventType,
      table_code: "",
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: objData.uid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: objData,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam1,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      if ([20201, 5001, 20202].includes(error?.statuscode)) {
        sResponse.balance.value = result.balance.toString();
        return sResponse;
      } else {
        fResponse.error.code =
          this.accessCodeService.convertGrpcErrorStatusToText(
            Config.GRPC_RES_STATUS_MAP.PROVIDER.BNG,
            error.statuscode,
          );
        fResponse.balance.value = result.balance.toString();
        return fResponse;
      }
    }

    sResponse.balance.value = result.balance.toString();
    return sResponse;
  }

  /**
   * transactionCallGRPC2 | call gRPC 2 | transaction
   * @param objData
   * @param objThirdparty
   * @param userObj
   * @param strBetTransID
   * @param nEventType
   * @returns
   */
  private async transactionResultGRPCCalling(
    objData: HandleRawDto,
    objThirdparty: any,
    userObj: UserObj,
    nEventType: number,
  ) {
    const sResponse = {
      uid: objData.uid,
      balance: { value: "0", version: Date.now() },
    };
    const fResponse = {
      uid: objData.uid,
      balance: { value: "0", version: Date.now() },
      error: { code: "" },
    };
    // call gRPC client
    const objParam: ObjData = {
      round_id: objData.args.round_id?.toString() || "",
      trans_id: objData.uid,
      amount: parseFloat(objData.args.win || "0"),
      game_code: objData.game_id,
      game_type: Config.GAMECODE.SLOT,
      event_type: nEventType,
      is_end: objData.args.round_finished || false,
      cp_data: JSON.stringify({ tuid: objData.uid, is_test: false }),
      table_code: "",
      is_cancel_round: false,
      is_end_check: false,
    };
    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: objData,
      callbackType: CallbackType.Result,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });
    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      if ([20201, 5001, 20202].includes(error?.statuscode)) {
        sResponse.balance.value = result.balance.toString();
        return sResponse;
      } else {
        fResponse.error.code =
          this.accessCodeService.convertGrpcErrorStatusToText(
            Config.GRPC_RES_STATUS_MAP.PROVIDER.BNG,
            error.statuscode,
          );
        fResponse.balance.value = result.balance.toString();
        return fResponse;
      }
    }

    sResponse.balance.value = result.balance.toString();

    return sResponse;
  }

  async rollback(body: HandleRawDto, objThirdparty: any, userObj: UserObj) {
    const objData = { ...body };
    const sResponse = { uid: objData.uid, balance: { value: "0", version: 0 } };
    const fResponse = {
      uid: objData.uid,
      balance: { value: "0", version: 0 },
      error: { code: "", message: "" },
    };

    // call gRPC client
    const objParam = {
      round_id: body.args.round_id?.toString() || "",
      trans_id: [body.args.round_id, body.args.transaction_uid].join("-"),
      amount: parseFloat(body?.args?.bet ?? "0"),
      game_code: body.game_id,
      game_type: Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      cp_data: JSON.stringify({ tuid: body.uid, is_test: false }),
      table_code: "",
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Refund,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      if ([20203, 20200].includes(error?.statuscode)) {
        sResponse.balance.value = result.balance.toString();
        // return sResponse;
      } else {
        fResponse.error.code = Status.OTHER_EXCEED;
        fResponse.balance.value = result.balance.toString();
        fResponse.error.message = [
          result.error_msg,
          " [",
          result.result,
          "]",
        ].join("");
        fResponse.balance.version = Date.now();
        return fResponse;
      }
    }

    sResponse.balance.value = result.balance.toString();
    let objBalance = await this.accessCodeService.setUserBalance(
      userObj.key.toString(),
      parseFloat(sResponse.balance.value.toString()),
    );
    sResponse.balance.version = objBalance.balance.version;
    return sResponse;
  }
}
