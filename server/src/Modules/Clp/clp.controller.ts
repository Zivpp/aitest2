import { Controller, Get, HttpCode, HttpStatus, Query, Res } from "@nestjs/common";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { ClpService } from "./clp.service";
import { Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Req, Body } from "@nestjs/common";
import { FAILED, SUCCESS } from "../../Config/result.code";
import { Config, Game } from "../../Config/config";
import apiPath from "src/Config/api.path";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { CallbackType, Lang } from "./Enum/clp.enum";
import { GameResponse } from "./Interface/clp.interface";

const OBJ_THIRDPARTY = Game.CLP;
const CP_RESULT_CODE = OBJ_THIRDPARTY.result_code;

@Controller()
export class ClpController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly clpService: ClpService,
    private readonly apiService: ApiService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) { }

  @Post(apiPath.clp.session)
  @ApiOperation({
    summary: "session",
  })
  async session(@Req() req, @Body() body): Promise<any> {
    const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
    console.info("********* rawIP = ", rawIP);
    const allowList = Config.MAIN_APP_IP || [];
    const isAllowed = allowList.includes(rawIP);
    if (!isAllowed) {
      return { result: FAILED };
    }

    await this.accessCodeService.addUserObj(
      body?.token?.key,
      Game.CLP.cp_key.toString(),
      body.token,
    );

    return { result: SUCCESS };
  }

  @Get(apiPath.clp.api.seamless.getBalance)
  @ApiOperation({
    summary: "getBalance",
  })
  @HttpCode(HttpStatus.OK)
  async getBalance(@Req() req, @Res() res, @Query() query): Promise<any> {
    const _PARAMS_ERROR = "PARAMS ERROR";
    const _INVALID_USER_ID = "INVALID USER ID";
    const _SESSION_ERROR = "SESSION ERROR";
    const response = <GameResponse>{
      code: CP_RESULT_CODE.success,
      data: { balance: 0 },
      msg: "",
    };

    const { authorization } = req.headers;
    const { player_unique_id } = query;
    if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    if (!player_unique_id) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    const userId = parseInt(
      player_unique_id.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      userId.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: player_unique_id, is_test: false }),
      round_id: "",
      trans_id: "",
      amount: 0,
      game_code: "",
      table_code: "",
      game_type: OBJ_THIRDPARTY.game_type,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: query,
      callbackType: CallbackType.Balance,
      objUser: userObj,
      objThirdParty: OBJ_THIRDPARTY,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _SESSION_ERROR;
      return res.send(response);
    }

    delete response.msg;
    response.data.balance = result.balance;

    return res.send(response);
  }

  @Post(apiPath.clp.api.seamless.bet)
  @ApiOperation({
    summary: "bet",
  })
  @HttpCode(HttpStatus.OK)
  async bet(@Req() req, @Res() res, @Body() body): Promise<any> {
    const _PARAMS_ERROR = "PARAMS ERROR";
    const _INVALID_USER_ID = "INVALID USER ID";
    const _SESSION_ERROR = "SESSION ERROR";
    const response = <GameResponse>{
      code: CP_RESULT_CODE.success,
      data: { balance: 0 },
      msg: "",
    };
    const { authorization } = req.headers;
    const {
      player_unique_id,
      amount,
      is_buy,
      game,
      game_round_id,
      currency,
      transaction_id,
    } = body;

    if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    if (
      typeof amount === "undefined" ||
      typeof is_buy === "undefined" ||
      !game ||
      !game_round_id ||
      !currency ||
      !player_unique_id
    ) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    const userId = parseInt(
      player_unique_id.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      userId.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: game_round_id, is_test: false }),
      round_id: [game_round_id].join("_"),
      trans_id: transaction_id,
      amount: Math.abs(Number(amount)),
      game_code: game,
      table_code: "",
      game_type: OBJ_THIRDPARTY.game_type,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: OBJ_THIRDPARTY,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _SESSION_ERROR;
      return res.send(response);
    }

    delete response.msg;
    response.data.balance = result.balance;

    return res.send(response);
  }

  @Post(apiPath.clp.api.seamless.settlement)
  @ApiOperation({
    summary: "settlement",
  })
  @HttpCode(HttpStatus.OK)
  async settlement(@Req() req, @Res() res, @Body() body): Promise<any> {
    const _PARAMS_ERROR = "PARAMS ERROR";
    const _INVALID_USER_ID = "INVALID USER ID";
    const _SESSION_ERROR = "SESSION ERROR";
    const response = <GameResponse>{
      code: CP_RESULT_CODE.success,
      data: { balance: 0 },
      msg: "",
    };

    const { authorization } = req.headers;
    const {
      player_unique_id,
      amount,
      valid_bet,
      is_buy,
      transaction_id,
      game,
      game_round_id,
      currency,
    } = body;

    if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    if (
      typeof amount === "undefined" ||
      typeof is_buy === "undefined" ||
      typeof valid_bet === "undefined" ||
      !game ||
      !game_round_id ||
      !currency ||
      !player_unique_id ||
      !transaction_id
    ) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    const userId = parseInt(
      player_unique_id.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      userId.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: game_round_id, is_test: false }),
      round_id: [game_round_id].join("_"),
      trans_id: ["R", transaction_id].join("-"),
      amount: Math.abs(Number(amount)),
      game_code: game,
      table_code: "",
      game_type: OBJ_THIRDPARTY.game_type,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: true,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Result,
      objUser: userObj,
      objThirdParty: OBJ_THIRDPARTY,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _SESSION_ERROR;
      return res.send(response);
    }

    delete response.msg;
    response.data.balance = parseFloat(result.balance.toString());

    return res.send(response);
  }

  @Post(apiPath.clp.api.seamless.cancel)
  @ApiOperation({
    summary: "cancel",
  })
  @HttpCode(HttpStatus.OK)
  async cancel(@Req() req, @Res() res, @Body() body): Promise<any> {
    const _PARAMS_ERROR = "PARAMS ERROR";
    const _INVALID_USER_ID = "INVALID USER ID";
    const _SESSION_ERROR = "SESSION ERROR";
    const response = <GameResponse>{
      code: CP_RESULT_CODE.success,
      data: { balance: 0 },
      msg: "",
    };

    const { authorization } = req.headers;
    const {
      player_unique_id,
      transaction_id,
      game,
      game_round_id,
      currency,
      amount,
    } = body;

    if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    if (
      !game ||
      !game_round_id ||
      !currency ||
      !player_unique_id ||
      !transaction_id
    ) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _PARAMS_ERROR;
      return res.send(response);
    }

    const userId = parseInt(
      player_unique_id.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      userId.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = CP_RESULT_CODE.invalid_user_id;
      response.msg = _INVALID_USER_ID;
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: game_round_id, is_test: false }),
      round_id: [game_round_id].join("_"),
      trans_id: transaction_id,
      amount: Math.abs(Number(amount)),
      game_code: game,
      table_code: "",
      game_type: OBJ_THIRDPARTY.game_type,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Refund,
      objUser: userObj,
      objThirdParty: OBJ_THIRDPARTY,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      response.code = CP_RESULT_CODE.session_error;
      response.msg = _SESSION_ERROR;
      return res.send(response);
    }

    delete response.msg;
    response.data.balance = result.balance;

    return res.send(response);
  }
}
