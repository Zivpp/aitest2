import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UsePipes,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import * as _ from "lodash";

import { GlobalDTOValidationPipe } from "../../Global/Pipes/global.dto.validation.pipe";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { Config, Game } from "../../Config/config";
import apiPath from "../../Config/api.path";
import { base64encode } from "nodejs-base64";

import { CallbackType, Lang, Status } from "./Enum/evolution.enum";
import {
  BalanceDto,
  CancelDto,
  CheckDto,
  CreditDto,
  DebitDto,
  sessionDto,
  SidDto,
} from "./Dto/evolution.dto";
import { EvolutionService } from "./evolution.service";
import { FAILED, SUCCESS } from "../../Config/result.code";
import {
  BalanceResponse,
  CancelResponse,
  CheckUserResponse,
  CreditResponse,
  DebitResponse,
  EvolutionDebitCheck,
  PromoPayoutResponse,
} from "./Interface/evolution.interface";
import { PromoPayoutDto } from "./Dto/evolution.promo.payout.dto";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { v4 as uuid } from "uuid";
import { RedisService } from "src/Infrastructure/Redis/redis.service";

@Controller()
export class EvolutionController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly evolutionService: EvolutionService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) { }

  @Get(apiPath.evolution.getConfig)
  async getConfig(@Res() res) {
    const tableList = await this.accessCodeService.getFullTableInfoList();
    const gameCodeList = await this.accessCodeService.getFullGameCPKey();
    return res.send({ tableList, gameCodeList });
  }

  @Post(apiPath.evolution.sid)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "sid",
  })
  async sid(@Body() body: SidDto, @Res() res): Promise<any> {
    console.log("EVOLUTION API /sid request : ", body);

    const userInfo = await this.accessCodeService.getUserInfo(body.userId);
    // console.log('userInfo >>>>>', userInfo)
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
      c: Game.Evolution.cp_key,
      g: userInfo.gamcode,
      dt: userInfo.times ?? Date.now(),
      sg: uuid().replace(/-/g, ""),
      bl: userInfo.betlimit,
      tr: userInfo.tr,
    };
    console.info("objToken = ", objToken);
    const token = JSON.stringify(objToken);
    const sid = objToken.sg;
    console.info("EVOLUTION API sid = : ", sid);

    const strSessionKey: string = [
      "s",
      Game.Evolution.cp_key.toString(),
      body.userId,
    ].join("_");
    await this.redisService.set(strSessionKey, token);

    return res.send({ status: "OK", sid: sid, uuid: body.uuid });
  }

  @Post(apiPath.evolution.session)
  @ApiOperation({
    summary: "session & save userInfo in redis.",
  })
  async session(@Body() body: sessionDto, @Req() req): Promise<any> {
    const rawIP = req.ip?.replace("::ffff:", "") || "unknown";
    const allowList = Config.MAIN_APP_IP || [];
    const isAllowed = allowList.includes(rawIP);
    if (!isAllowed) {
      return { result: FAILED };
    }

    await this.accessCodeService.addUserObj(
      body.user_id,
      Game.Evolution.cp_key.toString(),
      body.token,
    );

    return { result: SUCCESS };
  }

  @Post(apiPath.evolution.check)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary:
      "Should be used for additional validation of redirected user and sid.",
  })
  async check(@Body() body: CheckDto): Promise<CheckUserResponse> {
    const strUserID = body.userId;
    const strToken = body.sid;
    const uuid = body.uuid;
    const checkUserResponse = <CheckUserResponse>{};
    checkUserResponse.sid = strToken;
    checkUserResponse.uuid = uuid;

    // check user obj
    const userObj = await this.accessCodeService.getUserObj(
      strUserID,
      Game.Evolution.cp_key.toString(),
    );
    if (!userObj) {
      checkUserResponse.status = Status.INVALID_PARAMETER; // 客戶要求
      return checkUserResponse;
    }
    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      checkUserResponse.status = Status.INVALID_TOKEN_KEY;
      return checkUserResponse;
    }

    // Check if the user id meets the standard
    const userIdCheck = this.evolutionService.userIdCheck(userObj, strUserID);
    if (!userIdCheck) {
      checkUserResponse.status = Status.INVALID_PARAMETER;
      return checkUserResponse;
    }

    // Check company whether the configuration file exists
    const objThirdparty = this.accessCodeService.getThirdparty(
      userObj.c.toString(),
    );
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      checkUserResponse.status = Status.INVALID_TOKEN_ID;
      return checkUserResponse;
    }

    //  call gRPC server
    const keySize = Config.MAX_USER_KEY_SIZE;
    const paddedKey = userObj.key.toString().padStart(keySize!, "0");

    const objData = <ObjData>{
      round_id: [paddedKey, "@", userObj.id].join(""), // Unsure
      trans_id: uuid, // Unsure
      amount: 0, // Unsure ; /check no money
      game_code: "", // Unsure
      table_code: "", // Unsure
      game_type:
        objThirdparty.cp_key === Config.EVOLUTION_GROUP.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT, // Unsure
      event_type: Config.BET_EVENT_TYPE.NORMAL, // Unsure
      is_end: false, // Unsure
      is_cancel_round: false, // Unsure
      is_end_check: false, // Unsure
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body: objData,
      callbackType: CallbackType.MemberCheck,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;

    checkUserResponse.status = error
      ? this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error.statuscode,
      )
      : this.evolutionService.convertGrpcStatusToText(
        CallbackType.MemberCheck,
        result?.result,
      );

    return checkUserResponse;
  }

  @Post(apiPath.evolution.balance)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: `Used to get user's balance`,
  })
  async balance(@Body() body: BalanceDto): Promise<BalanceResponse> {
    const balanceResponse = <BalanceResponse>{};
    balanceResponse.uuid = body.uuid;

    const userObj = await this.accessCodeService.getUserObj(
      body.userId,
      Game.Evolution.cp_key.toString(),
    );
    if (!userObj) {
      balanceResponse.status = Status.INVALID_PARAMETER; // 客戶要求
      return balanceResponse;
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      balanceResponse.status = Status.INVALID_TOKEN_KEY;
      return balanceResponse;
    }

    const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
    if (!userIdCheck) {
      balanceResponse.status = Status.INVALID_PARAMETER;
      return balanceResponse;
    }

    // get objThirdparty
    let objThirdparty;

    if (!body.game?.details?.table?.id) {
      // 沒有 table 資訊的話
      objThirdparty = this.accessCodeService.getThirdparty(
        userObj.c.toString(),
      );
    } else {
      const tableId = body.game?.details?.table?.id;
      const objTableInfo = await this.accessCodeService.getTableInfo(
        Game.Evolution.cp_key.toString(),
        tableId,
      );
      if (objTableInfo) {
        objThirdparty = Game.Evolution;
      } else {
        let nCPKey = this.accessCodeService.getGameCPKey(Number(tableId));
        if (Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
          objThirdparty = Config.EVOLUTION_GROUP.vendors[nCPKey];
        }
      }
    }

    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      console.error("[balance] : No search any objThirdparty");
      balanceResponse.status = Status.INVALID_TOKEN_ID;
      return balanceResponse;
    }

    // gRPC call
    const keySize = Config.MAX_USER_KEY_SIZE;
    const paddedKey = userObj.key.toString().padStart(keySize!, "0");

    const objData = <ObjData>{
      round_id: [paddedKey, "@", userObj.id].join(""), // Unsure
      trans_id: body.uuid, // Unsure
      amount: 0, // Unsure ; /check no money
      game_code: "", // Unsure
      table_code: "", // Unsure
      game_type:
        objThirdparty?.cp_key == Config.EVOLUTION_GROUP.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT, // Unsure
      event_type: Config.BET_EVENT_TYPE.NORMAL, // Unsure
      is_end: false, // Unsure
      is_cancel_round: false, // Unsure
      is_end_check: false, // Unsure
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Balance,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;

    // result
    balanceResponse.status = error
      ? this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error.statuscode,
      )
      : this.evolutionService.convertGrpcStatusToText(
        CallbackType.Bet,
        result?.result,
      );
    balanceResponse.balance = result.balance;
    balanceResponse.bonus = 0; // not use

    return balanceResponse;
  }

  @Post(apiPath.evolution.debit)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: `Used to debit from account (place bets)`,
  })
  async debit(@Body() body: DebitDto): Promise<DebitResponse> {
    const debitResponse = <DebitResponse>{};
    debitResponse.uuid = body.uuid;

    const userObj = await this.accessCodeService.getUserObj(
      body.userId,
      Game.Evolution.cp_key.toString(),
    );
    if (!userObj) {
      debitResponse.status = Status.INVALID_PARAMETER; // 客戶要求
      return debitResponse;
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      debitResponse.status = Status.INVALID_TOKEN_KEY;
      return debitResponse;
    }

    const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
    if (!userIdCheck) {
      debitResponse.status = Status.INVALID_PARAMETER;
      return debitResponse;
    }

    let objThirdparty;
    objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      debitResponse.status = Status.INVALID_TOKEN_ID;
      return debitResponse;
    }
    const objTableInfo = await this.accessCodeService.getTableInfo(
      Game.Evolution.cp_key.toString(),
      body.game?.details?.table?.id,
    );
    if (objTableInfo) {
      objThirdparty = Game.Evolution;
    } else {
      let nCPKey = this.accessCodeService.getGameCPKey(
        Number(body.game?.details?.table?.id),
      );
      if (Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
        objThirdparty = Config.EVOLUTION_GROUP.vendors[nCPKey];
      }
    }
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      debitResponse.status = Status.INVALID_TOKEN_ID;
      return debitResponse;
    }

    // new 20250904 : FINAL_ERROR_ACTION_FAILED check ; Allow pre /cancel ; key = refId_id, value = sid | sid = body?.sid match is pre /cancel
    const preCancelKey = this.evolutionService.getPreCancelKey(
      body?.transaction?.refId,
      body?.transaction?.id,
    );
    const preCancelSid = await this.redisService.get(preCancelKey);
    if (preCancelSid && preCancelSid === body?.sid) {
      debitResponse.status = Status.FINAL_ERROR_ACTION_FAILED;
      debitResponse.balance = null;
      debitResponse.bonus = 0;
      return debitResponse;
    }

    // Check if it already exists before running debit
    const debitCheckObj = await this.evolutionService.getCheckDebitObj(
      body?.transaction?.refId,
    );
    if (debitCheckObj) {
      debitResponse.status = Status.BET_ALREADY_EXIST;
      debitResponse.balance = null;
      debitResponse.bonus = 0;
      return debitResponse;
    }
    // * value = { isEnd: false } ; end dicide by /cancel or /credit.
    await this.evolutionService.initCheckDebitObj(body?.transaction?.refId);

    // gRPC call
    const keySize = Config.MAX_USER_KEY_SIZE;
    const paddedKey = userObj.key.toString().padStart(keySize!, "0");

    const objData: ObjData = {
      round_id: [paddedKey, "@", body.game?.id].join(""),
      trans_id: body.transaction?.id,
      amount: Math.abs(parseFloat(Number(body.transaction?.amount).toFixed(2))),
      game_code: body.game?.details?.table?.id,
      table_code: objTableInfo?.name,
      game_type:
        objThirdparty.cp_key === Game.Evolution.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;

    // result
    debitResponse.status = error
      ? this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error.statuscode,
      )
      : this.evolutionService.convertGrpcStatusToText(
        CallbackType.Bet,
        result?.result,
      );
    debitResponse.balance = result.balance;
    debitResponse.bonus = 0; // not use

    return debitResponse;
  }

  @Post(apiPath.evolution.credit)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: `Used to credit user's account (settle bets)`,
  })
  async credit(@Body() body: CreditDto): Promise<CreditResponse> {
    const creditResponse = <CreditResponse>{};
    creditResponse.uuid = body.uuid;

    const userObj = await this.accessCodeService.getUserObj(
      body.userId,
      Game.Evolution.cp_key.toString(),
    );
    if (!userObj) {
      creditResponse.status = Status.INVALID_PARAMETER; // 客戶要求
      return creditResponse;
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      creditResponse.status = Status.INVALID_TOKEN_KEY;
      return creditResponse;
    }

    const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
    if (!userIdCheck) {
      creditResponse.status = Status.INVALID_PARAMETER;
      return creditResponse;
    }

    let objThirdparty;
    objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      creditResponse.status = Status.INVALID_TOKEN_ID;
      return creditResponse;
    }
    const objTableInfo = await this.accessCodeService.getTableInfo(
      Game.Evolution.cp_key.toString(),
      body.game?.details?.table?.id,
    );
    if (objTableInfo) {
      objThirdparty = Game.Evolution;
    } else {
      let nCPKey = this.accessCodeService.getGameCPKey(
        Number(body.game?.details?.table?.id),
      );
      if (Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
        objThirdparty = Config.EVOLUTION_GROUP.vendors[nCPKey];
      }
    }
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      creditResponse.status = Status.INVALID_TOKEN_ID;
      return creditResponse;
    }

    // should do a /debit before /credit
    const debitCheckObj = await this.evolutionService.getCheckDebitObj(
      body?.transaction?.refId,
    );
    if (!debitCheckObj) {
      creditResponse.status = Status.BET_DOES_NOT_EXIST;
      creditResponse.balance = null;
      creditResponse.bonus = 0;
      return creditResponse;
    }

    // if /debit is already ended
    if (debitCheckObj?.isEnd === true) {
      creditResponse.status = Status.BET_ALREADY_SETTLED;
      creditResponse.balance = null;
      creditResponse.bonus = 0;
      return creditResponse;
    }

    // gRPC call
    const keySize = Config.MAX_USER_KEY_SIZE;
    const paddedKey = userObj.key.toString().padStart(keySize!, "0");

    const objData: ObjData = {
      round_id: [paddedKey, "@", body.game?.id].join(""),
      trans_id: body.transaction?.id,
      amount: Math.abs(parseFloat(Number(body.transaction?.amount).toFixed(2))),
      game_code: body.game?.details?.table?.id,
      table_code: objTableInfo?.name,
      game_type:
        objThirdparty.cp_key === Game.Evolution.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Result,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;

    // result
    creditResponse.status = error
      ? this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error.statuscode,
      )
      : this.evolutionService.convertGrpcStatusToText(
        CallbackType.Result,
        result?.result,
      );
    creditResponse.balance = result.balance;
    creditResponse.bonus = 0; // not use
    // * credit and cancel, only one can be called
    await this.evolutionService.endCheckDebitObj(
      body?.transaction?.refId,
      "credit",
    );

    return creditResponse;
  }

  @Post(apiPath.evolution.cancel)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: `Used to cancel user's bet`,
  })
  async cancel(@Body() body: CancelDto): Promise<CancelResponse> {
    const cancelResponse = <CancelResponse>{};
    cancelResponse.uuid = body.uuid;

    const userObj = await this.accessCodeService.getUserObj(
      body.userId,
      Game.Evolution.cp_key.toString(),
    );
    if (!userObj) {
      cancelResponse.status = Status.INVALID_PARAMETER; // 客戶要求
      return cancelResponse;
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      cancelResponse.status = Status.INVALID_TOKEN_KEY;
      return cancelResponse;
    }

    const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
    if (!userIdCheck) {
      cancelResponse.status = Status.INVALID_PARAMETER;
      return cancelResponse;
    }

    let objThirdparty;
    objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      cancelResponse.status = Status.INVALID_TOKEN_ID;
      return cancelResponse;
    }
    const objTableInfo = await this.accessCodeService.getTableInfo(
      Game.Evolution.cp_key.toString(),
      body.game?.details?.table?.id,
    );
    if (objTableInfo) {
      objThirdparty = Game.Evolution;
    } else {
      let nCPKey = this.accessCodeService.getGameCPKey(
        Number(body.game?.details?.table?.id),
      );
      if (Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
        objThirdparty = Config.EVOLUTION_GROUP.vendors[nCPKey];
      }
    }
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      cancelResponse.status = Status.INVALID_TOKEN_ID;
      return cancelResponse;
    }

    // new 20250902 : should do a /debit before /cancel
    const debitCheckObj = await this.evolutionService.getCheckDebitObj(
      body?.transaction?.refId,
    );
    if (!debitCheckObj) {
      // new 20250904 : If a /debit is not performed first, it is reserved.
      // /cancel means that the same refId+id+sid cannot be /debited again.
      const preCancelKey = this.evolutionService.getPreCancelKey(
        body?.transaction?.refId,
        body?.transaction?.id,
      );
      await this.redisService.set(
        preCancelKey,
        body?.sid,
        Config.REDIS.GAME_USE_LIST_USE_KEEP_SEC,
      );
      // return BET_DOES_NOT_EXIST
      cancelResponse.status = Status.BET_DOES_NOT_EXIST;
      cancelResponse.balance = null;
      cancelResponse.bonus = 0;
      return cancelResponse;
    }

    // if /debit is already ended
    if (debitCheckObj?.isEnd === true) {
      cancelResponse.status = Status.BET_ALREADY_SETTLED;
      cancelResponse.balance = null;
      cancelResponse.bonus = 0;
      return cancelResponse;
    }

    // gRPC call
    const keySize = Config.MAX_USER_KEY_SIZE;
    const paddedKey = userObj.key.toString().padStart(keySize!, "0");

    const objData: ObjData = {
      round_id: [paddedKey, "@", body.game?.id].join(""),
      trans_id: body.transaction?.id,
      amount: Math.abs(parseFloat(Number(body.transaction?.amount).toFixed(2))),
      game_code: body.game?.details?.table?.id,
      table_code: objTableInfo?.name,
      game_type:
        objThirdparty.cp_key === Game.Evolution.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.NORMAL,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Refund,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;

    // result
    cancelResponse.status = error
      ? this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error.statuscode,
      )
      : this.evolutionService.convertGrpcStatusToText(
        CallbackType.Refund,
        result?.result,
      );
    cancelResponse.balance = result.balance;
    cancelResponse.bonus = 0; // not use

    // * credit and cancel, only one can be called
    await this.evolutionService.endCheckDebitObj(
      body?.transaction?.refId,
      "cancel",
    );

    return cancelResponse;
  }

  @Post(apiPath.evolution.promoPayout)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: `Used to communicate promotional payout transactions, be it accumulated wins from used vouchers, jackpot wins during free round play, additional payout as a result of a game play or something else entirely.
Payout transaction cannot be correlated to any individual debit transaction.`,
  })
  async promoPayout(
    @Body() body: PromoPayoutDto,
  ): Promise<PromoPayoutResponse> {
    const promoPayoutResponse = <PromoPayoutResponse>{};
    promoPayoutResponse.uuid = body.uuid;

    const userObj = await this.accessCodeService.getUserObj(
      body.userId,
      Game.Evolution.cp_key.toString(),
    );
    if (!userObj) {
      promoPayoutResponse.status = Status.INVALID_PARAMETER; // 客戶要求
      return promoPayoutResponse;
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      promoPayoutResponse.status = Status.INVALID_TOKEN_KEY;
      return promoPayoutResponse;
    }

    let objThirdparty;
    objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
    if (!objThirdparty || _.isEmpty(objThirdparty)) {
      promoPayoutResponse.status = Status.INVALID_TOKEN_ID;
      return promoPayoutResponse;
    }

    // gRPC call - 1
    const strRoundID = [userObj.key, "@", body?.promoTransaction?.id].join("");
    const objData: ObjData = {
      round_id: strRoundID,
      trans_id: strRoundID,
      amount: 0,
      game_code: "PROMO",
      table_code: "",
      game_type:
        objThirdparty.cpKey === Game.Evolution.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.EVENT_CASH,
      is_end: false,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };

    const processRequestObj = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Bet,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData,
      lang: Lang.ko,
    });

    const reply = await this.coreGrpcService.processCall(processRequestObj);
    const { result, error } = reply;
    if (error) {
      const errorStatus = this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error.statuscode,
      );
      // customer status : BET_ALREADY_EXIST change to BET_ALREADY_SETTLED.
      promoPayoutResponse.status =
        errorStatus === Status.BET_ALREADY_EXIST
          ? Status.BET_ALREADY_SETTLED
          : errorStatus;
      return promoPayoutResponse;
    }

    // todo  gRPC callback status change
    const newResultSatus = this.evolutionService.convertGrpcStatusToText(
      CallbackType.Bet,
      result?.result,
    );
    if (newResultSatus !== Status.OK) {
      // customer status : BET_ALREADY_EXIST change to BET_ALREADY_SETTLED.
      promoPayoutResponse.status =
        newResultSatus === Status.BET_ALREADY_EXIST
          ? Status.BET_ALREADY_SETTLED
          : newResultSatus;
      promoPayoutResponse.balance = result.balance;
      promoPayoutResponse.bonus = 0; // not use
      return promoPayoutResponse;
    }

    // gRPC call - 2 ; if not OK
    const objData2: ObjData = {
      round_id: strRoundID,
      trans_id: ["R", strRoundID].join(""),
      amount: Math.abs(parseFloat(Number(body.promoTransaction?.amount).toFixed(2))),
      game_code: "PROMO",
      table_code: "",
      game_type:
        objThirdparty.cp_key === Game.Evolution.cp_key
          ? Config.GAMECODE.LIVE
          : Config.GAMECODE.SLOT,
      event_type: Config.BET_EVENT_TYPE.EVENT_CASH,
      is_end: true,
      is_cancel_round: false,
      is_end_check: false,
      cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
    };
    const processRequestObj2 = this.accessCodeService.buildProcessRequest({
      body,
      callbackType: CallbackType.Result,
      objUser: userObj,
      objThirdParty: objThirdparty,
      objData: objData2,
      lang: Lang.ko,
    });

    const reply2 = await this.coreGrpcService.processCall(processRequestObj2);
    const { result: result2, error: error2 } = reply2;

    promoPayoutResponse.status = error2
      ? this.accessCodeService.convertGrpcErrorStatusToText(
        Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO,
        error2.statuscode,
      )
      : this.evolutionService.convertGrpcStatusToText(
        CallbackType.Refund,
        result2?.result,
      );
    promoPayoutResponse.balance = result2.balance;
    promoPayoutResponse.bonus = 0; // not use

    return promoPayoutResponse;
  }
}
