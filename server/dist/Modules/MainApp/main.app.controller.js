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
exports.MainAppController = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_path_1 = require("../../Config/api.path");
const swagger_1 = require("@nestjs/swagger");
const config_local_1 = require("../../Config/config.local");
const main_app_service_1 = require("./main.app.service");
const result_code_1 = require("../../Config/result.code");
const main_app_dto_1 = require("./Dto/main.app.dto");
const uuid_1 = require("uuid");
let MainAppController = class MainAppController {
    accessCodeService;
    mainAppService;
    constructor(accessCodeService, mainAppService) {
        this.accessCodeService = accessCodeService;
        this.mainAppService = mainAppService;
    }
    async getIp(req, res) {
        const ip = this.accessCodeService.getReqIP(req);
        return res.send(ip);
    }
    async hash(req, res, query) {
        const queryObj = query;
        const md5hash = this.mainAppService.getMd5Hash(queryObj.opkey, req.query);
        const md5encHash = this.mainAppService.getMd5EncHash(queryObj.opkey, req.query);
        return res.send({
            md5hash,
            md5encHash,
            isMd5hash: md5hash === queryObj.hash,
            isMd5encHash: md5encHash === queryObj.hash,
            query,
        });
    }
    async account(req, res, query) {
        const result = {};
        const strReqOPKey = query.opkey || null, strReqUserId = query.userid || null, strReqHash = query.hash || null, strRequestIP = this.accessCodeService.getReqIP(req);
        if (!strReqOPKey || !strReqUserId || !strReqHash) {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", 100);
            return res.send(result);
        }
        if (strReqOPKey.length !== config_local_1.Config.MAX_UUID_SIZE) {
            result.result = 101;
            result.msg = this.mainAppService.getResultMsg("-", 101);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", 10000);
            return res.send(result);
        }
        const operatorInfo = await this.mainAppService.getOperatorInfo(strReqOPKey, strRequestIP);
        if (!operatorInfo) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        const userInfo = await this.mainAppService.findUserByOperatorAndUserIdOrg(operatorInfo?.idx.toString(), strReqUserId);
        if (!userInfo) {
            result.result = 10001;
            result.msg = this.mainAppService.getResultMsg("-", 1001);
            return res.send(result);
        }
        result.result = 1;
        result.msg = this.mainAppService.getResultMsg("-", 1);
        result.data = {
            user: {
                id: userInfo.user_id_org,
                nick: userInfo.user_nick_org,
            },
        };
        return res.send(result);
    }
    async createAccount(req, res, query) {
        const result = {};
        const strReqOPKey = query.opkey || null, strReqUserId = query.userid || null, strReqUserNick = query.nick || null, strReqHash = query.hash || null, strRequestIP = this.accessCodeService.getReqIP(req);
        if (!strReqOPKey || !strReqUserId || !strReqHash) {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", 100);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", 10000);
            return res.send(result);
        }
        const operatorInfo = await this.mainAppService.getOperatorInfo(strReqOPKey, strRequestIP);
        if (!operatorInfo) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        const newUserObject = {};
        newUserObject.user_nick_org = strReqUserNick
            ? strReqUserNick
            : strReqUserId;
        newUserObject.user_id_org = strReqUserId;
        const newUser = await this.mainAppService.createUser(operatorInfo?.idx.toString(), strReqUserId, newUserObject, 1);
        if (!newUser) {
            result.result = 10002;
            result.msg = this.mainAppService.getResultMsg("-", 10002);
            return res.send(result);
        }
        result.result = 1;
        result.msg = this.mainAppService.getResultMsg("-", 1);
        const resultDate = {};
        resultDate.id = newUser.user_id ?? "";
        resultDate.nick = newUser.user_nick ?? "";
        resultDate.betskin = query.bet_skin_group ?? "";
        result.data = resultDate;
        return res.send(result);
    }
    async provlist(req, res, query) {
        const result = {};
        result.ver = 1;
        let strReqOPKey = req.query.opkey || null, strReqHash = req.query.hash || null, strRequestIP = this.accessCodeService.getReqIP(req);
        if (!strReqOPKey || strReqOPKey === "") {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", 100);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", 10000);
            return res.send(result);
        }
        const operatorInfo = await this.mainAppService.getOperatorInfo(strReqOPKey, strRequestIP);
        if (!operatorInfo) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        result.result = result_code_1.SUCCESS;
        result.msg = this.mainAppService.getResultMsg("-", result_code_1.SUCCESS);
        const list = await this.mainAppService.getCPList();
        const provListData = { list: list };
        result.data = provListData;
        return res.send(result);
    }
    async gamelist(req, res, query) {
        const result = {};
        result.ver = 1;
        let strReqOPKey = query.opkey || null, strThirdPartyCode = query.thirdpartycode || "", strReqHash = query.hash || "", bReqUseTableType = (query?.use_tabletype || 0) == 1, strRequestIP = this.accessCodeService.getReqIP(req);
        if (!strReqOPKey || strReqOPKey === "") {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", 100);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", 10000);
            return res.send(result);
        }
        const operatorInfo = await this.mainAppService.getOperatorInfo(strReqOPKey, strRequestIP);
        if (!operatorInfo) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        try {
            let searchResult;
            if (bReqUseTableType) {
                searchResult = await this.mainAppService.getGameListTableType(strThirdPartyCode, 1);
            }
            else {
                searchResult = await this.mainAppService.getGameList(strThirdPartyCode, 1);
            }
            result.result = result_code_1.SUCCESS;
            result.msg = this.mainAppService.getResultMsg("-", result_code_1.SUCCESS);
            result.data = searchResult;
        }
        catch (error) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        return res.send(result);
    }
    async gamelist_new(req, res, query) {
        const result = {};
        result.ver = 1;
        let strReqOPKey = query.opkey || null, strReqHash = query.hash || "", strRequestIP = this.accessCodeService.getReqIP(req);
        if (!strReqOPKey || strReqOPKey === "") {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", 100);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", 10000);
            return res.send(result);
        }
        const operatorInfo = await this.mainAppService.getOperatorInfo(strReqOPKey, strRequestIP);
        if (!operatorInfo) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        try {
            result.result = result_code_1.SUCCESS;
            result.msg = this.mainAppService.getResultMsg("-", result_code_1.SUCCESS);
            result.data = await this.mainAppService.getNewGameList();
        }
        catch (error) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        return res.send(result);
    }
    async gameTablelist(req, res) {
        const result = {};
        result.result = result_code_1.SUCCESS;
        result.data = null;
        const checkResponse = await this.mainAppService.checkParams(req);
        result.result = checkResponse.result;
        result.msg = this.mainAppService.getResultMsg("-", checkResponse.result);
        if (checkResponse.result !== result_code_1.SUCCESS) {
            return res.send(result);
        }
        const list = await this.accessCodeService.getTableListByCPKey(req.query.thirdpartycode);
        if (!list) {
            result.result = result_code_1.FAILED;
            result.msg = "오류가 발생했습니다";
            return res.send(result);
        }
        result.data = list;
        return res.send(result);
    }
    async play(req, res, query, a_nVersion = 0) {
        const result = {};
        result.result = result_code_1.SUCCESS;
        let nResult = result_code_1.SUCCESS, nVer = a_nVersion == 0
            ? this.accessCodeService.getVersionFromUrl(req.url)
            : a_nVersion;
        let strReqOPKey = query.opkey || null, strReqUserId = query.userid || null, strThirdPartyCode = query.thirdpartycode || null, strGameCode = query.gamecode || null, strReqHash = query.hash || null, strDevice = query.platform || config_local_1.Config.DEVICE.pc, strReqUserrIP = query.ip || null, strCurrency = query.currency || null, strBetLimitType = query.bet_limit || 0, strLanaguage = req.query.lang || null, strRequestIP = this.accessCodeService.getReqIP(req), strUserAgent = req.headers["user-agent"] || null, strSiteUrl = req.query.returnUrl || req.query.return_url || null, strCustomerValue = req.query.customervalue || null, strSrcTrace = this.accessCodeService.getTraceCode();
        if (!strReqOPKey ||
            !strReqUserId ||
            !strThirdPartyCode ||
            !strGameCode ||
            !strReqHash) {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", 100);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", 10000);
            return res.send(result);
        }
        const procChkOperatorIp = this.accessCodeService.getVpnIpIfNonProd(strRequestIP);
        const operator = await this.mainAppService.procChkOperator(strReqOPKey, procChkOperatorIp);
        if (!operator) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        const reqCxUser = {};
        reqCxUser.user_id_org = strReqUserId;
        reqCxUser.user_nick_org = strReqUserId;
        const cUser = await this.mainAppService.createUser(operator.id.toString(), strReqUserId, reqCxUser, nVer);
        if (!cUser) {
            result.result = 10001;
            result.msg = this.mainAppService.getResultMsg("-", 10);
            return res.send(result);
        }
        if (operator.wallet_type == config_local_1.Config.WALLET_TYPE.TRANSFER)
            await this.mainAppService.getTransferBalance(operator.id.toString(), operator.key, cUser.user_key.toString(), cUser.user_id);
        const strGameMTCode = await this.mainAppService.getGameMTCode(strThirdPartyCode, strGameCode);
        if (!strGameMTCode)
            strGameCode = strGameMTCode;
        try {
            nResult = await this.mainAppService.checkGamePermit(operator.id, parseInt(strThirdPartyCode), strGameCode);
        }
        catch (error) {
            console.error("[play][게임사체크]");
            console.error(error);
        }
        if (nResult !== result_code_1.SUCCESS) {
            result.result = 0;
            result.msg = this.mainAppService.getResultMsg("-", 0);
            return res.send(result);
        }
        if (strCustomerValue)
            strCustomerValue = strCustomerValue
                .toString()
                .slice(0, config_local_1.Config.MAX_CUSTOMER_VALUE_LEN);
        cUser.sign = (0, uuid_1.v4)().replace(/-/g, "");
        cUser.connect_ip = strReqUserrIP || strRequestIP;
        const objPlayData = {
            ver: nVer,
            tr: strSrcTrace,
            op: operator,
            user: cUser,
            gamecode: strGameCode,
            device: strDevice,
            cp: parseInt(strThirdPartyCode),
            useragent: strUserAgent,
            siteurl: await this.mainAppService.decodeSiteUrlOrDefault(strSiteUrl),
            betlimit: strBetLimitType,
            lang: strLanaguage,
            currency: strCurrency,
            splash: { is_use: false, data: null },
            req: req.query,
            times: Date.now(),
        };
        const objCPItem = this.accessCodeService
            .getGCpList()
            .find((x) => x.code == parseInt(strThirdPartyCode));
        if (config_local_1.Config.SPLASH_USE && objCPItem?.splash_use) {
            const result = await this.mainAppService.UseSplashProcess(operator, objPlayData, cUser);
            return res.send(result);
        }
        else {
            const result = await this.mainAppService.NoUseSplashProcess(operator, objPlayData, cUser);
            return res.send(result);
        }
    }
    async currentR(req, res, query, a_nVersion = 0) {
        const result = {};
        result.result = result_code_1.SUCCESS;
        result.ver =
            a_nVersion == 0
                ? this.accessCodeService.getVersionFromUrl(req.url)
                : a_nVersion;
        result.data = { r: 0 };
        const strReqOPKey = query.opkey || null;
        const strReqHash = query.hash || null;
        const strRequestIP = this.accessCodeService.getReqIP(req);
        if (!strReqOPKey) {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", result.result);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", result.result);
            return res.send(result);
        }
        const gCurrentR = this.accessCodeService.getGCurrentR(strReqOPKey);
        if (gCurrentR && Date.now() - gCurrentR.time < 3000) {
            result.data = { r: gCurrentR[strReqOPKey].r };
        }
        else {
            const ip = this.accessCodeService.getVpnIpIfNonProd(strRequestIP);
            const operator = await this.mainAppService.procChkOperator(strReqOPKey, ip);
            if (!operator) {
                result.result = 4001;
                result.msg = this.mainAppService.getResultMsg("-", result.result);
                return res.send(result);
            }
            const newR = await this.mainAppService.getR(operator.id);
            if (!newR) {
                result.result = 4001;
                result.msg = this.mainAppService.getResultMsg("-", result.result);
                return res.send(result);
            }
            result.data.r = newR;
            this.accessCodeService.setGCurrentR(strReqOPKey, {
                r: newR,
                time: Date.now(),
            });
        }
        result.msg = this.mainAppService.getResultMsg("-", result.result);
        return res.send(result);
    }
    async top30(req, res, query, a_nVersion = 0) {
        const result = {};
        result.result = result_code_1.SUCCESS;
        result.data = {
            list: [],
        };
        const strReqOPKey = query.opkey || null;
        const strReqHash = query.hash || null;
        if (!strReqOPKey || !strReqHash) {
            result.result = 100;
            result.msg = this.mainAppService.getResultMsg("-", result.result);
            return res.send(result);
        }
        if (!this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)) {
            result.result = 10000;
            result.msg = this.mainAppService.getResultMsg("-", result.result);
            return res.send(result);
        }
        result.msg = this.mainAppService.getResultMsg("-", result.result);
        return res.send(result);
    }
    async logGet(req, res, query, a_nVersion = 0) {
        const queryObj = query;
        const result = {};
        result.result = result_code_1.SUCCESS;
        result.data = {
            link: "",
        };
        const objCheckResult = await this.mainAppService.checkParams(req);
        const objResult = {
            result: objCheckResult.result,
            msg: this.mainAppService.getResultMsg("-", objCheckResult.result),
        };
        if (objResult.result !== result_code_1.SUCCESS) {
            return res.send(objResult);
        }
        if (!queryObj?.roundid) {
            result.result = result_code_1.FAILED;
            result.msg = this.mainAppService.getResultMsg("-", result.result);
            return res.send(result);
        }
        const logResult = await this.mainAppService.getBetLog(queryObj.opkey, queryObj.roundid);
        if (!logResult) {
            result.result = result_code_1.FAILED;
            result.msg = "존재하지 않는 round 입니다.";
            return res.send(result);
        }
        const gCpList = this.accessCodeService.getFullGCpList();
        let objCPData = gCpList?.list.find((x) => x.code == logResult.third_party_code);
        if (!objCPData || !objCPData?.view_url || objCPData?.view_url === "") {
            result.result = result_code_1.FAILED;
            result.msg = "지원하지 않습니다.";
            return res.send(result);
        }
        let strUserID = await this.accessCodeService.getUserIdByUserKey(logResult.user_key);
        if (!strUserID) {
            result.result = result_code_1.FAILED;
            result.msg = "존재하지 않는 user 입니다.";
            return res.send(result);
        }
        const logCallingRes = await this.mainAppService.logCalling(strUserID, objCPData, objCheckResult, logResult);
        if (!logCallingRes || logCallingRes.statusCode !== 200) {
            result.result = result_code_1.FAILED;
            result.msg = "로그 호출 실패";
            return res.send(result);
        }
        const objLogData = JSON.parse(logCallingRes.body);
        if (objLogData.result !== result_code_1.SUCCESS) {
            result.result = result_code_1.FAILED;
            result.msg = "게임사 요청 실패[1]";
            return res.send(result);
        }
        if (!objLogData.data.hasOwnProperty("game")) {
            result.data.link = objLogData.data.link;
            return res.send(result);
        }
        objLogData.user_id = strUserID;
        objLogData.opid = objCheckResult.data.operator.id;
        objLogData.cp_key = objCPData.key;
        objLogData.cp_name = objCPData.name;
        objLogData.game_code = logResult.game_code;
        const logViewResult = await this.mainAppService.logViewData(objLogData);
        if (!logViewResult || logViewResult.statusCode !== 200) {
            result.result = result_code_1.FAILED;
            result.msg = "게임사 요청 실패[3]";
            return res.send(result);
        }
        result.data.link = [
            config_local_1.Config.LOG_VIEW_SERVER_URL_GET,
            "?key=",
            logViewResult.body,
        ].join("");
        result.msg = this.mainAppService.getResultMsg("-", result.result);
        return res.send(result);
    }
};
exports.MainAppController = MainAppController;
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.getIp, api_path_1.default.mainApp.v2.getIp]),
    (0, swagger_1.ApiOperation)({
        summary: "get IP",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "getIp", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.hash, api_path_1.default.mainApp.v2.hash]),
    (0, swagger_1.ApiOperation)({
        summary: "hash",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, main_app_dto_1.HashDto]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "hash", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.account, api_path_1.default.mainApp.v2.account]),
    (0, swagger_1.ApiOperation)({
        summary: "account",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, main_app_dto_1.AccountDto]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "account", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.create_account, api_path_1.default.mainApp.v2.create_account]),
    (0, swagger_1.ApiOperation)({
        summary: "create_account",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, main_app_dto_1.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.provlist, api_path_1.default.mainApp.v2.provlist]),
    (0, swagger_1.ApiOperation)({
        summary: "provlist",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, main_app_dto_1.ProvlistDto]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "provlist", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.gamelist, api_path_1.default.mainApp.v2.gamelist]),
    (0, swagger_1.ApiOperation)({
        summary: "gamelist",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, main_app_dto_1.GamelistDto]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "gamelist", null);
