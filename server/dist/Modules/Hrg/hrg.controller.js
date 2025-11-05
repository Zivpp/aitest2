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
exports.HrgController = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const result_code_1 = require("../../Config/result.code");
const config_1 = require("../../Config/config");
const api_path_1 = require("../../Config/api.path");
const hrg_service_1 = require("./hrg.service");
const uuid_1 = require("uuid");
const access_code_enum_1 = require("../../Global/Service/Enum/access.code.enum");
const hrg_dto_1 = require("./Dto/hrg.dto");
const global_dto_validation_pipe_1 = require("../../Global/Pipes/global.dto.validation.pipe");
const OBJ_THIRDPARTY = config_1.Game.HRG;
const SUCCESS_CODE = "0000";
const BET_FAILED_CODE = "8001";
const FAIL_CODE = "9999";
let HrgController = class HrgController {
    accessCodeService;
    hrgService;
    apiService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, hrgService, apiService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.hrgService = hrgService;
        this.apiService = apiService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    async session(req, body) {
        const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
        const allowList = config_1.Config.MAIN_APP_IP || [];
        const isAllowed = allowList.includes(rawIP);
        if (!isAllowed) {
            return { result: result_code_1.FAILED };
        }
        await this.accessCodeService.addUserObj(body?.token?.key, config_1.Game.HRG.cp_key.toString(), body.token);
        return { result: result_code_1.SUCCESS };
    }
    async bet(req, res, body) {
        const date = new Date();
        const balanceTsStr = date.toISOString().replace('Z', '+0800');
        const response = {
            code: SUCCESS_CODE,
            balance: "0",
            balanceTs: balanceTsStr,
            desc: ""
        };
        const { userId } = body;
        const key = parseInt(userId.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(key.toString(), OBJ_THIRDPARTY.cp_key.toString());
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
        const objParam = {
            cp_data: JSON.stringify({ tuid: (0, uuid_1.v4)(), is_test: false }),
            round_id: "",
            trans_id: "",
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = FAIL_CODE;
            response.desc = "SESSION_ERROR";
            return res.send(response);
        }
        response.balance = result.balance.toString();
        return res.send(response);
    }
    async place_bet(req, res, body) {
        const response = {
            code: SUCCESS_CODE,
            balance: "0",
            balanceTs: "",
            desc: ""
        };
        const { userId, tableId, roundId, betAmount, txId, gameCode, ts } = body;
        let strTableName;
        response.balanceTs = ts;
        const key = parseInt(userId.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(key.toString(), OBJ_THIRDPARTY.cp_key.toString());
        if (!userObj) {
            response.desc = "INVALID_USER";
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.desc = "INVALID_USER";
            return res.send(response);
        }
        const tableInfo = this.accessCodeService.getTableInfo(OBJ_THIRDPARTY.cp_key, tableId);
        if (tableInfo) {
            strTableName = tableInfo.table_name;
        }
        else {
            strTableName = tableId;
        }
        const round_id = [userId, roundId].join("-");
        const objParam = {
            cp_data: JSON.stringify({ tuid: txId, is_test: false }),
            round_id: round_id,
            trans_id: txId,
            amount: Math.abs(Number(betAmount)),
            game_code: gameCode,
            table_code: strTableName,
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = FAIL_CODE;
            response.desc = "SESSION_ERROR";
            return res.send(response);
        }
        const redisObj = JSON.stringify({
            amount: betAmount,
            table_code: strTableName,
            round_id: round_id
        });
        const redisKey = [OBJ_THIRDPARTY.CP_KEY, userObj.key, txId].join("_");
        await this.redisService.set(redisKey, redisObj, config_1.Config.REDIS.TRANSDATA_KEEP_SEC_MIN);
        response.balance = result.balance.toString();
        return res.send(response);
    }
    async cancel_bet(req, res, body) {
        const response = {
            code: SUCCESS_CODE,
            balance: "0",
            balanceTs: "",
            desc: ""
        };
        const { userId, txId, gameCode, ts } = body;
        response.balanceTs = ts;
        const key = parseInt(userId.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(key.toString(), OBJ_THIRDPARTY.cp_key.toString());
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
        const redisKey = [OBJ_THIRDPARTY.CP_KEY, userObj.key, txId].join("_");
        const redisStr = await this.redisService.get(redisKey) ?? "";
        const redisObj = JSON.parse(redisStr);
        if (!redisObj || !redisObj?.amount || !redisObj?.round_id) {
            response.desc = "INVALID_TXID";
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: txId, is_test: false }),
            round_id: [userId, redisObj?.roundId].join("-"),
            trans_id: [txId].join("-"),
            amount: Math.abs(Number(redisObj?.amount)),
            game_code: gameCode,
            table_code: redisObj.table_code ?? "",
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Refund,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = FAIL_CODE;
            response.desc = "SESSION_ERROR";
            return res.send(response);
        }
        response.balance = result.balance.toString();
        return res.send(response);
    }
    async settle(req, res, body) {
        const response = {
            code: SUCCESS_CODE,
            balance: "0",
            balanceTs: "",
            desc: ""
        };
        response.balanceTs = body.ts;
        const key = parseInt(body.userId.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(key.toString(), OBJ_THIRDPARTY.cp_key.toString());
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
        const redisKey = [OBJ_THIRDPARTY.CP_KEY, userObj.key, body.txId].join("_");
        const redisStr = await this.redisService.get(redisKey) ?? "";
        const redisObj = JSON.parse(redisStr);
        if (!redisObj || !redisObj?.amount || !redisObj?.round_id) {
            response.desc = "INVALID_TXID";
            return res.send(response);
        }
        const roundId = [body.userId, body?.roundId].join("-");
        const transId = ["R", body?.txId].join("-");
        const objParam = {
            cp_data: JSON.stringify({ tuid: body.txId, is_test: false }),
            round_id: roundId,
            trans_id: transId,
            amount: Math.abs(Number(body?.winAmount)),
            game_code: body?.gameCode,
            table_code: typeof redisObj?.table_code !== "undefined" ? redisObj?.table_code : "",
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: true,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = FAIL_CODE;
            response.desc = "SESSION_ERROR";
            return res.send(response);
        }
        response.balance = result.balance.toString();
        return res.send(response);
    }
    async eventSettle(req, res, body) {
        const response = {
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
        const errorAry = {};
        for (const settle of body.settles) {
            const key = parseInt(settle?.userId?.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
            const userObj = await this.accessCodeService.getUserObj(key.toString(), OBJ_THIRDPARTY.cp_key.toString());
            if (!userObj) {
                errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'INVALID_USER' };
                continue;
            }
            const inValid = this.accessCodeService.inValidToken(userObj);
            if (inValid) {
                errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'INVALID_USER' };
                continue;
            }
            const objParamBet = {
                cp_data: JSON.stringify({ tuid: settle?.settleId, is_test: false }),
                round_id: settle?.eventId,
                trans_id: settle?.eventId,
                amount: 0,
                game_code: settle?.settleId,
                table_code: "BONUS",
                game_type: OBJ_THIRDPARTY.game_type,
                event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
                is_end: false,
                is_cancel_round: false,
                is_end_check: false,
            };
            const reBet = this.accessCodeService.buildProcessRequest({
                body,
                callbackType: access_code_enum_1.CallbackType.Bet,
                objUser: userObj,
                objThirdParty: OBJ_THIRDPARTY,
                objData: objParamBet,
                lang: access_code_enum_1.Lang.ko,
            });
            const replyBet = await this.coreGrpcService.processCall(reBet);
            const { result: resultBet, error: errorBet } = replyBet;
            if (errorBet) {
                errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'SESSION_ERROR' };
                continue;
            }
            const objParamResult = {
                cp_data: JSON.stringify({ tuid: settle?.settleId, is_test: false }),
                round_id: settle?.eventId,
                trans_id: ["evt", settle?.eventId].join("-"),
                amount: Math.abs(Number(settle?.amount)),
                game_code: settle?.settleId,
                table_code: "",
                game_type: OBJ_THIRDPARTY.game_type,
                event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
                is_end: true,
                is_cancel_round: false,
                is_end_check: false,
            };
            const reResult = this.accessCodeService.buildProcessRequest({
                body,
                callbackType: access_code_enum_1.CallbackType.Result,
                objUser: userObj,
                objThirdParty: OBJ_THIRDPARTY,
                objData: objParamResult,
                lang: access_code_enum_1.Lang.ko,
            });
            const replyResult = await this.coreGrpcService.processCall(reResult);
            const { result: resultResult, error: errorResult } = replyResult;
            if (errorResult) {
                errorAry[settle?.settleId] = { code: FAIL_CODE, desc: 'SESSION_ERROR' };
                continue;
            }
        }
        if (Object.keys(errorAry).length > 0) {
            res.send({ code: FAIL_CODE, desc: "Something error", errorAry });
        }
        res.send({ code: SUCCESS_CODE, desc: "Success" });
    }
};
exports.HrgController = HrgController;
__decorate([
    (0, common_2.Post)(api_path_1.default.clp.session),
    (0, swagger_1.ApiOperation)({
        summary: "session",
    }),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HrgController.prototype, "session", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.hrg.get_balance),
    (0, swagger_1.ApiOperation)({
        summary: "get_balance",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], HrgController.prototype, "bet", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.hrg.place_bet),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "place_bet",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, hrg_dto_1.PlaceBetDto]),
    __metadata("design:returntype", Promise)
], HrgController.prototype, "place_bet", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.hrg.cancel_bet),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "cancel_bet",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, hrg_dto_1.CancelBetDto]),
    __metadata("design:returntype", Promise)
], HrgController.prototype, "cancel_bet", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.hrg.settle),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "settle",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, hrg_dto_1.SettleDto]),
    __metadata("design:returntype", Promise)
], HrgController.prototype, "settle", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.hrg.event_settle),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "event_settle",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, hrg_dto_1.EventSettleDto]),
    __metadata("design:returntype", Promise)
], HrgController.prototype, "eventSettle", null);
exports.HrgController = HrgController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        hrg_service_1.HrgService,
        api_service_1.ApiService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], HrgController);
//# sourceMappingURL=hrg.controller.js.map