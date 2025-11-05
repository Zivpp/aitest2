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
exports.QqpkService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const config_1 = require("../../Config/config");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const crypto = require("crypto");
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
let QqpkService = class QqpkService {
    accessCodeService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    makeSign(params) {
        const filtered = {};
        for (const key in params) {
            if (params[key] != null && key !== "sign") {
                filtered[key] = String(params[key]);
            }
        }
        const sortedKeys = Object.keys(filtered).sort();
        const qs = sortedKeys.map((k) => `${k}=${filtered[k]}`).join("&");
        const signHash = crypto
            .createHash("md5")
            .update(qs)
            .digest("hex")
            .toUpperCase();
        return signHash;
    }
    async addTokenSign(opId, userKey, token) {
        const key = this.getPublicUserID(opId, userKey);
        await this.redisService.set(key, JSON.stringify(token.token), config_1.Config.REDIS.TRANSDATA_KEEP_SEC);
        return key;
    }
    getPublicUserID(a_nOPID, a_nUserKey, a_strFix = "") {
        return [
            a_strFix,
            this.accessCodeService.getOperatorCode(a_nOPID),
            this.accessCodeService.numberPad(a_nUserKey, config_1.Config.MAX_USER_ID_BODY_LEN),
        ].join("");
    }
    async getUserIndObj(acctId) {
        const prefixLen = acctId.length -
            (config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH + config_1.Config.MAX_USER_ID_BODY_LEN);
        const a_strFix = acctId.slice(0, prefixLen);
        const opCode = acctId.slice(prefixLen, prefixLen + config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH);
        const userKeyStr = acctId.slice(prefixLen + config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH);
        const userKey = parseInt(userKeyStr, 10);
        const key = await this.getPublicUserID(Number(opCode), Number(userKey), a_strFix);
        console.log("key = ", key);
        const redisResponse = await this.redisService.get(key);
        const result = redisResponse ? JSON.parse(redisResponse) : null;
        return result;
    }
};
exports.QqpkService = QqpkService;
exports.QqpkService = QqpkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], QqpkService);
//# sourceMappingURL=qqpk.service.js.map