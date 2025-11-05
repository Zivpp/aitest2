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
exports.PpController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const uuid_1 = require("uuid");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_path_1 = require("../../Config/api.path");
const pp_service_1 = require("./pp.service");
const result_code_1 = require("../../Config/result.code");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const config_1 = require("../../Config/config");
const pp_enum_1 = require("./Enum/pp.enum");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
let PpController = class PpController {
    accessCodeService;
    ppService;
    apiService;
    coreGrpcService;
    constructor(accessCodeService, ppService, apiService, coreGrpcService) {
        this.accessCodeService = accessCodeService;
        this.ppService = ppService;
        this.apiService = apiService;
        this.coreGrpcService = coreGrpcService;
    }
    async session(req, body) {
        const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
        const allowList = config_1.Config.MAIN_APP_IP || [];
        const isAllowed = allowList.includes(rawIP);
        if (!isAllowed) {
            return { result: result_code_1.FAILED };
        }
        await this.accessCodeService.addUserObj(body?.user_id, config_1.Game.PP.cp_key.toString(), body.token);
        await this.accessCodeService.addUserObj(body?.token?.sg, config_1.Game.PP.cp_key.toString(), body.token);
        return { result: result_code_1.SUCCESS };
    }
    async auth(body, res) {
        const bodyObj = { ...body };
        const userObj = await this.accessCodeService.getUserObj(bodyObj.token, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({
                error: 4,
                description: "invalid token",
                trace: bodyObj.trace,
            });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({ error: 4, description: "invalid key", trace: bodyObj.trace });
        }
        const objThirdparty = this.ppService.getThirdPartObjByCpKey(userObj?.c?.toString() ?? "0");
        const objParam = {
            round_id: (0, uuid_1.v4)(),
            trans_id: (0, uuid_1.v4)(),
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: "",
            event_type: 0,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.MemberCheck,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, objThirdparty, pp_enum_1.CallbackType.MemberCheck);
        res.send(apiResult);
    }
    async balance(body, res) {
        const reqData = { ...body };
        const response = {};
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({ error: 4, description: "invalid key", trace: body.trace });
        }
        const objThirdparty = this.ppService.getThirdPartObjByCpKey(userObj?.c?.toString() ?? "0");
        const objParam = {
            round_id: (0, uuid_1.v4)(),
            trans_id: (0, uuid_1.v4)(),
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: "",
            event_type: 0,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, objThirdparty, pp_enum_1.CallbackType.Balance);
        response.bonus = apiResult.bonus;
        response.cash = apiResult.cash;
        response.currency = apiResult.currency;
        response.error = apiResult.error;
        response.description = apiResult.description;
        return res.send(response);
    }
    async bet(body, res) {
        const reqData = { ...body };
        const response = {};
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        const strGameType = this.ppService.isCasino(reqData.gameId)
            ? config_1.Config.GAMECODE.LIVE
            : config_1.Config.GAMECODE.SLOT;
        const objThirdparty = this.ppService.getThirdPartyObject(reqData.gameId, userObj.c.toString());
        const tableInfo = await this.accessCodeService.getTableInfo(config_1.Game.PP_LIVE.cp_key.toString(), reqData.gameId);
        const objParam = {
            round_id: (0, uuid_1.v4)(),
            trans_id: (0, uuid_1.v4)(),
            amount: Math.abs(parseFloat(Number(reqData?.amount).toFixed(2))),
            game_code: reqData.gameId,
            table_code: tableInfo?.name ?? "",
            game_type: strGameType,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, objThirdparty, pp_enum_1.CallbackType.Bet);
        response.transactionId = apiResult.transactionId;
        response.currency = apiResult.currency;
        response.cash = apiResult.cash;
        response.bonus = apiResult.bonus;
        response.error = apiResult.error;
        response.description = apiResult.description;
        return res.send(response);
    }
    async result(body, res) {
        const reqData = { ...body };
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        const strGameType = this.ppService.isCasino(reqData.gameId)
            ? config_1.Config.GAMECODE.LIVE
            : config_1.Config.GAMECODE.SLOT;
        const objThirdparty = this.ppService.getThirdPartyObject(reqData.gameId, userObj.c.toString());
        const tableInfo = await this.accessCodeService.getTableInfo(config_1.Game.PP_LIVE.cp_key.toString(), reqData.gameId);
        const bPromoWin = !_.isNull(reqData.promoWinAmount) &&
            parseFloat(reqData.promoWinAmount) !== 0
            ? true
            : false;
        const objParam = {
            round_id: (0, uuid_1.v4)(),
            trans_id: (0, uuid_1.v4)(),
            amount: Math.abs(parseFloat(Number(reqData?.amount).toFixed(2))),
            game_code: reqData.gameId,
            table_code: tableInfo?.name ?? "",
            game_type: strGameType,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            trace: body.trace,
            is_end: !bPromoWin,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, objThirdparty, pp_enum_1.CallbackType.Result);
        if (!bPromoWin || apiResult.error !== 0) {
            if (apiResult.error === 20202 || apiResult.error === 20206) {
                apiResult.error = 0;
                apiResult.description = "Success";
            }
            return res.send(apiResult);
        }
        const objParam2 = {
            round_id: reqData.roundId,
            trans_id: reqData.promoWinReference,
            amount: Math.abs(Number(reqData?.promoWinAmount)),
            game_code: reqData.gameId,
            table_code: tableInfo?.name ?? "",
            game_type: strGameType,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            is_end: true,
            trace: body.trace,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj2 = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam2,
            lang: pp_enum_1.Lang.ko,
        });
        const reply2 = await this.coreGrpcService.processCall(processRequestObj2);
        const { result: result2, error: error2 } = reply2;
        if (error2) {
            throw new common_1.BadRequestException({
                code: error2.statuscode,
                message: error2.msg,
            });
        }
        const apiResult2 = this.ppService.buildServiceResult(result2, userObj, objThirdparty, pp_enum_1.CallbackType.Result);
        if (apiResult2.hasOwnProperty("transactionId")) {
            apiResult2.transactionId = apiResult.transactionId;
        }
        if (apiResult2.error !== 0) {
            if (objParam2?.amount !== 0 && !_.isNull(reqData?.bonusCode)) {
            }
            if (apiResult2.error === 20202 || apiResult2.error === 20206) {
                apiResult2.error = 0;
                apiResult2.description = "Success";
            }
            return res.send(apiResult2);
        }
        return res.send(apiResult2);
    }
    async refund(body, res) {
        const reqData = { ...body };
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        const strGameType = this.ppService.isCasino(reqData.gameId)
            ? config_1.Config.GAMECODE.LIVE
            : config_1.Config.GAMECODE.SLOT;
        const objThirdparty = this.ppService.getThirdPartyObject(reqData.gameId, userObj.c.toString());
        const tableInfo = await this.accessCodeService.getTableInfo(config_1.Game.PP_LIVE.cp_key.toString(), reqData.gameId);
        let strRoundID = "";
        let fAmount = 0;
        if (!reqData?.roundId || !reqData?.amount) {
            let objFindTrans = await this.ppService.getTransData(reqData?.reference);
            if (!_.isNil(objFindTrans)) {
                strRoundID = objFindTrans?.thirdparty_round_id;
                fAmount = objFindTrans?.amount;
            }
        }
        else {
            strRoundID = reqData.roundId;
            fAmount = parseFloat(reqData.amount.toString());
        }
        const objParam = {
            round_id: strRoundID,
            trans_id: reqData.reference,
            amount: Math.abs(Number(fAmount)),
            game_code: reqData.gameId || "",
            table_code: tableInfo?.name ?? "",
            game_type: strGameType,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Refund,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, objThirdparty, pp_enum_1.CallbackType.Refund);
        if (apiResult.error !== 0)
            delete apiResult["transactionId"];
        if (apiResult.error == 20203) {
            apiResult.error = 0;
            apiResult.description = "Success";
        }
        return apiResult;
    }
    async bonusWin(body, res) {
        const reqData = { ...body };
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        const objParam = {
            round_id: (0, uuid_1.v4)(),
            trans_id: (0, uuid_1.v4)(),
            amount: Math.abs(Number(reqData?.amount)),
            game_code: "",
            table_code: "",
            game_type: "",
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const nullObjThirdparty = this.accessCodeService.getNullObjThirdparty();
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: nullObjThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, nullObjThirdparty, pp_enum_1.CallbackType.Balance);
        if (apiResult.error === 0)
            apiResult.transactionId = result.trans_id;
        return apiResult;
    }
    async jackpotWin(body, res) {
        const reqData = { ...body };
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        let objParam = {
            round_id: reqData.roundId,
            trans_id: reqData.reference,
            amount: Math.abs(parseFloat(reqData?.amount.toString())),
            game_code: reqData.gameId,
            table_code: await this.accessCodeService.getTableInfo(config_1.Game.PP.cp_key.toString(), reqData.gameId),
            game_type: this.ppService.isCasino(reqData.gameId)
                ? config_1.Config.GAMECODE.LIVE
                : config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const nullObjThirdparty = this.accessCodeService.getNullObjThirdparty();
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: nullObjThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, nullObjThirdparty, pp_enum_1.CallbackType.Result);
        if (apiResult.error !== 0) {
            if (apiResult.error === 20202 || apiResult.error === 20206) {
                apiResult.error = 0;
                apiResult.description = "Success";
            }
        }
        return apiResult;
    }
    async promoWin(body, res) {
        const reqData = { ...body };
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        const objParam = {
            round_id: body.reference ?? (0, uuid_1.v4)(),
            trans_id: body.reference ?? (0, uuid_1.v4)(),
            amount: 0,
            game_code: body.campaignId,
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            trace: body.trace,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
            table_code: "",
        };
        const nullObjThirdparty = this.accessCodeService.getNullObjThirdparty();
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: nullObjThirdparty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, nullObjThirdparty, pp_enum_1.CallbackType.Result);
        if (apiResult.error !== 0 && apiResult.error !== 20201) {
            res.send(apiResult);
        }
        const objParam2 = {
            round_id: body.reference ?? (0, uuid_1.v4)(),
            trans_id: ["pw-", body.reference].join(""),
            amount: Math.abs(parseFloat(body?.amount)),
            game_code: body.campaignId,
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.EVENT_CASH,
            is_end: true,
            trace: body.trace ?? (0, uuid_1.v4)(),
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
            table_code: "",
        };
        const processRequestObj2 = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: nullObjThirdparty,
            objData: objParam2,
            lang: pp_enum_1.Lang.ko,
        });
        const reply2 = await this.coreGrpcService.processCall(processRequestObj2);
        const { result: result2, error: error2 } = reply2;
        if (error2) {
            throw new common_1.BadRequestException({
                code: error2.statuscode,
                message: error2.msg,
            });
        }
        const apiResult2 = this.ppService.buildServiceResult(result2, userObj, nullObjThirdparty, pp_enum_1.CallbackType.Result);
        if (apiResult2.error !== 0 &&
            (apiResult2.error === 20201 || apiResult2.error === 20202)) {
            apiResult2.error = 0;
            apiResult2.description = "Success";
        }
        return apiResult;
    }
    async endround(body, res) {
        const reqData = { ...body };
        const userObj = await this.accessCodeService.getUserObj(reqData.userId, config_1.Game.PP.cp_key.toString());
        if (!userObj) {
            res.send({ error: 4, description: "invalid token", trace: body.trace });
        }
        const inValid = this.accessCodeService.inValidToken(userObj);
        if (inValid) {
            res.send({
                error: 4,
                description: "Membership verification failure",
                trace: body.trace,
            });
        }
        const thirdParty = this.ppService.getThirdPartyObject(reqData.gameId, userObj.c.toString());
        const tableInfo = await this.accessCodeService.getTableInfo(config_1.Game.PP.cp_key.toString(), reqData.gameId);
        const objParam = {
            round_id: reqData.roundId ?? (0, uuid_1.v4)(),
            trans_id: [reqData.roundId, "_end"].join("") ?? (0, uuid_1.v4)(),
            amount: 0,
            game_code: reqData.gameId,
            table_code: tableInfo?.name ?? "",
            game_type: thirdParty?.game_type ?? "",
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            is_end: true,
            trace: body.trace ?? (0, uuid_1.v4)(),
            is_cancel_round: false,
            is_end_check: false,
            cp_data: "",
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: pp_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: thirdParty,
            objData: objParam,
            lang: pp_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            throw new common_1.BadRequestException({
                code: error.statuscode,
                message: error.msg,
            });
        }
        const apiResult = this.ppService.buildServiceResult(result, userObj, thirdParty, pp_enum_1.CallbackType.Result);
        if (apiResult.error !== 0 &&
            (apiResult.error === 20202 || apiResult.error === 20206)) {
            apiResult.error = 0;
            apiResult.description = "Success";
        }
        delete apiResult["currency"];
        delete apiResult["transactionId"];
        return apiResult;
    }
};
exports.PpController = PpController;
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.session),
    (0, swagger_1.ApiOperation)({
        summary: "session ??",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "session", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.auth),
    (0, swagger_1.ApiOperation)({
        summary: "When the game is opening Pragmatic Play receives with URL security token generated by Casino Operator. Using this token" +
            "Pragmatic Play will ask Casino Operator for player authentication and get the player’s balance",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "auth", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.balance),
    (0, swagger_1.ApiOperation)({
        summary: "Using this method a Pragmatic Play system will know a current balance of player and will show it in the game.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "balance", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.bet),
    (0, swagger_1.ApiOperation)({
        summary: "Using this method Pragmatic Play system will check the player balance on Casino Operator side to ensure they still have the" +
            "funds to cover the bet. Amount of the bet must be subtracted from player balance in Casino Operator system.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "bet", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.result),
    (0, swagger_1.ApiOperation)({
        summary: "Using this method the Pragmatic Play system will send to Casino Operator the winning result of a bet. The Casino Operator" +
            "will change the balance of the player in accordance with this request and return the updated balance." +
            "Result request may contain a prize that the player is awarded with during the game round, if there is an active promotional" +
            "campaigns like Prize Drop. Parameters related to the Prize Drop prizes are optional and should be configured by" +
            "PragmaticPlay team based on Operator’s request.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "result", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.refund),
    (0, swagger_1.ApiOperation)({
        summary: "Pragmatic Play system may use this method to rollback a bet transaction on the Casino Operator side, in order to reverse" +
            "the transaction and adjust player’s balance. When receive a Refund request Operator have to return money back to player’s " +
            "balance. ",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "refund", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.bonusWin),
    (0, swagger_1.ApiOperation)({
        summary: "Using this method a Pragmatic Play system will send to Casino Operator winning result of all rounds played on Free Spins" +
            "Bonus. Casino Operator will change a player balance in appliance with this request and will return an updated balance.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "bonusWin", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.jackpotWin),
    (0, swagger_1.ApiOperation)({
        summary: "Using this method a Pragmatic Play system will notify Casino Operator about Jackpot winning. Operator should handle the" +
            "transaction in their system and send the jackpot win transaction id back to the Pragmatic Play.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "jackpotWin", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.promoWin),
    (0, swagger_1.ApiOperation)({
        summary: "Using this method the Pragmatic Play system will notify Casino Operator about winning that the player is awarded as a" +
            "result of a campaign that is finished. Notification is asynchronous and may come to the operator with a short delay after the" +
            "campaign is over. Operator should handle the transaction in their system and send promo win transaction id back to the" +
            "Pragmatic Play",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "promoWin", null);
__decorate([
    (0, common_1.Post)(api_path_1.default.pp.endround),
    (0, swagger_1.ApiOperation)({
        summary: "Every time a game round is over, the Pragmatic Play system will call EndRound method, so that Operator can finalize the" +
            "game round transactions on their side in real time.",
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PpController.prototype, "endround", null);
exports.PpController = PpController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        pp_service_1.PpService,
        api_service_1.ApiService,
        core_grpc_service_1.CoreGrpcService])
], PpController);
//# sourceMappingURL=pp.controller.js.map