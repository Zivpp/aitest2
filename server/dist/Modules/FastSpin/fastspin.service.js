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
exports.FastSpinService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const fastspin_enum_1 = require("./Enum/fastspin.enum");
const config_1 = require("../../Config/config");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const uuid_1 = require("uuid");
const crypto = require("crypto");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const _md5 = (s) => crypto.createHash("md5").update(s, "utf8").digest("hex").toLowerCase();
const md5Hex = (buf) => {
    return crypto.createHash("md5").update(buf).digest("hex");
};
const signMd5 = (rawBody, secret) => {
    const bodyBuf = Buffer.isBuffer(rawBody)
        ? rawBody
        : Buffer.from(rawBody, "utf8");
    const secretBuf = Buffer.isBuffer(secret)
        ? secret
        : Buffer.from(secret, "utf8");
    return md5Hex(Buffer.concat([bodyBuf, secretBuf]));
};
let FastSpinService = class FastSpinService {
    accessCodeService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    getPublicUserID(a_nOPID, a_nUserKey, a_strFix = "") {
        return [
            a_strFix,
            this.accessCodeService.getOperatorCode(a_nOPID),
            this.accessCodeService.numberPad(a_nUserKey, config_1.Config.MAX_USER_ID_BODY_LEN),
        ].join("");
    }
    async addTokenSign(opId, userKey, token) {
        const key = this.getPublicUserID(opId, userKey);
        await this.redisService.set(key, JSON.stringify(token.token), config_1.Config.REDIS.TRANSDATA_KEEP_SEC);
    }
    async getUserIndObj(acctId) {
        const prefixLen = acctId.length -
            (config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH + config_1.Config.MAX_USER_ID_BODY_LEN);
        const a_strFix = acctId.slice(0, prefixLen);
        const opCode = acctId.slice(prefixLen, prefixLen + config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH);
        const userKeyStr = acctId.slice(prefixLen + config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH);
        const userKey = parseInt(userKeyStr, 10);
        const key = await this.getPublicUserID(Number(opCode), Number(userKey), a_strFix);
        const redisResponse = await this.redisService.get(key);
        const result = redisResponse ? JSON.parse(redisResponse) : null;
        return result;
    }
    async verifyDigest(_digest, req) {
        let isVerify = fastspin_enum_1.Status.Success;
        const _md5Str = await this.getDigest(req);
        console.info("_md5Str >>>>", _md5Str);
        if (!_digest || _md5Str !== _digest) {
            isVerify = fastspin_enum_1.Status.SystemError;
        }
        return isVerify;
    }
    getDigest(req) {
        const rawBody = req.rawBody;
        return signMd5(rawBody, config_1.Game.FASTSPIN.secret_key);
    }
    getKeyDebitTransferPrefix(transferId) {
        return `${config_1.Config.FASTSPIN_DEBIT_TRANSFER_PREFIX}${transferId}`;
    }
    getKeyDebitReferencePrefix(referenceId) {
        return `${config_1.Config.FASTSPIN_DEBIT_REFERENCE_PREFIX}${referenceId}`;
    }
    async transferIdCheck(transferId) {
        const transferkey = this.getKeyDebitTransferPrefix(transferId);
        const isExist = await this.redisService.get(transferkey);
        if (isExist) {
            return false;
        }
        await this.redisService.set(transferkey, transferId, config_1.Config.REDIS.TRANSDATA_KEEP_SEC);
        return true;
    }
    async transferBetProcess(response, req, userObj, objThirdparty) {
        const isCheck = await this.transferIdCheck(req.transferId);
        if (!isCheck) {
            response.code = fastspin_enum_1.Status.DuplicatedSerialNo;
            response.msg = fastspin_enum_1.StatusStr.DuplicatedSerialNo;
            return;
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
            round_id: req?.transferId,
            trans_id: req?.transferId,
            amount: req?.amount,
            game_code: req.gameCode,
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: req,
            callbackType: fastspin_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: fastspin_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error(["TransferBetProcess processCall error : ", error]);
            response.code =
                this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN, error.statuscode) ?? fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        else {
            response.balance = result.balance;
            return;
        }
    }
    async transferCancelProcess(response, req, userObj, objThirdparty) {
        const isCheck = await this.transferIdCheck(req.transferId);
        if (!isCheck) {
            response.code = fastspin_enum_1.Status.DuplicatedSerialNo;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
            round_id: req?.referenceId,
            trans_id: req?.referenceId,
            amount: req?.amount,
            game_code: req.gameCode,
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: req,
            callbackType: fastspin_enum_1.CallbackType.Refund,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: fastspin_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error(["transferCancelProcess processCall error : ", error]);
            if (error.statuscode == 20203) {
                response.code = fastspin_enum_1.Status.Success;
                response.msg = fastspin_enum_1.StatusStr.Success;
                response.balance = result.balance;
                return;
            }
            response.code =
                this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN, error.statuscode) ?? fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        else {
            response.balance = result.balance;
            return;
        }
    }
    async transferPayoutProcess(response, req, userObj, objThirdparty) {
        const isCheck = await this.transferIdCheck(req.transferId);
        if (!isCheck) {
            response.code = fastspin_enum_1.Status.DuplicatedSerialNo;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
            round_id: req?.referenceId,
            trans_id: req?.transferId,
            amount: req?.amount,
            game_code: req.gameCode,
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: true,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: req,
            callbackType: fastspin_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: fastspin_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error(["transferPayoutProcess processCall error : ", error]);
            response.code =
                this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN, error.statuscode) ?? fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        else {
            response.balance = result.balance;
            return;
        }
    }
    async transferBonusProcess(response, req, userObj, objThirdparty) {
        const isCheck = await this.transferIdCheck(req.transferId);
        if (!isCheck) {
            response.code = fastspin_enum_1.Status.DuplicatedSerialNo;
            response.msg = fastspin_enum_1.StatusStr.DuplicatedSerialNo;
            return;
        }
        const rId = req.roundId ? req.roundId : (0, uuid_1.v4)();
        const objParam = {
            cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
            round_id: rId,
            trans_id: req.transferId,
            amount: 0,
            game_code: req.gameCode,
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: req,
            callbackType: fastspin_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: fastspin_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error(["transferBonusProcess processCall[2] error : ", error]);
            response.code =
                this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN, error.statuscode) ?? fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        const objParam2 = {
            cp_data: JSON.stringify({ tuid: req.serialNo, is_test: false }),
            round_id: rId,
            trans_id: req.transferId + "_bouns",
            amount: req.amount,
            game_code: req.gameCode,
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj2 = this.accessCodeService.buildProcessRequest({
            body: req,
            callbackType: fastspin_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam2,
            lang: fastspin_enum_1.Lang.ko,
        });
        const reply2 = await this.coreGrpcService.processCall(processRequestObj2);
        const { result: result2, error: error2 } = reply2;
        if (error2) {
            console.error(["transferBonusProcess processCall[2] error : ", error2]);
            response.code =
                this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.FASTSPIN, error2.statuscode) ?? fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return;
        }
        response.balance = result2.balance;
        return;
    }
};
exports.FastSpinService = FastSpinService;
exports.FastSpinService = FastSpinService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], FastSpinService);
//# sourceMappingURL=fastspin.service.js.map