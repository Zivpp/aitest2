import { Controller, Get, HttpCode, HttpStatus, Query, Res, UsePipes } from "@nestjs/common";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Req, Body } from "@nestjs/common";
import { FAILED, SUCCESS } from "../../Config/result.code";
import { Config, Game } from "../../Config/config";
import apiPath from "src/Config/api.path";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { GameReponse } from "./Interface/hrg.interface";
import { HrgService } from "./hrg.service";
import { v4 as uuidv4 } from "uuid";
import { CallbackType, Lang } from "src/Global/Service/Enum/access.code.enum";
import { CancelBetDto, EventSettleDto, PlaceBetDto, SettleDto } from "./Dto/hrg.dto";
import { GlobalDTOValidationPipe } from "src/Global/Pipes/global.dto.validation.pipe";

const OBJ_THIRDPARTY = Game.HRG;
const SUCCESS_CODE = "0000";
const BET_FAILED_CODE = "8001";
const FAIL_CODE = "9999"

@Controller()
export class HrgController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly hrgService: HrgService,
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
    // console.info("********* rawIP = ", rawIP);
    const allowList = Config.MAIN_APP_IP || [];
    const isAllowed = allowList.includes(rawIP);
    if (!isAllowed) {
      return { result: FAILED };
    }

    await this.accessCodeService.addUserObj(
      body?.token?.key,
      Game.HRG.cp_key.toString(),
      body.token,
    );

    return { result: SUCCESS };
  }

  @Post(apiPath.hrg.get_balance)
  @ApiOperation({
    summary: "get_balance",
  })
  @HttpCode(HttpStatus.OK)
  async bet(@Req() req, @Res() res, @Body() body): Promise<any> {
    const date = new Date(); // now
    const balanceTsStr = date.toISOString().replace('Z', '+0800');
    const response: GameReponse = {
      code: SUCCESS_CODE,
      balance: "0",
      balanceTs: balanceTsStr,
      desc: ""
    };
    const { userId } = body;

    const key = parseInt(
      userId.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      key.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: uuidv4(), is_test: false }),
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
      body,
      callbackType: CallbackType.Balance,
      objUser: userObj,
      objThirdParty: OBJ_THIRDPARTY,
      objData: objParam,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      response.code = FAIL_CODE;
      response.desc = "SESSION_ERROR"
      return res.send(response);
    }

    response.balance = result.balance.toString();

    return res.send(response);
  }

  @Post(apiPath.hrg.place_bet)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "place_bet",
  })
  @HttpCode(HttpStatus.OK)
  async place_bet(@Req() req, @Res() res, @Body() body: PlaceBetDto): Promise<any> {
    // const date = new Date(); // now
    // const balanceTsStr = date.toISOString().replace('Z', '+0800');
    const response: GameReponse = {
      code: SUCCESS_CODE,
      balance: "0",
      balanceTs: "",
      desc: ""
    };
    const { userId, tableId, roundId, betAmount, txId, gameCode, ts } = body;
    let strTableName;
    response.balanceTs = ts;

    const key = parseInt(
      userId.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      key.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      // response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      // response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    const tableInfo = this.accessCodeService.getTableInfo(OBJ_THIRDPARTY.cp_key, tableId);
    if (tableInfo) {
      strTableName = tableInfo.table_name;
    } else {
      strTableName = tableId;
    }

    // call gRPC client
    const round_id = [userId, roundId].join("-");
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: txId, is_test: false }),
      round_id: round_id,
      trans_id: txId,
      amount: Math.abs(Number(betAmount)),
      game_code: gameCode,
      table_code: strTableName,
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
      response.code = FAIL_CODE;
      response.desc = "SESSION_ERROR"
      return res.send(response);
    }

    // save in redis for cancel.
    const redisObj = JSON.stringify({
      amount: betAmount,
      table_code: strTableName,
      // table_type: table_type,
      round_id: round_id
    });
    // original: redis insert key txId: Value betAmount, TTL 1 Hour
    const redisKey = [OBJ_THIRDPARTY.CP_KEY, userObj.key, txId].join("_")
    await this.redisService.set(redisKey, redisObj, Config.REDIS.TRANSDATA_KEEP_SEC_MIN);

    response.balance = result.balance.toString();

    return res.send(response);
  }

  @Post(apiPath.hrg.cancel_bet)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "cancel_bet",
  })
  @HttpCode(HttpStatus.OK)
  async cancel_bet(@Req() req, @Res() res, @Body() body: CancelBetDto): Promise<any> {
    const response: GameReponse = {
      code: SUCCESS_CODE,
      balance: "0",
      balanceTs: "",
      desc: ""
    };
    const { userId, txId, gameCode, ts } = body;
    response.balanceTs = ts;

    const key = parseInt(
      userId.slice(Config.MAX_USER_ID_PREFIX_LEN),
    );
    const userObj = await this.accessCodeService.getUserObj(
      key.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    // 디비에서 table_code(tableId)를 가져와서 처리해야함. 레디스 json으로 저장하고 있다 가져 나올거 같음.
    const redisKey = [OBJ_THIRDPARTY.CP_KEY, userObj.key, txId].join("_")
    const redisStr = await this.redisService.get(redisKey) ?? "";
    // console.log('redisStr >>>', redisStr)
    const redisObj = JSON.parse(redisStr);
    if (!redisObj || !redisObj?.amount || !redisObj?.round_id) {
      response.desc = "INVALID_TXID"
      return res.send(response);
    }


    // call gRPC client
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: txId, is_test: false }),
      round_id: [userId, redisObj?.roundId].join("-"), // //round_id 를 가져오도록 처리
      trans_id: [txId].join("-"),
      amount: Math.abs(Number(redisObj?.amount)),
      game_code: gameCode,
      table_code: redisObj.table_code ?? "",
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
      response.code = FAIL_CODE;
      response.desc = "SESSION_ERROR"
      return res.send(response);
    }

    response.balance = result.balance.toString();

    return res.send(response);
  }

  @Post(apiPath.hrg.settle)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "settle",
  })
  @HttpCode(HttpStatus.OK)
  async settle(@Req() req, @Res() res, @Body() body: SettleDto): Promise<any> {
    const response: GameReponse = {
      code: SUCCESS_CODE,
      balance: "0",
      balanceTs: "",
      desc: ""
    };
    response.balanceTs = body.ts;

    const key = parseInt(body.userId.slice(Config.MAX_USER_ID_PREFIX_LEN));
    const userObj = await this.accessCodeService.getUserObj(
      key.toString(),
      OBJ_THIRDPARTY.cp_key.toString(),
    );
    if (!userObj) {
      response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      response.code = FAIL_CODE;
      response.desc = "INVALID_USER";
      return res.send(response);
    }

    const redisKey = [OBJ_THIRDPARTY.CP_KEY, userObj.key, body.txId].join("_")
    const redisStr = await this.redisService.get(redisKey) ?? "";
    // console.log('redisStr >>>', redisStr)
    const redisObj = JSON.parse(redisStr);
    if (!redisObj || !redisObj?.amount || !redisObj?.round_id) {
      response.desc = "INVALID_TXID"
      return res.send(response);
    }

    // call gRPC client
    const roundId = [body.userId, body?.roundId].join("-");
    const transId = ["R", body?.txId].join("-");
    const objParam: ObjData = {
      cp_data: JSON.stringify({ tuid: body.txId, is_test: false }),
      round_id: roundId,
      trans_id: transId,
      amount: Math.abs(Number(body?.winAmount)),
      game_code: body?.gameCode,
      table_code: typeof redisObj?.table_code !== "undefined" ? redisObj?.table_code : "",
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
      response.code = FAIL_CODE;
      response.desc = "SESSION_ERROR"
      return res.send(response);
    }

    response.balance = result.balance.toString();

    return res.send(response);
  }

  @Post(apiPath.hrg.event_settle)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "event_settle",
  })
  @HttpCode(HttpStatus.OK)
  async eventSettle(@Req() req, @Res() res, @Body() body: EventSettleDto): Promise<any> {
    const response: GameReponse = {
      code: SUCCESS_CODE,
      balance: "0",
      balanceTs: "",
      desc: ""
    };
    response.balanceTs = body.ts;

    if (typeof body?.settles == "undefined" || body?.settles.length <= 0) {
      res.send({ code: FAIL_CODE, desc: "INVALID_DATA" });
      return;
    }

    // mutilple settle
    const errorAry = {};
    for (const settle of body.settles) {
      const key = parseInt(settle?.userId?.slice(Config.MAX_USER_ID_PREFIX_LEN));
      const userObj = await this.accessCodeService.getUserObj(
        key.toString(),
        OBJ_THIRDPARTY.cp_key.toString(),
      );
      if (!userObj) {
        errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'INVALID_USER' }
        continue;
      }
      const inValid = this.accessCodeService.inValidToken(userObj);
      if (inValid) {
        errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'INVALID_USER' }
        continue;
      }

      // (1) call gRPC client : bet
      const objParamBet: ObjData = {
        cp_data: JSON.stringify({ tuid: settle?.settleId, is_test: false }),
        round_id: settle?.eventId,
        trans_id: settle?.eventId,
        amount: 0,
        game_code: settle?.settleId,
        table_code: "BONUS",
        game_type: OBJ_THIRDPARTY.game_type,
        event_type: Config.BET_EVENT_TYPE.EVENT_CASH,
        is_end: false,
        is_cancel_round: false,
        is_end_check: false,
      };

      const reBet = this.accessCodeService.buildProcessRequest({
        body,
        callbackType: CallbackType.Bet,
        objUser: userObj,
        objThirdParty: OBJ_THIRDPARTY,
        objData: objParamBet,
        lang: Lang.ko,
      });

      const replyBet = await this.coreGrpcService.processCall(reBet);
      const { result: resultBet, error: errorBet } = replyBet;
      if (errorBet) {
        errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'SESSION_ERROR' }
        continue;
      }

      // (2) call gRPC client : Result
      const objParamResult: ObjData = {
        cp_data: JSON.stringify({ tuid: settle?.settleId, is_test: false }),
        round_id: settle?.eventId,
        trans_id: ["evt", settle?.eventId].join("-"),
        amount: Math.abs(Number(settle?.amount)),
        game_code: settle?.settleId,
        table_code: "",
        game_type: OBJ_THIRDPARTY.game_type,
        event_type: Config.BET_EVENT_TYPE.EVENT_CASH,
        is_end: true,
        is_cancel_round: false,
        is_end_check: false,
      };

      const reResult = this.accessCodeService.buildProcessRequest({
        body,
        callbackType: CallbackType.Result,
        objUser: userObj,
        objThirdParty: OBJ_THIRDPARTY,
        objData: objParamResult,
        lang: Lang.ko,
      });

      const replyResult = await this.coreGrpcService.processCall(reResult);
      const { result: resultResult, error: errorResult } = replyResult;
      if (errorResult) {
        errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'SESSION_ERROR' }
        continue;
      }
    } // FOR END

    // END
    // failed
    if (Object.keys(errorAry).length > 0) {
      res.send({ code: FAIL_CODE, desc: "Something error", errorAry })
    }
    // success
    res.send({ code: SUCCESS_CODE, desc: "Success" })
  }

}