__decorate([
    (0, common_1.Get)(api_path_1.default.mainApp.v2.gamelist_new),
    (0, swagger_1.ApiOperation)({
        summary: "gamelist_new",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, main_app_dto_1.GamelistDto]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "gamelist_new", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.Game.tablelist, api_path_1.default.mainApp.v2.Game.tablelist]),
    (0, swagger_1.ApiOperation)({
        summary: "tablelist",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "gameTablelist", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.play, api_path_1.default.mainApp.v2.play]),
    (0, swagger_1.ApiOperation)({
        summary: "play",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Number]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "play", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.current.r, api_path_1.default.mainApp.v2.current.r]),
    (0, swagger_1.ApiOperation)({
        summary: "current/r",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Number]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "currentR", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.hotgames.top30, api_path_1.default.mainApp.v2.hotgames.top30]),
    (0, swagger_1.ApiOperation)({
        summary: "hotgames/top30",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Number]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "top30", null);
__decorate([
    (0, common_1.Get)([api_path_1.default.mainApp.log.get, api_path_1.default.mainApp.v2.log.get]),
    (0, swagger_1.ApiOperation)({
        summary: "log/get",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Number]),
    __metadata("design:returntype", Promise)
], MainAppController.prototype, "logGet", null);
exports.MainAppController = MainAppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        main_app_service_1.MainAppService])
], MainAppController);
//# sourceMappingURL=main.app.controller.js.map