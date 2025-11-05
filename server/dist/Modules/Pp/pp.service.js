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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PpService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const _ = require("lodash");
const result_code_1 = require("../../Config/result.code");
const pp_enum_1 = require("./Enum/pp.enum");
const config_1 = require("../../Config/config");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const config_2 = require("../../Config/config");
let PpService = class PpService {
    accessCodeService;
    redisService;
    constructor(accessCodeService, redisService) {
        this.accessCodeService = accessCodeService;
        this.redisService = redisService;
    }
    inValidToken(userObj) {
        if (_.isNil(userObj) || _.isEmpty(userObj)) {
            return true;
        }
        const requiredKeys = ["key", "id", "op", "dt"];
        if (requiredKeys.some((k) => !userObj.hasOwnProperty(k))) {
            return true;
        }
        return false;
    }
    userIdCheck(userObj, strUserID) {
        let isCheckResult = false;
        const opCode = this.accessCodeService.getOperatorCode(userObj.op);
        switch (userObj.v) {
            case 2:
                const _LEG = config_2.Config.REDIS.TRANSDATA_KEEP_SEC_MIN;
                const userKeyStr = userObj.key.toString().padStart(_LEG, "0");
                const checkId = [opCode, userKeyStr].join("");
                isCheckResult = checkId == strUserID;
                break;
            default:
                const userOpId = this.accessCodeService.getUserOPID(opCode, userObj.id);
                isCheckResult = userOpId == strUserID;
                break;
        }
        return isCheckResult;
    }
    convertGrpcStatusToText(type, resCode) {
        let status;
        switch (type) {
            case pp_enum_1.CallbackType.MemberCheck:
                status = resCode === result_code_1.SUCCESS ? "OK" : "INVALID_TOKEN_ID";
                break;
            case pp_enum_1.CallbackType.Balance:
                status = resCode === result_code_1.SUCCESS ? "OK" : "INVALID_TOKEN_ID";
                break;
            case pp_enum_1.CallbackType.Bet:
                status =
                    resCode === result_code_1.SUCCESS
                        ? "OK"
                        : resCode === 5001 || resCode === 21011
                            ? "INSUFFICIENT_FUNDS"
                            : resCode === 20201
                                ? "BET_ALREADY_EXIST"
                                : "UNKNOWN_ERROR";
                break;
            case pp_enum_1.CallbackType.Result:
                status =
                    resCode === result_code_1.SUCCESS
                        ? "OK"
                        : resCode === 20202 || resCode === 20206 || resCode === 20204
                            ? "BET_ALREADY_SETTLED"
                            : "UNKNOWN_ERROR";
                break;
            case pp_enum_1.CallbackType.Refund:
                status =
                    resCode === result_code_1.SUCCESS
                        ? "OK"
                        : resCode === 20202 || resCode === 20203
                            ? "BET_ALREADY_SETTLED"
                            : resCode === 20200
                                ? "BET_DOES_NOT_EXIST"
                                : "UNKNOWN_ERROR";
                break;
            default:
                status = "UNKNOWN_ERROR";
                break;
        }
        return status;
    }
    getThirdPartObjByCpKey(cpKey) {
        let objThirdparty;
        switch (parseInt(cpKey)) {
            case config_1.Game.PP.cp_key:
                objThirdparty = config_1.Game.PP;
                break;
            case config_1.Game.PP_REELKINGDOM.cp_key:
                objThirdparty = config_1.Game.PP_REELKINGDOM;
                break;
            case config_1.Game.PP_FATPANDA.cp_key:
                objThirdparty = config_1.Game.PP_FATPANDA;
                break;
            default:
                objThirdparty = config_1.Game.PP_LIVE;
                break;
        }
        return objThirdparty;
    }
    buildServiceResult(gRPCResult, userObj, objThirdparty, type) {
        try {
            switch (type) {
                case pp_enum_1.CallbackType.MemberCheck:
                    if (gRPCResult.result !== result_code_1.SUCCESS) {
                        return {
                            error: 4,
                            description: [
                                "Membership verification failure [",
                                gRPCResult.result,
                                "]",
                            ].join(""),
                        };
                    }
                    let strUserID = "";
                    const opCode = this.accessCodeService.getOperatorCode(userObj.op);
                    switch (userObj.v) {
                        case 2:
                            const _LEG = config_2.Config.REDIS.TRANSDATA_KEEP_SEC_MIN;
                            const userKeyStr = userObj.key.toString().padStart(_LEG, "0");
                            strUserID = [opCode, userKeyStr].join("");
                            break;
                        default:
                            strUserID = [opCode, userObj.id.toString()].join("");
                            break;
                    }
                    return {
                        error: 0,
                        description: "Success",
                        userId: strUserID,
                        currency: config_2.Config.CURRENCY.DEF,
                        cash: gRPCResult.balance,
                        bonus: 0.0,
                        country: config_2.Config.COUNTRY_A2,
                        jurisdiction: "99",
                    };
                case pp_enum_1.CallbackType.Balance:
                    if (gRPCResult.result !== result_code_1.SUCCESS)
                        return {
                            error: 4,
                            description: [
                                "not enough balance [",
                                gRPCResult.result,
                                "]",
                            ].join(""),
                        };
                    else
                        return {
                            error: 0,
                            description: "Success",
                            currency: config_2.Config.CURRENCY.DEF,
                            cash: gRPCResult.balance,
                            bonus: 0.0,
                        };
                case pp_enum_1.CallbackType.Bet:
                    if (gRPCResult.result === result_code_1.SUCCESS)
                        return {
                            error: 0,
                            description: "Success",
                            transactionId: gRPCResult.trans_id,
                            currency: config_2.Config.CURRENCY.DEF,
                            cash: gRPCResult.balance,
                            bonus: 0.0,
                            usedPromo: 0,
                        };
                    else {
                        let responseObj;
                        if (gRPCResult.result == 5001 || gRPCResult.result == 21011)
                            responseObj.error = 100;
                        else if (gRPCResult.result == 20201) {
                            responseObj.error = 0;
                            responseObj.description = "Success";
                        }
                        else if (gRPCResult.result == 21004)
                            responseObj.error = 8;
                        else
                            responseObj.error = 100;
                        responseObj.description = responseObj.description
                            ? responseObj.description
                            : [gRPCResult.error_msg, " [", gRPCResult.result, "]"].join("");
                        responseObj.transactionId = gRPCResult.trans_id;
                        responseObj.currency = config_2.Config.CURRENCY.DEF;
                        responseObj.cash = gRPCResult.balance;
                        responseObj.bonus = 0.0;
                        return responseObj;
                    }
                case pp_enum_1.CallbackType.Result:
                    if (gRPCResult.result === result_code_1.SUCCESS) {
                        return {
                            error: 0,
                            description: "Success",
                            transactionId: gRPCResult.trans_id,
                            currency: config_2.Config.CURRENCY.DEF,
                            cash: gRPCResult.balance,
                            bonus: 0.0,
                        };
                    }
                    else {
                        let strResposeCode;
                        if (gRPCResult.result == 20202 || gRPCResult.result == 20206)
                            strResposeCode = gRPCResult.result;
                        else
                            strResposeCode = 120;
                        return {
                            error: strResposeCode,
                            description: [
                                gRPCResult.error_msg,
                                " [",
                                gRPCResult.result,
                                "]",
                            ].join(""),
                            transactionId: gRPCResult.trans_id,
                            currency: config_2.Config.CURRENCY.DEF,
                            cash: gRPCResult.balance,
                            bonus: 0.0,
                        };
                    }
                case pp_enum_1.CallbackType.Refund: {
                    if (gRPCResult.result == result_code_1.SUCCESS || gRPCResult.result == 20203)
                        return {
                            error: 0,
                            description: "Success",
                            transactionId: gRPCResult.trans_id,
                        };
                    else
                        return {
                            error: 120,
                            description: [
                                gRPCResult.error_msg,
                                " [",
                                gRPCResult.result,
                                "]",
                            ].join(""),
                            transactionId: gRPCResult.trans_id,
                        };
                }
                default:
                    break;
            }
        }
        catch (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
    }
    isCasino(a_strGameCode) {
        if (a_strGameCode === null || !a_strGameCode)
            return false;
        let prefix = a_strGameCode.substring(0, 2);
        const num = parseInt(prefix, 10);
        return !isNaN(num) && num < 10000;
    }
    getThirdPartyObject(gameId, userCpKey) {
        const isCasino = this.isCasino(gameId);
        if (isCasino)
            return config_1.Game.PP_LIVE;
        const cpKey = parseInt(userCpKey);
        switch (cpKey) {
            case config_1.Game.PP_REELKINGDOM.cp_key:
                return config_1.Game.PP_REELKINGDOM;
            case config_1.Game.PP_FATPANDA.cp_key:
                return config_1.Game.PP_FATPANDA;
            default:
                return config_1.Game.PP;
        }
    }
    async getTransData(a_strThirdpartyTransID) {
        let objTransData, strTransKey = ["t_", a_strThirdpartyTransID].join(""), strTransData = await this.redisService.get(strTransKey);
        if (strTransData != null) {
            let objParseData = JSON.parse(strTransData);
            objTransData = {
                thirdparty_round_id: objParseData.trid,
                round_id: objParseData.rid,
                trans_id: objParseData.tid,
                amount: objParseData.a,
                status: objParseData.st,
                times: objParseData.tm,
                thirdparty_trans_id_list: objParseData.ttids,
            };
        }
        return objTransData;
    }
};
exports.PpService = PpService;
exports.PpService = PpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        redis_service_1.RedisService])
], PpService);
//# sourceMappingURL=pp.service.js.map