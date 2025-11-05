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
exports.EvolutionService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const evolution_dao_1 = require("./evolution.dao");
const evolution_enum_1 = require("./Enum/evolution.enum");
const result_code_1 = require("../../Config/result.code");
const config_1 = require("../../Config/config");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
let EvolutionService = class EvolutionService {
    redisService;
    accessCodeService;
    evolutionDao;
    constructor(redisService, accessCodeService, evolutionDao) {
        this.redisService = redisService;
        this.accessCodeService = accessCodeService;
        this.evolutionDao = evolutionDao;
    }
    userIdCheck(userObj, strUserID) {
        let isCheckResult = false;
        const opCode = this.accessCodeService.getOperatorCode(userObj.op);
        switch (userObj.v) {
            case 2:
                const _LEG = config_1.Config.MAX_USER_ID_BODY_LEN;
                const userKeyStr = userObj.key.toString().padStart(_LEG, "0");
                const checkId = [opCode, userKeyStr].join("");
                isCheckResult = checkId === strUserID;
                break;
            default:
                const userOpId = this.accessCodeService.getUserOPID(opCode, userObj.id);
                console.log("[v][1] userOpId >>>", userOpId);
                console.log("[v][1] strUserID >>>", strUserID);
                isCheckResult = userOpId === strUserID;
                break;
        }
        return isCheckResult;
    }
    convertGrpcStatusToText(type, resCode) {
        let status;
        switch (type) {
            case evolution_enum_1.CallbackType.MemberCheck:
                status = resCode === result_code_1.SUCCESS ? evolution_enum_1.Status.OK : evolution_enum_1.Status.INVALID_TOKEN_ID;
                break;
            case evolution_enum_1.CallbackType.Balance:
                status = resCode === result_code_1.SUCCESS ? evolution_enum_1.Status.OK : evolution_enum_1.Status.INVALID_TOKEN_ID;
                break;
            case evolution_enum_1.CallbackType.Bet:
                status =
                    resCode === result_code_1.SUCCESS
                        ? evolution_enum_1.Status.OK
                        : resCode === 5001 || resCode === 21011
                            ? evolution_enum_1.Status.INSUFFICIENT_FUNDS
                            : resCode === 20201
                                ? evolution_enum_1.Status.BET_ALREADY_EXIST
                                : evolution_enum_1.Status.UNKNOWN_ERROR;
                break;
            case evolution_enum_1.CallbackType.Result:
                status =
                    resCode === result_code_1.SUCCESS
                        ? evolution_enum_1.Status.OK
                        : resCode === 20202 || resCode === 20206 || resCode === 20204
                            ? evolution_enum_1.Status.BET_ALREADY_SETTLED
                            : evolution_enum_1.Status.UNKNOWN_ERROR;
                break;
            case evolution_enum_1.CallbackType.Refund:
                status =
                    resCode === result_code_1.SUCCESS
                        ? evolution_enum_1.Status.OK
                        : resCode === 20202 || resCode === 20203
                            ? evolution_enum_1.Status.BET_ALREADY_SETTLED
                            : resCode === 20200
                                ? evolution_enum_1.Status.BET_DOES_NOT_EXIST
                                : evolution_enum_1.Status.UNKNOWN_ERROR;
                break;
            default:
                status = evolution_enum_1.Status.UNKNOWN_ERROR;
                break;
        }
        return status;
    }
    async getGameCodeList(cpKey) {
        const rows = await this.evolutionDao.getGameCodeListByCpkey(cpKey);
        if (!rows || rows.length === 0)
            return {};
        const objList = {};
        for (const row of rows) {
            objList[row.game_code] = {
                cp_key: row.game_cp_key,
                name: row.game_name_eng,
            };
        }
        return objList;
    }
    getCheckDebitKey(refId) {
        return `${config_1.Config.EVOLUTION_DEBIT_CHECK_PREFIX}${refId}`;
    }
    getPreCancelKey(refId, id) {
        return `${config_1.Config.EVOLUTION_PRE_CANCEL_PREFIX}${refId}_${id}`;
    }
    async getCheckDebitObj(refId) {
        const checkDebitKey = this.getCheckDebitKey(refId);
        let refStr = await this.redisService.get(checkDebitKey);
        const debitCheckObj = refStr ? JSON.parse(refStr) : null;
        return debitCheckObj;
    }
    async initCheckDebitObj(refId) {
        const checkDebitKey = this.getCheckDebitKey(refId);
        await this.redisService.set(checkDebitKey, JSON.stringify(config_1.Config.EVOLUTION_DEBIT_CHECK_INIT), config_1.Config.REDIS.GAME_USE_LIST_USE_KEEP_SEC);
        return true;
    }
    async endCheckDebitObj(refId, changeBy) {
        const checkDebitKey = this.getCheckDebitKey(refId);
        const obj = JSON.parse(JSON.stringify(config_1.Config.EVOLUTION_DEBIT_CHECK_INIT));
        obj.isEnd = true;
        obj.changeBy = changeBy;
        await this.redisService.set(checkDebitKey, JSON.stringify(obj), config_1.Config.REDIS.GAME_USE_LIST_USE_KEEP_SEC);
        return true;
    }
};
exports.EvolutionService = EvolutionService;
exports.EvolutionService = EvolutionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        access_code_service_1.AccessCodeService,
        evolution_dao_1.EvolutionDao])
], EvolutionService);
//# sourceMappingURL=evolution.service.js.map