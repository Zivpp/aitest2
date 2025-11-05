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
exports.BngService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const result_code_1 = require("../../Config/result.code");
const bng_enum_1 = require("./Enum/bng.enum");
const config_1 = require("../../Config/config");
const core_grpc_service_1 = require("../../Grpc/Clients/core.grpc.service");
const uuid_1 = require("uuid");
let BngService = class BngService {
    accessCodeService;
    coreGrpcService;
    constructor(accessCodeService, coreGrpcService) {
        this.accessCodeService = accessCodeService;
        this.coreGrpcService = coreGrpcService;
    }
    async login(body, objThirdparty, userObj) {
        const objParam = {
            round_id: "",
            trans_id: (0, uuid_1.v4)(),
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: "",
            event_type: 0,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: body.uid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: bng_enum_1.CallbackType.MemberCheck,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: bng_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            return {
                uid: body.uid,
                error: {
                    code: this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.BNG, error.statuscode),
                },
            };
        }
        let response;
        if (result?.result !== result_code_1.SUCCESS) {
            response = { uid: body.uid, error: { code: bng_enum_1.Status.INVALID_TOKEN } };
        }
        else {
            const opCode = this.accessCodeService.getOperatorCode(userObj.op);
            const userOpId = this.accessCodeService.getUserOPID(opCode, userObj.id);
            response = {
                uid: body.uid,
                player: {
                    id: userOpId,
                    brand: config_1.Config.BNG_GROUP.brand,
                    currency: config_1.Config.CURRENCY.DEF,
                    mode: "REAL",
                    is_test: JSON.parse(objParam.cp_data).is_test,
                },
                balance: {
                    value: result.balance.toString(),
                    version: 0,
                },
                tag: "",
                user: userObj,
            };
            let objBalance = await this.accessCodeService.setUserBalance(userObj.key.toString(), parseFloat(result.balance.toString()));
            response.balance.version = objBalance.balance.version;
            delete response.user;
        }
        return response;
    }
    async getBalance(body, objThirdparty, userObj) {
        const objData = { ...body };
        const sResponse = { uid: objData.uid, balance: { value: "0", version: 0 } };
        const fResponse = {
            uid: objData.uid,
            balance: { value: "0", version: 0 },
            error: { code: "" },
        };
        const objParam = {
            cp_data: JSON.stringify({ tuid: body.uid, is_test: false }),
            round_id: "",
            trans_id: (0, uuid_1.v4)(),
            amount: 0,
            game_code: "",
            table_code: "",
            game_type: "",
            event_type: 0,
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: bng_enum_1.CallbackType.Balance,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: bng_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        sResponse.balance.value = result.balance.toString();
        let objBalance = await this.accessCodeService.setUserBalance(userObj.key.toString(), parseFloat(result.balance.toString()));
        sResponse.balance.version = objBalance.balance.version;
        return sResponse;
    }
    async transaction(body, objThirdparty, userObj) {
        const objData = { ...body };
        if (!objData?.args?.round_id || !objData?.uid) {
            return {
                balance: {
                    value: "0",
                    version: Date.now(),
                },
                uid: null,
                error: {
                    code: bng_enum_1.Status.OTHER_EXCEED,
                },
            };
        }
        let nEventType = config_1.Config.BET_EVENT_TYPE.NORMAL;
        if (objData?.args?.bonus) {
            objData.args.bet = "0";
            nEventType = config_1.Config.BET_EVENT_TYPE.EVENT_CASH;
        }
        let response;
        const bet = objData?.args?.bet === null ? null : Number(objData?.args?.bet);
        const win = objData?.args?.win === null ? null : Number(objData?.args?.win);
        if (typeof bet === "number")
            response = await this.transactionBetGRPCCalling(objData, objThirdparty, userObj, nEventType);
        if (typeof win === "number" && !response?.bError)
            response = await this.transactionResultGRPCCalling(objData, objThirdparty, userObj, nEventType);
        let objBalance = await this.accessCodeService.setUserBalance(userObj.key.toString(), parseFloat(response.balance.value.toString()));
        response.balance.version = objBalance.balance.version;
        delete response.bError;
        return response;
    }
    async transactionBetGRPCCalling(objData, objThirdparty, userObj, nEventType) {
        const sResponse = {
            uid: objData.uid,
            balance: { value: "0", version: Date.now() },
            bError: false,
        };
        const fResponse = {
            uid: objData.uid,
            balance: { value: "0", version: Date.now() },
            error: { code: "" },
            bError: true,
        };
        let objParam1 = {
            round_id: objData.args.round_id?.toString() || "",
            trans_id: [objData.args.round_id, objData.uid].join("-"),
            amount: parseFloat(objData.args.bet || "0"),
            game_code: objData.game_id,
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: nEventType,
            table_code: "",
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
            cp_data: JSON.stringify({ tuid: objData.uid, is_test: false }),
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: objData,
            callbackType: bng_enum_1.CallbackType.Bet,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam1,
            lang: bng_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            if ([20201, 5001, 20202].includes(error?.statuscode)) {
                sResponse.balance.value = result.balance.toString();
                return sResponse;
            }
            else {
                fResponse.error.code =
                    this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.BNG, error.statuscode);
                fResponse.balance.value = result.balance.toString();
                return fResponse;
            }
        }
        sResponse.balance.value = result.balance.toString();
        return sResponse;
    }
    async transactionResultGRPCCalling(objData, objThirdparty, userObj, nEventType) {
        const sResponse = {
            uid: objData.uid,
            balance: { value: "0", version: Date.now() },
        };
        const fResponse = {
            uid: objData.uid,
            balance: { value: "0", version: Date.now() },
            error: { code: "" },
        };
        const objParam = {
            round_id: objData.args.round_id?.toString() || "",
            trans_id: objData.uid,
            amount: parseFloat(objData.args.win || "0"),
            game_code: objData.game_id,
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: nEventType,
            is_end: objData.args.round_finished || false,
            cp_data: JSON.stringify({ tuid: objData.uid, is_test: false }),
            table_code: "",
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body: objData,
            callbackType: bng_enum_1.CallbackType.Result,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: bng_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            if ([20201, 5001, 20202].includes(error?.statuscode)) {
                sResponse.balance.value = result.balance.toString();
                return sResponse;
            }
            else {
                fResponse.error.code =
                    this.accessCodeService.convertGrpcErrorStatusToText(config_1.Config.GRPC_RES_STATUS_MAP.PROVIDER.BNG, error.statuscode);
                fResponse.balance.value = result.balance.toString();
                return fResponse;
            }
        }
        sResponse.balance.value = result.balance.toString();
        return sResponse;
    }
    async rollback(body, objThirdparty, userObj) {
        const objData = { ...body };
        const sResponse = { uid: objData.uid, balance: { value: "0", version: 0 } };
        const fResponse = {
            uid: objData.uid,
            balance: { value: "0", version: 0 },
            error: { code: "", message: "" },
        };
        const objParam = {
            round_id: body.args.round_id?.toString() || "",
            trans_id: [body.args.round_id, body.args.transaction_uid].join("-"),
            amount: parseFloat(body?.args?.bet ?? "0"),
            game_code: body.game_id,
            game_type: config_1.Config.GAMECODE.SLOT,
            event_type: config_1.Config.BET_EVENT_TYPE.NORMAL,
            cp_data: JSON.stringify({ tuid: body.uid, is_test: false }),
            table_code: "",
            is_end: false,
            is_cancel_round: false,
            is_end_check: false,
        };
        const processRequestObj = this.accessCodeService.buildProcessRequest({
            body,
            callbackType: bng_enum_1.CallbackType.Refund,
            objUser: userObj,
            objThirdParty: objThirdparty,
            objData: objParam,
            lang: bng_enum_1.Lang.ko,
        });
        const reply = await this.coreGrpcService.processCall(processRequestObj);
        const { result, error } = reply;
        if (error) {
            if ([20203, 20200].includes(error?.statuscode)) {
                sResponse.balance.value = result.balance.toString();
            }
            else {
                fResponse.error.code = bng_enum_1.Status.OTHER_EXCEED;
                fResponse.balance.value = result.balance.toString();
                fResponse.error.message = [
                    result.error_msg,
                    " [",
                    result.result,
                    "]",
                ].join("");
                fResponse.balance.version = Date.now();
                return fResponse;
            }
        }
        sResponse.balance.value = result.balance.toString();
        let objBalance = await this.accessCodeService.setUserBalance(userObj.key.toString(), parseFloat(sResponse.balance.value.toString()));
        sResponse.balance.version = objBalance.balance.version;
        return sResponse;
    }
};
exports.BngService = BngService;
exports.BngService = BngService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        core_grpc_service_1.CoreGrpcService])
], BngService);
//# sourceMappingURL=bng.service.js.map