import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import * as _ from "lodash";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import apiPath from "../../Config/api.path";
import { FAILED, SUCCESS } from "../../Config/result.code";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { Config } from "../../Config/config";
import { GlobalDTOValidationPipe } from "../../Global/Pipes/global.dto.validation.pipe";
import { TokenWrapper } from "../../Global/Service/interface/access.code.service.interface";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { Game } from "../../Config/config";
import { v4 as uuid } from "uuid";
import { Status, StatusStr } from "./Enum/fastspin.enum";
import { FastSpinService } from "./fastspin.service";
import {
  DepositDto,
  GetAcctInfoDto,
  GetBalanceDto,
  SessionDto,
  SidDto,
} from "./Dto/fastspin.dto";
import {
  AccountInfo,
  DepositResponse,
  GetAcctInfoResponse,
  GetBalanceAcctInfo,
  GetBalanceResponse,
  Transfer7,
  TransferRequest,
  TransferResponse,
} from "./Interface/fastspin.interface";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { CallbackType, Lang } from "src/Global/Service/Enum/access.code.enum";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { status } from "@grpc/grpc-js";
import { verify } from "crypto";
import { Brackets } from "typeorm";

@Controller()
export class FastSpinController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly fastSpinService: FastSpinService,
    private readonly apiService: ApiService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) { }

  @Post(apiPath.fastpain.routerCenter)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "routerCenter, all api entry point ; by hearders.API ; string",
  })
  @HttpCode(HttpStatus.OK)
  async routerCenter(@Req() req, @Res() res, @Body() body: any) {
    const apiIndex = req.headers["api"] as string;
    switch (apiIndex) {
      case "getHash":
        return this.getHash(body, res);
      case "sid":
        return this.sid(body, res);
      case "session":
        return this.session(req, body);
      case "getBalance":
        return this.getBalance(req, res, body);
      case "transfer":
        return this.transfer(req, res, body);
      // case "getAcctInfo":
      //   return this.getAcctInfo(req, res, body);
      // case "deposit":
      //   return this.deposit(body, res);
      default:
        return res.send({ code: FAILED, msg: "no march any API service." });
    }
  }

  @Post(apiPath.fastpain.getHash)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "getHash",
  })
  async getHash(@Req() req, @Res() res): Promise<string> {
    const result = { hash: "" };
    result.hash = await this.fastSpinService.getDigest(req);
    return res.send(result);
  }

  @Post(apiPath.fastpain.sid)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "sid",
  })
  @HttpCode(HttpStatus.OK)
  async sid(@Body() body: SidDto, @Res() res): Promise<any> {
    const _LOG_TAG = "Fastspin";
    console.log(`[${_LOG_TAG}] API /sid request = `, body);

    const userInfo = await this.accessCodeService.getUserInfo(body.userId);

    if (!userInfo) {
      return res.send({
        status: "Failed : No search any user by : " + body.userId,
        sid: "",
        uuid: body.uuid,
      });
    }

    const objToken = {
      key: userInfo.user_key,
      v: userInfo.v ?? 1,
      id: userInfo.user_id_org,
      op: userInfo.op_id,
      c: Game.BNG.cp_key,
      g: userInfo.gamcode,
      dt: userInfo.times ?? Date.now(),
      sg: uuid().replace(/-/g, ""),
      bl: userInfo.betlimit,
      tr: userInfo.tr,
    };
    console.info("objToken = ", objToken);
    const token = JSON.stringify(objToken);
    const sid = objToken.sg;
    console.info(`[${_LOG_TAG}] API /sid = `, sid);

    const strSessionKey: string = [
      "s",
      Game.FASTSPIN.cp_key.toString(),
      body.userId,
    ].join("_");
    await this.redisService.set(strSessionKey, token);

    return res.send({ status: "OK", sid: sid, uuid: body.uuid });
  }

  @Post(apiPath.fastpain.session)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "session",
  })
  @HttpCode(HttpStatus.OK)
  async session(@Req() req, @Body() body: SessionDto): Promise<any> {
    const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
    const allowList = Config.MAIN_APP_IP || [];
    const isAllowed = allowList.includes(rawIP);

    if (!isAllowed) {
      return { result: FAILED };
    }

    // add token sign
    const tokenSign: TokenWrapper = {
      token: body?.token,
      update_time: Date.now(),
    };

    // await this.accessCodeService.addToken_sign(tokenSign, body?.token?.c);
    await this.fastSpinService.addTokenSign(
      Number(body?.token?.op),
      body?.token?.key,
      tokenSign,
    );

    return { result: SUCCESS };
  }

  @Post(apiPath.fastpain.getAcctInfo)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "getAcctInfo",
  })
  async getAcctInfo(
    @Req() req,
    @Res() res,
    @Body() body: GetAcctInfoDto,
  ): Promise<GetAcctInfoResponse> {
    const response = <GetAcctInfoResponse>{};
    const accountInfo = <AccountInfo>{};
    accountInfo.userName = "";
    accountInfo.currency = "";
    accountInfo.acctId = body.acctId;
    accountInfo.balance = 0;
    response.list = [accountInfo];
    response.resultCount = 1;
    response.pageCount = 1;
    response.merchantCode = body.merchantCode ?? "";
    response.serialNo = body?.serialNo ?? "";
    response.code = Status.Success;
    response.msg = StatusStr.Success;

    // degest verify
    const _digest = req.headers["digest"] as string;
    const isVify = await this.fastSpinService.verifyDigest(_digest, req);
    if (isVify !== Status.Success) {
      response.code = Status.TokenValidationFailed;
      response.msg = StatusStr.TokenValidationFailed;
      return res.send(response);
    }

    const objThirdparty = Game.FASTSPIN;
    if (!objThirdparty) {
      return res.status(HttpStatus.BAD_REQUEST).send(Config.RESPONSE_ERROR);
    }

    const userObj = await this.accessCodeService.getUserObj(
      body?.acctId,
      objThirdparty?.cp_key?.toString(),
    );
    if (!userObj) {
      response.code = Status.AcctNotFound;
      response.msg = StatusStr.AcctNotFound;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = Status.AcctInactive;
      response.msg = StatusStr.AcctInactive;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: body.serialNo, is_test: false }),
      round_id: "",
      trans_id: uuid(),
      amount: 0,
      game_code: "",
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
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
    if (error) {
      console.error(["[getAcctInfo] error : ", error]);
      response.code = Status.SystemError;
      response.msg = StatusStr.SystemError;
      return res.send(response);
    }

    accountInfo.userName = userObj.id;
    accountInfo.balance = result.balance;
    accountInfo.currency = Config.CURRENCY.DEF;
    response.list = [accountInfo];

    return res.send(response);
  }

  @Post(apiPath.fastpain.deposit)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "deposit",
  })
  async deposit(
    @Req() req,
    @Res() res,
    @Body() body: DepositDto,
  ): Promise<DepositResponse> {
    const response = <DepositResponse>{};
    response.transactionId = uuid().replace(/-/g, "").substring(0, 20); // Varchar(20) ; System generated unique id.
    response.merchantCode = body.merchantCode;
    response.afterBalance = 0;
    response.code = Status.Success;
    response.msg = StatusStr.Success;
    response.serialNo = body.serialNo;

    // degest verify
    const _digest = req.headers["digest"] as string;
    const isVify = await this.fastSpinService.verifyDigest(_digest, req);
    if (isVify !== Status.Success) {
      response.code = Status.TokenValidationFailed;
      response.msg = StatusStr.TokenValidationFailed;
      return res.send(response);
    }

    const objThirdparty = Game.FASTSPIN;
    if (!objThirdparty) {
      return res.status(HttpStatus.BAD_REQUEST).send(Config.RESPONSE_ERROR);
    }

    const userObj = await this.accessCodeService.getUserObj(
      body?.acctId,
      objThirdparty?.cp_key?.toString(),
    );
    if (!userObj) {
      response.code = Status.AcctNotFound;
      response.msg = StatusStr.AcctNotFound;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = Status.AcctInactive;
      response.msg = StatusStr.AcctInactive;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: body.serialNo, is_test: false }),
      round_id: "",
      trans_id: response.transactionId,
      amount: Math.abs(Number(body.amount)),
      game_code: "",
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
      event_type: 0,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      console.error(["[deposit] error : ", error]);
      response.code = Status.SystemError;
      response.msg = StatusStr.SystemError;
      return res.send(response);
    }

    response.afterBalance = result.balance;

    return res.send(response);
  }

  @Post(apiPath.fastpain.getBalance)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "getBalance",
  })
  async getBalance(
    @Req() req,
    @Res() res,
    @Body() body: GetBalanceDto,
  ): Promise<GetBalanceResponse> {
    const response = <GetBalanceResponse>{};
    response.acctInfo = <GetBalanceAcctInfo>{};
    response.acctInfo.userName = "";
    response.acctInfo.currency = "";
    response.acctInfo.acctId = body?.acctId;
    response.merchantCode = body.merchantCode ?? "";
    response.serialNo = body?.serialNo ?? "";
    response.acctInfo.balance = 0;
    response.code = Status.Success;

    // degest verify
    const _digest = req.headers["digest"] as string;
    const isVify = await this.fastSpinService.verifyDigest(_digest, req);
    if (isVify !== Status.Success) {
      response.code = Status.TokenValidationFailed;
      response.msg = StatusStr.TokenValidationFailed;
      return res.send(response);
    }

    const userObj = await this.fastSpinService.getUserIndObj(body?.acctId);
    if (!userObj) {
      response.code = Status.AcctNotFound;
      response.msg = StatusStr.AcctNotFound;
      return res.send(response);
    }
    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = Status.AcctInactive;
      response.msg = StatusStr.AcctInactive;
      return res.send(response);
    }

    const objThirdparty = Game.FASTSPIN;
    if (!objThirdparty) {
      return res.status(HttpStatus.BAD_REQUEST).send(Config.RESPONSE_ERROR);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: body.serialNo, is_test: false }),
      round_id: "",
      trans_id: "",
      amount: 0,
      game_code: body.gameCode ?? "",
      table_code: "",
      game_type: Config.GAMECODE.SLOT,
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
    if (error) {
      console.error([
        "FastSpinController-",
        "getBalance-",
        "gRPC-",
        "error : ",
        error,
      ]);
      return res.send({
        uid: body?.serialNo,
        error: { code: Status.SystemError },
      });
    }

    response.acctInfo.userName = userObj.id;
    response.acctInfo.currency = Config.CURRENCY.DEF;
    response.acctInfo.balance = result.balance;
    response.msg = StatusStr.Success;

    return res.send(response);
  }

  @Post(apiPath.fastpain.transfer)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "transfer",
  })
  async transfer(
    @Req() req,
    @Res() res,
    @Body() body: any,
  ): Promise<TransferResponse> {
    // init
    let dataObj;
    if (body?.type !== 7) {
      dataObj = body as TransferRequest;
    } else {
      dataObj = body as Transfer7;
    }
    const response = <TransferResponse>{};
    response.transferId = dataObj?.transferId;
    response.merchantCode = dataObj?.merchantCode;
    response.merchantTxId = uuid(); // Merchant transaction id
    response.acctId = dataObj?.acctId;
    response.balance = 0;
    response.msg = StatusStr.Success;
    response.code = Status.Success;
    response.serialNo = dataObj?.serialNo;

    // check amounts //It's okay if the amount is 0
    if (!dataObj?.type) {
      response.code = Status.InvalidParameters;
      response.msg = StatusStr.InvalidParameters;
      return res.send(response);
    }

    // degest verify
    const _digest = req.headers["digest"] as string;
    const isVify = await this.fastSpinService.verifyDigest(_digest, req);
    if (isVify !== Status.Success) {
      response.code = Status.TokenValidationFailed;
      response.msg = StatusStr.TokenValidationFailed;
      return res.send(response);
    }

    const userObj = await this.fastSpinService.getUserIndObj(body?.acctId);
    if (!userObj) {
      response.code = Status.AcctNotFound;
      response.msg = StatusStr.AcctNotFound;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = Status.AcctInactive;
      response.msg = StatusStr.AcctInactive;
      return res.send(response);
    }

    const objThirdparty = Game.FASTSPIN;
    if (!objThirdparty) {
      return res.status(HttpStatus.BAD_REQUEST).send(Config.RESPONSE_ERROR);
    }

    switch (dataObj?.type) {
      case 1:
        await this.fastSpinService.transferBetProcess(
          response,
          dataObj,
          userObj,
          objThirdparty,
        );
        break;
      case 2:
        await this.fastSpinService.transferCancelProcess(
          response,
          dataObj,
          userObj,
          objThirdparty,
        );
        break;
      case 4:
        await this.fastSpinService.transferPayoutProcess(
          response,
          dataObj,
          userObj,
          objThirdparty,
        );
        break;
      case 7:
        await this.fastSpinService.transferBonusProcess(
          response,
          dataObj,
          userObj,
          objThirdparty,
        );
        break;
      default:
        response.code = Status.MissingParameters;
        response.msg = StatusStr.MissingParameters;
        return res.send(response);
    }

    return res.send(response); // The contents are determined by each process
  }
}
