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
exports.BngController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_path_1 = require("../../Config/api.path");
const bng_service_1 = require("./bng.service");
const result_code_1 = require("../../Config/result.code");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const config_1 = require("../../Config/config");
const bng_dto_1 = require("./Dto/bng.dto");
const global_dto_validation_pipe_1 = require("../../Global/Pipes/global.dto.validation.pipe");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const config_2 = require("../../Config/config");
const uuid_1 = require("uuid");
const bng_enum_1 = require("./Enum/bng.enum");
let BngController = class BngController {
    accessCodeService;
    bngService;
    apiService;
    redisService;
    constructor(accessCodeService, bngService, apiService, redisService) {
        this.accessCodeService = accessCodeService;
        this.bngService = bngService;
        this.apiService = apiService;
        this.redisService = redisService;
    }
    async sid(body, res) {
        const _BNG = "BNG";
        console.log(`[${_BNG}] API /sid request = `, body);
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
            c: config_2.Game.BNG.cp_key,
            g: userInfo.gamcode,
            dt: userInfo.times ?? Date.now(),
            sg: (0, uuid_1.v4)().replace(/-/g, ""),
            bl: userInfo.betlimit,
            tr: userInfo.tr,
        };
        console.info("objToken = ", objToken);
        const token = JSON.stringify(objToken);
        const sid = objToken.sg;
        console.info(`[${_BNG}] API /sid = `, sid);
        const strSessionKey = [
            "s",
            config_2.Game.BNG.cp_key.toString(),
            body.userId,
        ].join("_");
        await this.redisService.set(strSessionKey, token);
        return res.send({ status: "OK", sid: sid, uuid: body.uuid });
    }
    async session(req, body) {
        const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
        const allowList = config_1.Config.MAIN_APP_IP || [];
        const isAllowed = allowList.includes(rawIP);
        if (!isAllowed) {
            return { result: result_code_1.FAILED };
        }
        const tokenSign = {
            token: body?.token,
            update_time: Date.now(),
        };
        await this.accessCodeService.addToken_sign(tokenSign, body?.token?.c);
        return { result: result_code_1.SUCCESS };
    }
    async handleRaw(res, body) {
        let objThirdparty = null;
        const forceGamecode = config_1.Config.bng_force_gamecode?.[body?.game_id];
        const vendorId = forceGamecode?.to_provider_id || body?.provider_id;
        objThirdparty = config_1.Config.BNG_GROUP.vendors?.[vendorId];
        if (!objThirdparty) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(config_1.Config.RESPONSE_ERROR);
        }
        const userObj = await this.accessCodeService.getUserObj(body?.token, objThirdparty?.cp_key?.toString());
        if (!userObj) {
            return res.send({
                uid: body?.uid,
                error: { code: bng_enum_1.Status.INVALID_TOKEN },
            });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            return res.send({
                uid: body?.uid,
                error: { code: bng_enum_1.Status.INVALID_TOKEN },
            });
        }
        let result;
        const _LOGIN = "login";
        const _GET_BALANCE = "getbalance";
        const _TRANSACTION = "transaction";
        const _ROLLBACK = "rollback";
        switch (body.name) {
            case _LOGIN:
                result = await this.bngService.login(body, objThirdparty, userObj);
                break;
            case _GET_BALANCE:
                result = await this.bngService.getBalance(body, objThirdparty, userObj);
                break;
            case _TRANSACTION:
                result = await this.bngService.transaction(body, objThirdparty, userObj);
                break;
            case _ROLLBACK:
                result = await this.bngService.rollback(body, objThirdparty, userObj);
                break;
            default:
                result = { uid: body?.uid, error: { code: bng_enum_1.Status.NOT_IMPLEMENTED } };
                break;
        }
        return res.send(result);
    }
};
exports.BngController = BngController;
__decorate([
    (0, common_1.Post)(api_path_1.default.bng.sid),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "sid",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bng_dto_1.SidDto, Object]),
    __metadata("design:returntype", Promise)
], BngController.prototype, "sid", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.bng.session),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "session ??",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bng_dto_1.SessionDto]),
    __metadata("design:returntype", Promise)
], BngController.prototype, "session", null);
__decorate([
    (0, common_1.Post)("/"),
    (0, swagger_1.ApiOperation)({
        summary: "Multiple services are integrated into one, using objData.name when judging",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BngController.prototype, "handleRaw", null);
exports.BngController = BngController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        bng_service_1.BngService,
        api_service_1.ApiService,
        redis_service_1.RedisService])
], BngController);
//# sourceMappingURL=bng.controller.js.map