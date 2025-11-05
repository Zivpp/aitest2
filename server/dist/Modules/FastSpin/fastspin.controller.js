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
exports.FastSpinController = void 0;
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
const fastspin_enum_1 = require("./Enum/fastspin.enum");
const fastspin_service_1 = require("./fastspin.service");
const fastspin_dto_1 = require("./Dto/fastspin.dto");
const access_code_enum_1 = require("../../Global/Service/Enum/access.code.enum");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
let FastSpinController = class FastSpinController {
    accessCodeService;
    fastSpinService;
    apiService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, fastSpinService, apiService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.fastSpinService = fastSpinService;
        this.apiService = apiService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    async routerCenter(req, res, body) {
        const apiIndex = req.headers["api"];
        switch (apiIndex) {
            case "getHash":
                return this.getHash(body, res);
            case "sid":
                return this.sid(body, res);
            case "session":
                return this.session(req, body);
            case "getBalance":
                return this.getBalance(req, res, body);
            case "transfer":
                return this.transfer(req, res, body);
            default:
                return res.send({ code: result_code_1.FAILED, msg: "no march any API service." });
        }
    }
    async getHash(req, res) {
        const result = { hash: "" };
        result.hash = await this.fastSpinService.getDigest(req);
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
        await this.fastSpinService.addTokenSign(Number(body?.token?.op), body?.token?.key, tokenSign);
        return { result: result_code_1.SUCCESS };
    }
    async getAcctInfo(req, res, body) {
        const response = {};
        const accountInfo = {};
        accountInfo.userName = "";
        accountInfo.currency = "";
        accountInfo.acctId = body.acctId;
        accountInfo.balance = 0;
        response.list = [accountInfo];
        response.resultCount = 1;
        response.pageCount = 1;
        response.merchantCode = body.merchantCode ?? "";
        response.serialNo = body?.serialNo ?? "";
        response.code = fastspin_enum_1.Status.Success;
        response.msg = fastspin_enum_1.StatusStr.Success;
        const _digest = req.headers["digest"];
        const isVify = await this.fastSpinService.verifyDigest(_digest, req);
        if (isVify !== fastspin_enum_1.Status.Success) {
            response.code = fastspin_enum_1.Status.TokenValidationFailed;
            response.msg = fastspin_enum_1.StatusStr.TokenValidationFailed;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.FASTSPIN;
        if (!objThirdparty) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(config_1.Config.RESPONSE_ERROR);
        }
        const userObj = await this.accessCodeService.getUserObj(body?.acctId, objThirdparty?.cp_key?.toString());
        if (!userObj) {
            response.code = fastspin_enum_1.Status.AcctNotFound;
            response.msg = fastspin_enum_1.StatusStr.AcctNotFound;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = fastspin_enum_1.Status.AcctInactive;
            response.msg = fastspin_enum_1.StatusStr.AcctInactive;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: body.serialNo, is_test: false }),
            round_id: "",
            trans_id: (0, uuid_1.v4)(),
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: 0,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error(["[getAcctInfo] error : ", error]);
            response.code = fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return res.send(response);
        }
        accountInfo.userName = userObj.id;
        accountInfo.balance = result.balance;
        accountInfo.currency = config_1.Config.CURRENCY.DEF;
        response.list = [accountInfo];
        return res.send(response);
    }
    async deposit(req, res, body) {
        const response = {};
        response.transactionId = (0, uuid_1.v4)().replace(/-/g, "").substring(0, 20);
        response.merchantCode = body.merchantCode;
        response.afterBalance = 0;
        response.code = fastspin_enum_1.Status.Success;
        response.msg = fastspin_enum_1.StatusStr.Success;
        response.serialNo = body.serialNo;
        const _digest = req.headers["digest"];
        const isVify = await this.fastSpinService.verifyDigest(_digest, req);
        if (isVify !== fastspin_enum_1.Status.Success) {
            response.code = fastspin_enum_1.Status.TokenValidationFailed;
            response.msg = fastspin_enum_1.StatusStr.TokenValidationFailed;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.FASTSPIN;
        if (!objThirdparty) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(config_1.Config.RESPONSE_ERROR);
        }
        const userObj = await this.accessCodeService.getUserObj(body?.acctId, objThirdparty?.cp_key?.toString());
        if (!userObj) {
            response.code = fastspin_enum_1.Status.AcctNotFound;
            response.msg = fastspin_enum_1.StatusStr.AcctNotFound;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = fastspin_enum_1.Status.AcctInactive;
            response.msg = fastspin_enum_1.StatusStr.AcctInactive;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: body.serialNo, is_test: false }),
            round_id: "",
            trans_id: response.transactionId,
            amount: Math.abs(Number(body.amount)),
            game_code: "",
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: 0,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error(["[deposit] error : ", error]);
            response.code = fastspin_enum_1.Status.SystemError;
            response.msg = fastspin_enum_1.StatusStr.SystemError;
            return res.send(response);
        }
        response.afterBalance = result.balance;
        return res.send(response);
    }
    async getBalance(req, res, body) {
        const response = {};
        response.acctInfo = {};
        response.acctInfo.userName = "";
        response.acctInfo.currency = "";
        response.acctInfo.acctId = body?.acctId;
        response.merchantCode = body.merchantCode ?? "";
        response.serialNo = body?.serialNo ?? "";
        response.acctInfo.balance = 0;
        response.code = fastspin_enum_1.Status.Success;
        const _digest = req.headers["digest"];
        const isVify = await this.fastSpinService.verifyDigest(_digest, req);
        if (isVify !== fastspin_enum_1.Status.Success) {
            response.code = fastspin_enum_1.Status.TokenValidationFailed;
            response.msg = fastspin_enum_1.StatusStr.TokenValidationFailed;
            return res.send(response);
        }
        const userObj = await this.fastSpinService.getUserIndObj(body?.acctId);
        if (!userObj) {
            response.code = fastspin_enum_1.Status.AcctNotFound;
            response.msg = fastspin_enum_1.StatusStr.AcctNotFound;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = fastspin_enum_1.Status.AcctInactive;
            response.msg = fastspin_enum_1.StatusStr.AcctInactive;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.FASTSPIN;
        if (!objThirdparty) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(config_1.Config.RESPONSE_ERROR);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: body.serialNo, is_test: false }),
            round_id: "",
            trans_id: "",
            amount: 0,
            game_code: body.gameCode ?? "",
            table_code: "",
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: 0,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: access_code_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: access_code_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            console.error([
                "FastSpinController-",
                "getBalance-",
                "gRPC-",
                "error : ",
                error,
            ]);
            return res.send({
                uid: body?.serialNo,
                error: { code: fastspin_enum_1.Status.SystemError },
            });
        }
        response.acctInfo.userName = userObj.id;
        response.acctInfo.currency = config_1.Config.CURRENCY.DEF;
        response.acctInfo.balance = result.balance;
        response.msg = fastspin_enum_1.StatusStr.Success;
        return res.send(response);
    }
    async transfer(req, res, body) {
        let dataObj;
        if (body?.type !== 7) {
            dataObj = body;
        }
        else {
            dataObj = body;
        }
        const response = {};
        response.transferId = dataObj?.transferId;
        response.merchantCode = dataObj?.merchantCode;
        response.merchantTxId = (0, uuid_1.v4)();
        response.acctId = dataObj?.acctId;
        response.balance = 0;
        response.msg = fastspin_enum_1.StatusStr.Success;
        response.code = fastspin_enum_1.Status.Success;
        response.serialNo = dataObj?.serialNo;
        if (!dataObj?.type) {
            response.code = fastspin_enum_1.Status.InvalidParameters;
            response.msg = fastspin_enum_1.StatusStr.InvalidParameters;
            return res.send(response);
        }
        const _digest = req.headers["digest"];
        const isVify = await this.fastSpinService.verifyDigest(_digest, req);
        if (isVify !== fastspin_enum_1.Status.Success) {
            response.code = fastspin_enum_1.Status.TokenValidationFailed;
            response.msg = fastspin_enum_1.StatusStr.TokenValidationFailed;
            return res.send(response);
        }
        const userObj = await this.fastSpinService.getUserIndObj(body?.acctId);
        if (!userObj) {
            response.code = fastspin_enum_1.Status.AcctNotFound;
            response.msg = fastspin_enum_1.StatusStr.AcctNotFound;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = fastspin_enum_1.Status.AcctInactive;
            response.msg = fastspin_enum_1.StatusStr.AcctInactive;
            return res.send(response);
        }
        const objThirdparty = config_2.Game.FASTSPIN;
        if (!objThirdparty) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).send(config_1.Config.RESPONSE_ERROR);
        }
        switch (dataObj?.type) {
            case 1:
                await this.fastSpinService.transferBetProcess(response, dataObj, userObj, objThirdparty);
                break;
            case 2:
                await this.fastSpinService.transferCancelProcess(response, dataObj, userObj, objThirdparty);
                break;
            case 4:
                await this.fastSpinService.transferPayoutProcess(response, dataObj, userObj, objThirdparty);
                break;
            case 7:
                await this.fastSpinService.transferBonusProcess(response, dataObj, userObj, objThirdparty);
                break;
            default:
                response.code = fastspin_enum_1.Status.MissingParameters;
                response.msg = fastspin_enum_1.StatusStr.MissingParameters;
                return res.send(response);
        }
        return res.send(response);
    }
};
exports.FastSpinController = FastSpinController;
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.routerCenter),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "routerCenter, all api entry point ; by hearders.API ; string",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "routerCenter", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.getHash),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "getHash",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "getHash", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.sid),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "sid",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fastspin_dto_1.SidDto, Object]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "sid", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.session),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "session",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, fastspin_dto_1.SessionDto]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "session", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.getAcctInfo),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "getAcctInfo",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, fastspin_dto_1.GetAcctInfoDto]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "getAcctInfo", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.deposit),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "deposit",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, fastspin_dto_1.DepositDto]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "deposit", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.getBalance),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "getBalance",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, fastspin_dto_1.GetBalanceDto]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.fastpain.transfer),
    (0, common_1.UsePipes)(global_dto_validation_pipe_1.GlobalDTOValidationPipe),
    (0, swagger_1.ApiOperation)({
        summary: "transfer",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FastSpinController.prototype, "transfer", null);
exports.FastSpinController = FastSpinController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        fastspin_service_1.FastSpinService,
        api_service_1.ApiService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], FastSpinController);
//# sourceMappingURL=fastspin.controller.js.map