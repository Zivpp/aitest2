"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const global_dto_validation_pipe_1 = require("../../Global/Pipes/global.dto.validation.pipe");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const config_1 = require("../../Config/config");
const api_path_1 = require("../../Config/api.path");
const evolution_enum_1 = require("./Enum/evolution.enum");
const evolution_dto_1 = require("./Dto/evolution.dto");
const evolution_service_1 = require("./evolution.service");
const result_code_1 = require("../../Config/result.code");
const evolution_promo_payout_dto_1 = require("./Dto/evolution.promo.payout.dto");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const uuid_1 = require("uuid");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
let EvolutionController = class EvolutionController {
    accessCodeService;
    evolutionService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, evolutionService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.evolutionService = evolutionService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    async getConfig(res) {
        const tableList = await this.accessCodeService.getFullTableInfoList();
        const gameCodeList = await this.accessCodeService.getFullGameCPKey();
        return res.send({ tableList, gameCodeList });
    }
    async sid(body, res) {
        console.log("EVOLUTION API /sid request : ", body);
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
            c: config_1.Game.Evolution.cp_key,
            g: userInfo.gamcode,
            dt: userInfo.times ?? Date.now(),
            sg: (0, uuid_1.v4)().replace(/-/g, ""),
            bl: userInfo.betlimit,
            tr: userInfo.tr,
        };
        console.info("objToken = ", objToken);
        const token = JSON.stringify(objToken);
        const sid = objToken.sg;
        console.info("EVOLUTION API sid = : ", sid);
        const strSessionKey = [
            "s",
            config_1.Game.Evolution.cp_key.toString(),
            body.userId,
        ].join("_");
        await this.redisService.set(strSessionKey, token);
        return res.send({ status: "OK", sid: sid, uuid: body.uuid });
    }
    async session(body, req) {
        const rawIP = req.ip?.replace("::ffff:", "") || "unknown";
        const allowList = config_1.Config.MAIN_APP_IP || [];
        const isAllowed = allowList.includes(rawIP);
        if (!isAllowed) {
            return { result: result_code_1.FAILED };
        }
        await this.accessCodeService.addUserObj(body.user_id, config_1.Game.Evolution.cp_key.toString(), body.token);
        return { result: result_code_1.SUCCESS };
    }
    async check(body) {
        const strUserID = body.userId;
        const strToken = body.sid;
        const uuid = body.uuid;
        const checkUserResponse = {};
        checkUserResponse.sid = strToken;
        checkUserResponse.uuid = uuid;
        const userObj = await this.accessCodeService.getUserObj(strUserID, config_1.Game.Evolution.cp_key.toString());
        if (!userObj) {
            checkUserResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return checkUserResponse;
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            checkUserResponse.status = evolution_enum_1.Status.INVALID_TOKEN_KEY;
            return checkUserResponse;
        }
        const userIdCheck = this.evolutionService.userIdCheck(userObj, strUserID);
        if (!userIdCheck) {
            checkUserResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return checkUserResponse;
        }
        const objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            checkUserResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return checkUserResponse;
        }
        const keySize = config_1.Config.MAX_USER_KEY_SIZE;
        const paddedKey = userObj.key.toString().padStart(keySize, "0");
        const objData = {
            round_id: [paddedKey, "@", userObj.id].join(""),
            trans_id: uuid,
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: objThirdparty.cp_key === config_1.Config.EVOLUTION_GROUP.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: objData,
            callbackType: evolution_enum_1.CallbackType.MemberCheck,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        checkUserResponse.status = error
            ? this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error.statuscode)
            : this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.MemberCheck, result?.result);
        return checkUserResponse;
    }
    async balance(body) {
        const balanceResponse = {};
        balanceResponse.uuid = body.uuid;
        const userObj = await this.accessCodeService.getUserObj(body.userId, config_1.Game.Evolution.cp_key.toString());
        if (!userObj) {
            balanceResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return balanceResponse;
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            balanceResponse.status = evolution_enum_1.Status.INVALID_TOKEN_KEY;
            return balanceResponse;
        }
        const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
        if (!userIdCheck) {
            balanceResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return balanceResponse;
        }
        let objThirdparty;
        if (!body.game?.details?.table?.id) {
            objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
        }
        else {
            const tableId = body.game?.details?.table?.id;
            const objTableInfo = await this.accessCodeService.getTableInfo(config_1.Game.Evolution.cp_key.toString(), tableId);
            if (objTableInfo) {
                objThirdparty = config_1.Game.Evolution;
            }
            else {
                let nCPKey = this.accessCodeService.getGameCPKey(Number(tableId));
                if (config_1.Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
                    objThirdparty = config_1.Config.EVOLUTION_GROUP.vendors[nCPKey];
                }
            }
        }
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            console.error("[balance] : No search any objThirdparty");
            balanceResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return balanceResponse;
        }
        const keySize = config_1.Config.MAX_USER_KEY_SIZE;
        const paddedKey = userObj.key.toString().padStart(keySize, "0");
        const objData = {
            round_id: [paddedKey, "@", userObj.id].join(""),
            trans_id: body.uuid,
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: objThirdparty?.cp_key == config_1.Config.EVOLUTION_GROUP.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: evolution_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        balanceResponse.status = error
            ? this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error.statuscode)
            : this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.Bet, result?.result);
        balanceResponse.balance = result.balance;
        balanceResponse.bonus = 0;
        return balanceResponse;
    }
    async debit(body) {
        const debitResponse = {};
        debitResponse.uuid = body.uuid;
        const userObj = await this.accessCodeService.getUserObj(body.userId, config_1.Game.Evolution.cp_key.toString());
        if (!userObj) {
            debitResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return debitResponse;
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            debitResponse.status = evolution_enum_1.Status.INVALID_TOKEN_KEY;
            return debitResponse;
        }
        const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
        if (!userIdCheck) {
            debitResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return debitResponse;
        }
        let objThirdparty;
        objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            debitResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return debitResponse;
        }
        const objTableInfo = await this.accessCodeService.getTableInfo(config_1.Game.Evolution.cp_key.toString(), body.game?.details?.table?.id);
        if (objTableInfo) {
            objThirdparty = config_1.Game.Evolution;
        }
        else {
            let nCPKey = this.accessCodeService.getGameCPKey(Number(body.game?.details?.table?.id));
            if (config_1.Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
                objThirdparty = config_1.Config.EVOLUTION_GROUP.vendors[nCPKey];
            }
        }
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            debitResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return debitResponse;
        }
        const preCancelKey = this.evolutionService.getPreCancelKey(body?.transaction?.refId, body?.transaction?.id);
        const preCancelSid = await this.redisService.get(preCancelKey);
        if (preCancelSid && preCancelSid === body?.sid) {
            debitResponse.status = evolution_enum_1.Status.FINAL_ERROR_ACTION_FAILED;
            debitResponse.balance = null;
            debitResponse.bonus = 0;
            return debitResponse;
        }
        const debitCheckObj = await this.evolutionService.getCheckDebitObj(body?.transaction?.refId);
        if (debitCheckObj) {
            debitResponse.status = evolution_enum_1.Status.BET_ALREADY_EXIST;
            debitResponse.balance = null;
            debitResponse.bonus = 0;
            return debitResponse;
        }
        await this.evolutionService.initCheckDebitObj(body?.transaction?.refId);
        const keySize = config_1.Config.MAX_USER_KEY_SIZE;
        const paddedKey = userObj.key.toString().padStart(keySize, "0");
        const objData = {
            round_id: [paddedKey, "@", body.game?.id].join(""),
            trans_id: body.transaction?.id,
            amount: Math.abs(parseFloat(Number(body.transaction?.amount).toFixed(2))),
            game_code: body.game?.details?.table?.id,
            table_code: objTableInfo?.name,
            game_type: objThirdparty.cp_key === config_1.Game.Evolution.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: evolution_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        debitResponse.status = error
            ? this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error.statuscode)
            : this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.Bet, result?.result);
        debitResponse.balance = result.balance;
        debitResponse.bonus = 0;
        return debitResponse;
    }
    async credit(body) {
        const creditResponse = {};
        creditResponse.uuid = body.uuid;
        const userObj = await this.accessCodeService.getUserObj(body.userId, config_1.Game.Evolution.cp_key.toString());
        if (!userObj) {
            creditResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return creditResponse;
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            creditResponse.status = evolution_enum_1.Status.INVALID_TOKEN_KEY;
            return creditResponse;
        }
        const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
        if (!userIdCheck) {
            creditResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return creditResponse;
        }
        let objThirdparty;
        objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            creditResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return creditResponse;
        }
        const objTableInfo = await this.accessCodeService.getTableInfo(config_1.Game.Evolution.cp_key.toString(), body.game?.details?.table?.id);
        if (objTableInfo) {
            objThirdparty = config_1.Game.Evolution;
        }
        else {
            let nCPKey = this.accessCodeService.getGameCPKey(Number(body.game?.details?.table?.id));
            if (config_1.Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
                objThirdparty = config_1.Config.EVOLUTION_GROUP.vendors[nCPKey];
            }
        }
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            creditResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return creditResponse;
        }
        const debitCheckObj = await this.evolutionService.getCheckDebitObj(body?.transaction?.refId);
        if (!debitCheckObj) {
            creditResponse.status = evolution_enum_1.Status.BET_DOES_NOT_EXIST;
            creditResponse.balance = null;
            creditResponse.bonus = 0;
            return creditResponse;
        }
        if (debitCheckObj?.isEnd === true) {
            creditResponse.status = evolution_enum_1.Status.BET_ALREADY_SETTLED;
            creditResponse.balance = null;
            creditResponse.bonus = 0;
            return creditResponse;
        }
        const keySize = config_1.Config.MAX_USER_KEY_SIZE;
        const paddedKey = userObj.key.toString().padStart(keySize, "0");
        const objData = {
            round_id: [paddedKey, "@", body.game?.id].join(""),
            trans_id: body.transaction?.id,
            amount: Math.abs(parseFloat(Number(body.transaction?.amount).toFixed(2))),
            game_code: body.game?.details?.table?.id,
            table_code: objTableInfo?.name,
            game_type: objThirdparty.cp_key === config_1.Game.Evolution.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: evolution_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        creditResponse.status = error
            ? this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error.statuscode)
            : this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.Result, result?.result);
        creditResponse.balance = result.balance;
        creditResponse.bonus = 0;
        await this.evolutionService.endCheckDebitObj(body?.transaction?.refId, "credit");
        return creditResponse;
    }
    async cancel(body) {
        const cancelResponse = {};
        cancelResponse.uuid = body.uuid;
        const userObj = await this.accessCodeService.getUserObj(body.userId, config_1.Game.Evolution.cp_key.toString());
        if (!userObj) {
            cancelResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return cancelResponse;
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            cancelResponse.status = evolution_enum_1.Status.INVALID_TOKEN_KEY;
            return cancelResponse;
        }
        const userIdCheck = this.evolutionService.userIdCheck(userObj, body.userId);
        if (!userIdCheck) {
            cancelResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return cancelResponse;
        }
        let objThirdparty;
        objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            cancelResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return cancelResponse;
        }
        const objTableInfo = await this.accessCodeService.getTableInfo(config_1.Game.Evolution.cp_key.toString(), body.game?.details?.table?.id);
        if (objTableInfo) {
            objThirdparty = config_1.Game.Evolution;
        }
        else {
            let nCPKey = this.accessCodeService.getGameCPKey(Number(body.game?.details?.table?.id));
            if (config_1.Config.EVOLUTION_GROUP.vendors.hasOwnProperty(nCPKey)) {
                objThirdparty = config_1.Config.EVOLUTION_GROUP.vendors[nCPKey];
            }
        }
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            cancelResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return cancelResponse;
        }
        const debitCheckObj = await this.evolutionService.getCheckDebitObj(body?.transaction?.refId);
        if (!debitCheckObj) {
            const preCancelKey = this.evolutionService.getPreCancelKey(body?.transaction?.refId, body?.transaction?.id);
            await this.redisService.set(preCancelKey, body?.sid, config_1.Config.REDIS.GAME_USE_LIST_USE_KEEP_SEC);
            cancelResponse.status = evolution_enum_1.Status.BET_DOES_NOT_EXIST;
            cancelResponse.balance = null;
            cancelResponse.bonus = 0;
            return cancelResponse;
        }
        if (debitCheckObj?.isEnd === true) {
            cancelResponse.status = evolution_enum_1.Status.BET_ALREADY_SETTLED;
            cancelResponse.balance = null;
            cancelResponse.bonus = 0;
            return cancelResponse;
        }
        const keySize = config_1.Config.MAX_USER_KEY_SIZE;
        const paddedKey = userObj.key.toString().padStart(keySize, "0");
        const objData = {
            round_id: [paddedKey, "@", body.game?.id].join(""),
            trans_id: body.transaction?.id,
            amount: Math.abs(parseFloat(Number(body.transaction?.amount).toFixed(2))),
            game_code: body.game?.details?.table?.id,
            table_code: objTableInfo?.name,
            game_type: objThirdparty.cp_key === config_1.Game.Evolution.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: evolution_enum_1.CallbackType.Refund,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        cancelResponse.status = error
            ? this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error.statuscode)
            : this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.Refund, result?.result);
        cancelResponse.balance = result.balance;
        cancelResponse.bonus = 0;
        await this.evolutionService.endCheckDebitObj(body?.transaction?.refId, "cancel");
        return cancelResponse;
    }
    async promoPayout(body) {
        const promoPayoutResponse = {};
        promoPayoutResponse.uuid = body.uuid;
        const userObj = await this.accessCodeService.getUserObj(body.userId, config_1.Game.Evolution.cp_key.toString());
        if (!userObj) {
            promoPayoutResponse.status = evolution_enum_1.Status.INVALID_PARAMETER;
            return promoPayoutResponse;
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            promoPayoutResponse.status = evolution_enum_1.Status.INVALID_TOKEN_KEY;
            return promoPayoutResponse;
        }
        let objThirdparty;
        objThirdparty = this.accessCodeService.getThirdparty(userObj.c.toString());
        if (!objThirdparty || _.isEmpty(objThirdparty)) {
            promoPayoutResponse.status = evolution_enum_1.Status.INVALID_TOKEN_ID;
            return promoPayoutResponse;
        }
        const strRoundID = [userObj.key, "@", body?.promoTransaction?.id].join("");
        const objData = {
            round_id: strRoundID,
            trans_id: strRoundID,
            amount: 0,
            game_code: "PROMO",
            table_code: "",
            game_type: objThirdparty.cpKey === config_1.Game.Evolution.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: evolution_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            const errorStatus = this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error.statuscode);
            promoPayoutResponse.status =
                errorStatus === evolution_enum_1.Status.BET_ALREADY_EXIST
                    ? evolution_enum_1.Status.BET_ALREADY_SETTLED
                    : errorStatus;
            return promoPayoutResponse;
        }
        const newResultSatus = this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.Bet, result?.result);
        if (newResultSatus !== evolution_enum_1.Status.OK) {
            promoPayoutResponse.status =
                newResultSatus === evolution_enum_1.Status.BET_ALREADY_EXIST
                    ? evolution_enum_1.Status.BET_ALREADY_SETTLED
                    : newResultSatus;
            promoPayoutResponse.balance = result.balance;
            promoPayoutResponse.bonus = 0;
            return promoPayoutResponse;
        }
        const objData2 = {
            round_id: strRoundID,
            trans_id: ["R", strRoundID].join(""),
            amount: Math.abs(parseFloat(Number(body.promoTransaction?.amount).toFixed(2))),
            game_code: "PROMO",
            table_code: "",
            game_type: objThirdparty.cp_key === config_1.Game.Evolution.cp_key
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            is_end: true,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body?.uuid, is_test: false }),
        };
        const processRequestObj2 = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: evolution_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objData2,
            lang: evolution_enum_1.Lang.ko,
        });
        const reply2 = await this.coreGrpcService.processCall(processRequestObj2);
        const { result: result2, error: error2 } = reply2;
        promoPayoutResponse.status = error2
            ? this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.EVO, error2.statuscode)
            : this.evolutionService.convertGrpcStatusToText(evolution_enum_1.CallbackType.Refund, result2?.result);
        promoPayoutResponse.balance = result2.balance;
        promoPayoutResponse.bonus = 0;
        return promoPayoutResponse;
    }
};
exports.EvolutionController = EvolutionController;
__decorate([
    (0, common_1.Get)(api_path_1.default.evolution.getConfig),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.sid),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "sid",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.SidDto, Object]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "sid", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.session),
    (0, swagger_1.ApiOperation)({
        summary: "session & save userInfo in redis.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.sessionDto, Object]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "session", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.check),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "Should be used for additional validation of redirected user and sid.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.CheckDto]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "check", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.balance),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: `Used to get user's balance`,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.BalanceDto]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "balance", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.debit),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: `Used to debit from account (place bets)`,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.DebitDto]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "debit", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.credit),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: `Used to credit user's account (settle bets)`,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.CreditDto]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "credit", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.cancel),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: `Used to cancel user's bet`,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_dto_1.CancelDto]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.evolution.promoPayout),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: `Used to communicate promotional payout transactions, be it accumulated wins from used vouchers, jackpot wins during free round play, additional payout as a result of a game play or something else entirely.
Payout transaction cannot be correlated to any individual debit transaction.`,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [evolution_promo_payout_dto_1.PromoPayoutDto]),
    __metadata("design:returntype", Promise)
], EvolutionController.prototype, "promoPayout", null);
exports.EvolutionController = EvolutionController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        evolution_service_1.EvolutionService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], EvolutionController);
//# sourceMappingURL=evolution.controller.js.map