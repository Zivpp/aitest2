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
exports.MainAppService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const config_rc_msg_1 = require("./Config/config.rc.msg");
const g_queryString = require("querystring");
const crypto = require("crypto");
const main_app_dao_1 = require("./main.app.dao");
const config_1 = require("../../Config/config");
const result_code_1 = require("../../Config/result.code");
const _ = require("lodash");
const CryptoJS = require("crypto-js");
const _md5 = (s) => crypto.createHash("md5").update(s, "utf8").digest("hex").toUpperCase();
let MainAppService = class MainAppService {
    accessCodeService;
    mainAppDao;
    apiService;
    constructor(accessCodeService, mainAppDao, apiService) {
        this.accessCodeService = accessCodeService;
        this.mainAppDao = mainAppDao;
        this.apiService = apiService;
    }
    async test(any) {
        const result = await this.getTransferBalance("1300", "50ff6f7d8dc2afe414d778ca0fc0cc39", "2720", "a7r_evol_test_01");
        return result;
    }
    getResultMsg(key, code) {
        return config_rc_msg_1.rc_msg[key]?.[code] ?? "실패했습니다";
    }
    checkQueryString(a_strOPKey, a_query, a_strHash) {
        const strQueryStringHash = this.getMd5Hash(a_strOPKey, a_query);
        const strQueryStringEncHash = this.getMd5EncHash(a_strOPKey, a_query);
        return (strQueryStringHash === a_strHash || strQueryStringEncHash === a_strHash);
    }
    getMd5Hash(opKey, queryStr) {
        delete queryStr["hash"];
        const strQueryString = g_queryString.stringify(queryStr, undefined, undefined, { encodeURIComponent: (s) => s });
        const strQueryStringHash = _md5(opKey + "|" + strQueryString);
        console.log("[getMd5Hash] strQueryStringHash = ", strQueryStringHash);
        return strQueryStringHash;
    }
    getMd5EncHash(opKey, queryStr) {
        delete queryStr["hash"];
        const strQueryStringEnc = g_queryString.stringify(queryStr);
        const strQueryStringEncHash = _md5(opKey + "|" + strQueryStringEnc);
        console.log("[getMd5EncHash] strQueryStringEncHash = ", strQueryStringEncHash);
        return strQueryStringEncHash;
    }
    async getOperatorInfo(a_strOPKey, a_strIP) {
        const result = await this.mainAppDao.getOperatorInfo(a_strOPKey, a_strIP);
        return result;
    }
    async findUserByOperatorAndUserIdOrg(opId, a_strUserID) {
        console.info("[getUserInfo][opId] = ", opId);
        console.info("[getUserInfo][a_strUserID] = ", a_strUserID);
        const userInfo = await this.mainAppDao.getUserByOpIdAndUserIdOrg(opId, a_strUserID);
        return userInfo;
    }
    async createUser(opId, a_strUserID, reqCxUser, a_nVersion) {
        if (!reqCxUser?.user_nick_org) {
            return null;
        }
        const opStr = this.accessCodeService.getOperatorCode(Number(opId));
        const strCreateUserID = this.accessCodeService.getUserOPID(opStr, a_strUserID);
        const strCreateUserNick = this.accessCodeService.getUserOPID(opStr, reqCxUser.user_nick_org);
        const insertUserObj = {
            user_key: 0,
            user_id: strCreateUserID,
            user_id_org: a_strUserID,
            user_name: a_strUserID,
            user_nick: strCreateUserNick,
            user_nick_org: reqCxUser.user_nick_org,
            op_id: Number(opId),
            cash: 0,
            betskin: 0,
            user_status: 1,
        };
        let insertResult;
        try {
            insertResult = await this.mainAppDao.insertUser(insertUserObj);
        }
        catch (error) {
            console.error("[insertUser] error = ", error);
            return null;
        }
        const newUser = {};
        newUser.version = a_nVersion;
        newUser.user_key = insertResult?.insertId;
        newUser.user_id = strCreateUserID;
        newUser.user_id_org = a_strUserID;
        newUser.user_name = strCreateUserID;
        newUser.user_nick = strCreateUserNick;
        newUser.user_nick_org = reqCxUser.user_nick_org;
        newUser.op_id = Number(opId);
        switch (a_nVersion) {
            case 2:
                const opCode = this.accessCodeService.getOperatorCode(newUser.op_id);
                const _LEG = config_1.Config.MAX_USER_ID_BODY_LEN;
                const userKeyStr = newUser.user_key.toString().padStart(_LEG, "0");
                const strCreateUserID = [opCode, userKeyStr].join("");
                const updateResult = await this.mainAppDao.updateUserIdByKey("cx_user", { user_id: strCreateUserID }, "user_key = ?", { user_key: newUser.user_key });
                newUser.user_id = strCreateUserID;
                break;
            default:
                break;
        }
        return newUser;
    }
    async getCPList() {
        return this.mainAppDao.getCPList();
    }
    async getGameListTableType(cpkey, version) {
        const objData = await this.mainAppDao.getGameList(Number(cpkey), version);
        if (objData.list?.length && objData.list[0].type === config_1.Config.GAMECODE.LIVE) {
            const tableMap = new Map();
            for (const game of objData.list) {
                const tableType = game.table?.type ?? "unknown";
                if (!tableMap.has(tableType)) {
                    tableMap.set(tableType, []);
                }
                tableMap.get(tableType).push(game);
            }
            objData.table = {
                table_type: Array.from(tableMap.keys()),
                list: Object.fromEntries(tableMap),
            };
        }
        return objData;
    }
    async getGameList(cpkey, version) {
        const gameListObj = await this.mainAppDao.getGameList(Number(cpkey), version);
        return gameListObj;
    }
    async checkParams(req) {
        const result = {
            result: result_code_1.SUCCESS,
            data: { user: {}, params: {}, operator: { id: 0 } },
        };
        const params = req.query;
        result.data.params = params;
        let strUrl = req.path;
        if (strUrl[strUrl.length - 1] != "/")
            strUrl += "/";
        if (!config_1.Config.TABLE_LIST_WHITE_LIST.hasOwnProperty(strUrl)) {
            result.result = 102;
            return result;
        }
        if (!params.opkey || !params.hash) {
            result.result = 100;
            return result;
        }
        const paramCheckKeys = config_1.Config.TABLE_LIST_WHITE_LIST[strUrl] ?? [];
        for (const key of paramCheckKeys) {
            const value = params[key];
            if (value === undefined || value === null || value === "") {
                result.result = 100;
                return result;
            }
        }
        if (params.opkey.length !== config_1.Config.MAX_UUID_SIZE) {
            result.result = 101;
            return result;
        }
        if (req.method !== "POST" &&
            !this.checkQueryString(params.opkey, req.query, params.hash)) {
            result.result = 10000;
            return result;
        }
        const cOperator = _.isNull(config_1.Config.MANAGER_IP.find((x) => x === req.ip))
            ? await this.mainAppDao.getTblOperatorByUuid(params.opkey)
            : await this.mainAppDao.procChkOperator(params.opkey, req.ip);
        if (!cOperator) {
            result.result = 1;
            return result;
        }
        result.data.operator = cOperator;
        if (params.user_id) {
            const cxUser = await this.mainAppDao.getUserByOpIdAndUserIdOrg(cOperator?.id.toString(), params.user_id);
            if (!cxUser)
                result.result = 10001;
            result.data.user = cxUser ?? {};
        }
        return result;
    }
    async procChkOperator(opkey, ip) {
        return await this.mainAppDao.procChkOperator(opkey, ip);
    }
    async getTransferBalance(opId, opKey, userKey, userId) {
        const url = config_1.Config.TRANSFER_SERVER_URL + "balance";
        const result = await this.apiService.post(url, {
            op_id: opId,
            op_key: opKey,
            user_key: userKey,
            user_id: userId,
        });
        if (result.result === 0) {
            return { result: 20010 };
        }
        return result;
    }
    async getGameMTCode(strThirdPartyCode, strGameCode) {
        return await this.mainAppDao.getGameMTCode(strThirdPartyCode, strGameCode);
    }
    async checkGamePermit(a_nOPID, a_nGameCPKey, a_strGameCode) {
        return await this.mainAppDao.checkGamePermit(a_nOPID, a_nGameCPKey, a_strGameCode);
    }
    async decodeSiteUrlOrDefault(strSiteUrl) {
        if (strSiteUrl != null) {
            try {
                strSiteUrl = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(strSiteUrl));
            }
            catch (a_err) {
                console.log(a_err);
            }
        }
        else
            strSiteUrl = config_1.Config.PUBLIC_URL.EXIT;
        return strSiteUrl;
    }
    async loadOperatorData(oId, oName) {
        const objOPDate = this.accessCodeService.getGOpListItem(oName);
        if (!objOPDate)
            this.accessCodeService.addGOpListItem(oName, oId.toString());
        if (Date.now() - objOPDate.times < config_1.Config.OPERATOR_LOAD_TTL_MS)
            return objOPDate;
        objOPDate.times = Date.now();
        const strTree = await this.mainAppDao.getOperatorTree(oId);
        console.log("strTree >>>>", strTree);
        if (!strTree)
            return null;
        const aTree = strTree
            .split(",")
            .filter((s) => s !== "")
            .reverse();
        const aSplash = await this.mainAppDao.getOperatorSplashInfo(aTree);
        if (!aSplash)
            return null;
        for (const node of aTree) {
            if (node === config_1.Config.SPLASH_DEF_NAME) {
                objOPDate.splash = {
                    is_use: true,
                    data: this.accessCodeService.getGOpSplash(),
                };
                break;
            }
            const objOperatorSplashInfo = aSplash.find((x) => x.op_name === node);
            const nUse = objOperatorSplashInfo?.use_splash ?? 0;
            if (nUse === 1) {
                const objSplashData = await this.getOperatorSplashList_name(node);
                console.info("objSplashData >>>>>", objSplashData);
                if (objSplashData) {
                    objOPDate.splash = { is_use: true, data: objSplashData };
                }
            }
            break;
        }
        return objOPDate;
    }
    async getOperatorSplashList_name(name) {
        const row = await this.mainAppDao.getOperatorSplashList_name(name);
        if (!row)
            return null;
        const result = {
            name: row.splash_name,
            url: row.splash_url,
            css: {
                bg_color: row.css_bg_color,
                img_size: row.css_img_size,
            },
        };
        return result;
    }
    async UseSplashProcess(cOperator, objPlayData, cUser) {
        const objPlayResult = { result: result_code_1.SUCCESS, data: { token: "", link: "" } };
        const objOperatorData = await this.loadOperatorData(cOperator.id.toString(), cOperator.name);
        console.log(objOperatorData);
        if (objOperatorData.splash && objOperatorData.splash.is_use) {
            objPlayData.splash = objOperatorData.splash;
        }
        const strPlayData = JSON.stringify(objPlayData);
        const strPlayToken = _md5([strPlayData, cUser.sign].join(""));
        const url = [config_1.Config.SPLASH_PLAY_API_URL, config_1.Config.ENC_KEY].join("");
        const body = { json: { session: strPlayToken, data: objPlayData } };
        const result = await this.apiService.post(url, body);
        objPlayResult.result = result_code_1.SUCCESS;
        objPlayResult.data.token = cUser.sign ?? "";
        objPlayResult.data.link = [config_1.Config.SPLASH_PLAY_API_URL, result.session].join("");
        return objPlayResult;
    }
    async loadOperatorGameInfo(oId) {
        const cOpGameInfo = await this.mainAppDao.getOpratorGameInfo(oId);
        if (cOpGameInfo)
            this.accessCodeService.setGOperatorGameInfo(oId, cOpGameInfo);
        return;
    }
    async NoUseSplashProcess(operator, objPlayData, cUser) {
        await this.loadOperatorGameInfo(operator.id);
        const url = config_1.Config.Play_API_URL;
        const body = { json: objPlayData };
        const result = await this.apiService.post(url, body);
        return result;
    }
    async getR(opId) {
        return await this.mainAppDao.getR(opId);
    }
    async getBetLog(opkey, roundid) {
        return await this.mainAppDao.getBetLog(opkey, roundid);
    }
    async logCalling(strUserID, objCPData, objCheckResult, logResult) {
        const strUserIDSlice = strUserID.slice(config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH + 1);
        let strUrl = [
            objCPData.view_url,
            "?opid=",
            objCheckResult.data.operator.id,
            "&id=",
            strUserIDSlice,
            "&key=",
            logResult.user_key,
            "&game_code=",
            logResult.game_code,
            "&roundid=",
            logResult.third_party_round_id,
            "&transid=",
            logResult.third_party_trans_id,
            "&times=",
            logResult.times,
        ].join("");
        return await this.apiService.get(strUrl);
    }
    async logViewData(objLogData) {
        return await this.apiService.post(config_1.Config.LOG_VIEW_API_URL.GET, {
            from: objLogData,
        });
    }
    async getNewGameList() {
        const list = await this.mainAppDao.getNewGameList();
        let aList = [];
        if (!list)
            return aList;
        for (const item of list) {
            aList.push({
                id: item.game_id,
                code: item.game_code,
                name_eng: item.game_name_eng,
                name_kor: item.game_name_kor,
                type: item.game_type,
                is_desktop: item.is_desktop,
                is_mobile: item.is_mobile,
                img_1: item.img_1 || "",
                date: item.game_reg_date,
            });
        }
        return { list: aList };
    }
};
exports.MainAppService = MainAppService;
exports.MainAppService = MainAppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        main_app_dao_1.MainAppDao,
        api_service_1.ApiService])
], MainAppService);
//# sourceMappingURL=main.app.service.js.map