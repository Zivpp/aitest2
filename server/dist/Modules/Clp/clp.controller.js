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
exports.ClpController = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const clp_service_1 = require("./clp.service");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const result_code_1 = require("../../Config/result.code");
const config_1 = require("../../Config/config");
const api_path_1 = require("../../Config/api.path");
const clp_enum_1 = require("./Enum/clp.enum");
const OBJ_THIRDPARTY = config_1.Game.CLP;
const CP_RESULT_CODE = OBJ_THIRDPARTY.result_code;
let ClpController = class ClpController {
    accessCodeService;
    clpService;
    apiService;
    coreGrpcService;
    redisService;
    constructor(accessCodeService, clpService, apiService, coreGrpcService, redisService) {
        this.accessCodeService = accessCodeService;
        this.clpService = clpService;
        this.apiService = apiService;
        this.coreGrpcService = coreGrpcService;
        this.redisService = redisService;
    }
    async session(req, body) {
        const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
        console.info("********* rawIP = ", rawIP);
        const allowList = config_1.Config.MAIN_APP_IP || [];
        const isAllowed = allowList.includes(rawIP);
        if (!isAllowed) {
            return { result: result_code_1.FAILED };
        }
        await this.accessCodeService.addUserObj(body?.token?.key, config_1.Game.CLP.cp_key.toString(), body.token);
        return { result: result_code_1.SUCCESS };
    }
    async getBalance(req, res, query) {
        const _PARAMS_ERROR = "PARAMS ERROR";
        const _INVALID_USER_ID = "INVALID USER ID";
        const _SESSION_ERROR = "SESSION ERROR";
        const response = {
            code: CP_RESULT_CODE.success,
            data: { balance: 0 },
            msg: "",
        };
        const { authorization } = req.headers;
        const { player_unique_id } = query;
        if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        if (!player_unique_id) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        const userId = parseInt(player_unique_id.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(userId.toString(), OBJ_THIRDPARTY.cp_key.toString());
        if (!userObj) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: player_unique_id, is_test: false }),
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
            body: query,
            callbackType: clp_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: clp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _SESSION_ERROR;
            return res.send(response);
        }
        delete response.msg;
        response.data.balance = result.balance;
        return res.send(response);
    }
    async bet(req, res, body) {
        const _PARAMS_ERROR = "PARAMS ERROR";
        const _INVALID_USER_ID = "INVALID USER ID";
        const _SESSION_ERROR = "SESSION ERROR";
        const response = {
            code: CP_RESULT_CODE.success,
            data: { balance: 0 },
            msg: "",
        };
        const { authorization } = req.headers;
        const { player_unique_id, amount, is_buy, game, game_round_id, currency, transaction_id, } = body;
        if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        if (typeof amount === "undefined" ||
            typeof is_buy === "undefined" ||
            !game ||
            !game_round_id ||
            !currency ||
            !player_unique_id) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        const userId = parseInt(player_unique_id.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(userId.toString(), OBJ_THIRDPARTY.cp_key.toString());
        if (!userObj) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: game_round_id, is_test: false }),
            round_id: [game_round_id].join("_"),
            trans_id: transaction_id,
            amount: Math.abs(Number(amount)),
            game_code: game,
            table_code: "",
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: clp_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: clp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _SESSION_ERROR;
            return res.send(response);
        }
        delete response.msg;
        response.data.balance = result.balance;
        return res.send(response);
    }
    async settlement(req, res, body) {
        const _PARAMS_ERROR = "PARAMS ERROR";
        const _INVALID_USER_ID = "INVALID USER ID";
        const _SESSION_ERROR = "SESSION ERROR";
        const response = {
            code: CP_RESULT_CODE.success,
            data: { balance: 0 },
            msg: "",
        };
        const { authorization } = req.headers;
        const { player_unique_id, amount, valid_bet, is_buy, transaction_id, game, game_round_id, currency, } = body;
        if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        if (typeof amount === "undefined" ||
            typeof is_buy === "undefined" ||
            typeof valid_bet === "undefined" ||
            !game ||
            !game_round_id ||
            !currency ||
            !player_unique_id ||
            !transaction_id) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        const userId = parseInt(player_unique_id.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(userId.toString(), OBJ_THIRDPARTY.cp_key.toString());
        if (!userObj) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: game_round_id, is_test: false }),
            round_id: [game_round_id].join("_"),
            trans_id: ["R", transaction_id].join("-"),
            amount: Math.abs(Number(amount)),
            game_code: game,
            table_code: "",
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: true,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: clp_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: clp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _SESSION_ERROR;
            return res.send(response);
        }
        delete response.msg;
        response.data.balance = parseFloat(result.balance.toString());
        return res.send(response);
    }
    async cancel(req, res, body) {
        const _PARAMS_ERROR = "PARAMS ERROR";
        const _INVALID_USER_ID = "INVALID USER ID";
        const _SESSION_ERROR = "SESSION ERROR";
        const response = {
            code: CP_RESULT_CODE.success,
            data: { balance: 0 },
            msg: "",
        };
        const { authorization } = req.headers;
        const { player_unique_id, transaction_id, game, game_round_id, currency, amount, } = body;
        if (!authorization || authorization !== OBJ_THIRDPARTY.key) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        if (!game ||
            !game_round_id ||
            !currency ||
            !player_unique_id ||
            !transaction_id) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _PARAMS_ERROR;
            return res.send(response);
        }
        const userId = parseInt(player_unique_id.slice(config_1.Config.MAX_USER_ID_PREFIX_LEN));
        const userObj = await this.accessCodeService.getUserObj(userId.toString(), OBJ_THIRDPARTY.cp_key.toString());
        if (!userObj) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            response.code = CP_RESULT_CODE.invalid_user_id;
            response.msg = _INVALID_USER_ID;
            return res.send(response);
        }
        const objParam = {
            cp_data: JSON.stringify({ tuid: game_round_id, is_test: false }),
            round_id: [game_round_id].join("_"),
            trans_id: transaction_id,
            amount: Math.abs(Number(amount)),
            game_code: game,
            table_code: "",
            game_type: OBJ_THIRDPARTY.game_type,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: clp_enum_1.CallbackType.Refund,
            objUser: userObj,
            objThirdParty: OBJ_THIRDPARTY,
            objData: objParam,
            lang: clp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            response.code = CP_RESULT_CODE.session_error;
            response.msg = _SESSION_ERROR;
            return res.send(response);
        }
        delete response.msg;
        response.data.balance = result.balance;
        return res.send(response);
    }
};
exports.ClpController = ClpController;
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
], ClpController.prototype, "session", null);
__decorate([
    (0, common_1.Get)(api_path_1.default.clp.api.seamless.getBalance),
    (0, swagger_1.ApiOperation)({
        summary: "getBalance",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClpController.prototype, "getBalance", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.clp.api.seamless.bet),
    (0, swagger_1.ApiOperation)({
        summary: "bet",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClpController.prototype, "bet", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.clp.api.seamless.settlement),
    (0, swagger_1.ApiOperation)({
        summary: "settlement",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClpController.prototype, "settlement", null);
__decorate([
    (0, common_2.Post)(api_path_1.default.clp.api.seamless.cancel),
    (0, swagger_1.ApiOperation)({
        summary: "cancel",
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_3.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ClpController.prototype, "cancel", null);
exports.ClpController = ClpController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        clp_service_1.ClpService,
        api_service_1.ApiService,
        core_grpc_service_1.CoreGrpcService,
        redis_service_1.RedisService])
], ClpController);
//# sourceMappingURL=clp.controller.js.map