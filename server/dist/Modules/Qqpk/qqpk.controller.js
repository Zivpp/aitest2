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
exports.QqpkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_path_1 = require("../../Config/api.path");
const result_code_1 = require("../../Config/result.code");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const config_1 = require("../../Config/config");
const global_dto_validation_pipe_1 = require("../../Global/Pipes/global.dto.validation.pipe");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const config_2 = require("../../Config/config");
const uuid_1 = require("uuid");
const qqpk_dto_1 = require("./Dto/qqpk.dto");
const access_code_enum_1 = require("../../Global/Service/Enum/access.code.enum");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const qqpk_enum_1 = require("./Enum/qqpk.enum");
const qqpk_service_1 = require("./qqpk.service");
let QqpkController = class QqpkController {
    accessCodeService;
    qqpkService;
    apiService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, qqpkService, apiService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.qqpkService = qqpkService;
        this.apiService = apiService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    async makeSign(req, res, body) {
        const result = { hash: "" };
        result.hash = await this.qqpkService.makeSign(body);
        return res.send(result);
    }
    async sid(body, res) {
        const _LOG_TAG = "Fastspin";
        console.log(`[${_LOG_TAG}] API /sid request = `, body);
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
        console.info(`[${_LOG_TAG}] API /sid = `, sid);
        const strSessionKey = [
            "s",
            config_2.Game.FASTSPIN.cp_key.toString(),
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
        const key = await this.qqpkService.addTokenSign(Number(body?.token?.op), body?.token?.key, tokenSign);
        return { result: result_code_1.SUCCESS, key };
    }
    async balance(req, res, body) {
        const bodyOby = body;
        const response = {};
        response.status_code = qqpk_enum_1.Status.Success;
        response.message = qqpk_enum_1.StatusStr.Success;
        response.data = {
            account: body?.account,
            currency: config_1.Config.CURRENCY.DEF,
            balance: 0,
        };
        if (!bodyOby?.sign || bodyOby.sign !== this.qqpkService.makeSign(bodyOby)) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.QQPK;
        if (!objThirdparty) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const userObj = await this.qqpkService.getUserIndObj(bodyOby?.account);
        if (!userObj) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.InvalidPlayerID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: bodyOby?.sign, is_test: false }),
            round_id: "",
            trans_id: "",
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: config_1.Config.GAMECODE.BORD,
            event_type: 0,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: bodyOby,
            callbackType: access_code_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        response.data.balance = result.balance;
        return res.send(response);
    }
    async debit(req, res, body) {
        const bodyOby = body;
        const response = {};
        response.status_code = qqpk_enum_1.Status.Success;
        response.message = qqpk_enum_1.StatusStr.Success;
        response.data = {
            money: bodyOby.money,
            account: bodyOby.account,
            currency: config_1.Config.CURRENCY.DEF,
            balance: 0,
        };
        if (!bodyOby?.sign || bodyOby.sign !== this.qqpkService.makeSign(bodyOby)) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.QQPK;
        if (!objThirdparty) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const userObj = await this.qqpkService.getUserIndObj(bodyOby?.account);
        if (!userObj) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.InvalidPlayerID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: bodyOby?.sign, is_test: false }),
            round_id: [bodyOby?.account, bodyOby?.etransgroup].join("_"),
            trans_id: bodyOby?.etransid,
            amount: Math.abs(Number(bodyOby?.money)),
            game_code: bodyOby?.kindid?.toString() ?? "",
            table_code: bodyOby?.etransgroup,
            game_type: config_1.Config.GAMECODE.BORD,
            event_type: config_1.Config.BET_EVENT_TYPE.CASHWITHDRAW,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: bodyOby,
            callbackType: access_code_enum_1.CallbackType.Withdraw,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        response.data.balance = result.balance;
        return res.send(response);
    }
    async credit(req, res, body) {
        const bodyOby = body;
        const response = {};
        response.status_code = qqpk_enum_1.Status.Success;
        response.message = qqpk_enum_1.StatusStr.Success;
        response.data = {
            money: bodyOby.money,
            account: bodyOby.account,
            currency: config_1.Config.CURRENCY.DEF,
            balance: 0,
        };
        if (!bodyOby?.sign || bodyOby.sign !== this.qqpkService.makeSign(bodyOby)) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.QQPK;
        if (!objThirdparty) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const userObj = await this.qqpkService.getUserIndObj(bodyOby?.account);
        if (!userObj) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.InvalidPlayerID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: bodyOby?.sign, is_test: false }),
            round_id: [bodyOby?.account, bodyOby?.etransgroup].join("_"),
            trans_id: bodyOby?.etransid,
            amount: Math.abs(Number(bodyOby?.money)),
            game_code: bodyOby?.kindid?.toString() ?? "",
            table_code: bodyOby?.etransgroup,
            game_type: config_1.Config.GAMECODE.BORD,
            event_type: config_1.Config.BET_EVENT_TYPE.CASHDEPOSIT,
            is_end: true,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: bodyOby,
            callbackType: access_code_enum_1.CallbackType.Deposit,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            delete response.data;
            response.status_code = qqpk_enum_1.Status.Error;
            response.message = qqpk_enum_1.StatusStr.UnknownError;
            return res.send(response);
        }
        response.data.balance = result.balance;
        return res.send(response);
    }
};
exports.QqpkController = QqpkController;
__decorate([
    (0, common_1.Post)(api_path_1.default.qqpk.makeSign),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "makeSign",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], QqpkController.prototype, "makeSign", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.qqpk.sid),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "sid",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [qqpk_dto_1.SidDto, Object]),
    __metadata("design:returntype", Promise)
], QqpkController.prototype, "sid", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.qqpk.session),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "session",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, qqpk_dto_1.SessionDto]),
    __metadata("design:returntype", Promise)
], QqpkController.prototype, "session", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.qqpk.balance),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "balance",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], QqpkController.prototype, "balance", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.qqpk.debit),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "debot",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], QqpkController.prototype, "debit", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.qqpk.credit),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "credit",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], QqpkController.prototype, "credit", null);
exports.QqpkController = QqpkController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        qqpk_service_1.QqpkService,
        api_service_1.ApiService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], QqpkController);
//# sourceMappingURL=qqpk.controller.js.map