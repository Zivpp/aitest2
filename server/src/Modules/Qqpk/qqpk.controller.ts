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
import { SessionDto, SidDto } from "./Dto/qqpk.dto";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { CallbackType, Lang } from "src/Global/Service/Enum/access.code.enum";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { Status, StatusStr } from "./Enum/qqpk.enum";
import { QqpkService } from "./qqpk.service";
import {
  BalanceResponse,
  CreditRequest,
  CreditResponse,
  DebitRequest,
  DebitResponse,
  QqpkRequest,
} from "./Interface/qqpk.interface";

@Controller()
export class QqpkController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly qqpkService: QqpkService,
    private readonly apiService: ApiService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) { }

  @Post(apiPath.qqpk.makeSign)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "makeSign",
  })
  async makeSign(@Req() req, @Res() res, @Body() body): Promise<string> {
    const result = { hash: "" };
    result.hash = await this.qqpkService.makeSign(body);
    return res.send(result);
  }

  @Post(apiPath.qqpk.sid)
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

  @Post(apiPath.qqpk.session)
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

    const key = await this.qqpkService.addTokenSign(
      Number(body?.token?.op),
      body?.token?.key,
      tokenSign,
    );

    return { result: SUCCESS, key };
  }

  @Post(apiPath.qqpk.balance)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "balance",
  })
  @HttpCode(HttpStatus.OK)
  async balance(@Req() req, @Res() res, @Body() body): Promise<any> {
    const bodyOby: QqpkRequest = body;
    const response = <BalanceResponse>{};
    response.status_code = Status.Success;
    response.message = StatusStr.Success;
    response.data = {
      account: body?.account,
      currency: Config.CURRENCY.DEF,
      balance: 0, // call gRPC take it.
    };

    // check sign
    if (!bodyOby?.sign || bodyOby.sign !== this.qqpkService.makeSign(bodyOby)) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    const objThirdparty = Game.QQPK;
    if (!objThirdparty) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    const userObj = await this.qqpkService.getUserIndObj(bodyOby?.account);
    if (!userObj) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.InvalidPlayerID;
      return res.send(response);
    }
    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: bodyOby?.sign, is_test: false }),
      round_id: "",
      trans_id: "",
      amount: 0,
      game_code: "",
      table_code: "",
      game_type: Config.GAMECODE.BORD,
      event_type: 0,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: bodyOby,
      callbackType: CallbackType.Balance,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    response.data.balance = result.balance;

    return res.send(response);
  }

  @Post(apiPath.qqpk.debit)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "debot",
  })
  @HttpCode(HttpStatus.OK)
  async debit(@Req() req, @Res() res, @Body() body): Promise<any> {
    const bodyOby: DebitRequest = body;
    const response = <DebitResponse>{};
    response.status_code = Status.Success;
    response.message = StatusStr.Success;
    response.data = {
      money: bodyOby.money,
      account: bodyOby.account,
      currency: Config.CURRENCY.DEF,
      balance: 0, // call gRPC take it.
    };
    // check sign
    if (!bodyOby?.sign || bodyOby.sign !== this.qqpkService.makeSign(bodyOby)) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    const objThirdparty = Game.QQPK;
    if (!objThirdparty) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    const userObj = await this.qqpkService.getUserIndObj(bodyOby?.account);
    if (!userObj) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.InvalidPlayerID;
      return res.send(response);
    }
    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: bodyOby?.sign, is_test: false }),
      round_id: [bodyOby?.account, bodyOby?.etransgroup].join("_"),
      trans_id: bodyOby?.etransid,
      amount: Math.abs(Number(bodyOby?.money)),
      game_code: bodyOby?.kindid?.toString() ?? "",
      table_code: bodyOby?.etransgroup,
      game_type: Config.GAMECODE.BORD,
      event_type: Config.BET_EVENT_TYPE.CASHWITHDRAW,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: bodyOby,
      callbackType: CallbackType.Withdraw,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    response.data.balance = result.balance;

    return res.send(response);
  }

  @Post(apiPath.qqpk.credit)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "credit",
  })
  @HttpCode(HttpStatus.OK)
  async credit(@Req() req, @Res() res, @Body() body): Promise<any> {
    const bodyOby: CreditRequest = body;
    const response = <CreditResponse>{};
    response.status_code = Status.Success;
    response.message = StatusStr.Success;
    response.data = {
      money: bodyOby.money,
      account: bodyOby.account,
      currency: Config.CURRENCY.DEF,
      balance: 0, // call gRPC take it.
    };
    // check sign
    if (!bodyOby?.sign || bodyOby.sign !== this.qqpkService.makeSign(bodyOby)) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    const objThirdparty = Game.QQPK;
    if (!objThirdparty) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    const userObj = await this.qqpkService.getUserIndObj(bodyOby?.account);
    if (!userObj) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.InvalidPlayerID;
      return res.send(response);
    }
    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: bodyOby?.sign, is_test: false }),
      round_id: [bodyOby?.account, bodyOby?.etransgroup].join("_"),
      trans_id: bodyOby?.etransid,
      amount: Math.abs(Number(bodyOby?.money)),
      game_code: bodyOby?.kindid?.toString() ?? "",
      table_code: bodyOby?.etransgroup,
      game_type: Config.GAMECODE.BORD,
      event_type: Config.BET_EVENT_TYPE.CASHDEPOSIT,
      is_end: true,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: bodyOby,
      callbackType: CallbackType.Deposit,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      delete response.data;
      response.status_code = Status.Error;
      response.message = StatusStr.UnknownError;
      return res.send(response);
    }

    response.data.balance = result.balance;

    return res.send(response);
  }
}
