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
exports.AccessCodeService = void 0;
const redis_service_1 = require("../../Infrastructure/Redis/redis.service");
const config_1 = require("../../Config/config");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const _ = require("lodash");
const access_code_enum_1 = require("./Enum/access.code.enum");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const access_code_dao_1 = require("./access.code.dao");
let AccessCodeService = class AccessCodeService {
    redisService;
    apiService;
    accessCodeDao;
    constructor(redisService, apiService, accessCodeDao) {
        this.redisService = redisService;
        this.apiService = apiService;
        this.accessCodeDao = accessCodeDao;
    }
    g_tokenList = [];
    g_tables = {};
    g_slot = {
        data: [],
    };
    g_userStatusList = {};
    g_cp_list = {
        list: [],
        times: 0,
    };
    g_op_list = {};
    g_operator_gameinfo = [];
    g_current_r = {};
    setGCurrentR(key, objCurrentR) {
        this.g_current_r[key] = objCurrentR;
    }
    getGCurrentR(key) {
        return this.g_current_r[key];
    }
    setGOperatorGameInfo(index, objOperatorGameInfo) {
        this.g_operator_gameinfo[index] = objOperatorGameInfo;
    }
    getGOperatorGameInfo(index) {
        return this.g_operator_gameinfo[index];
    }
    setGOpSplash(objSplashData) {
        this.g_op_list.splash = objSplashData;
    }
    getGOpSplash() {
        return this.g_op_list?.splash ?? null;
    }
    addGOpListItem(a_strOPName, op_id, tree_data = [], times = 0) {
        this.g_op_list[a_strOPName] = { op_id, tree_data, times, splash: null };
    }
    getGOpListItem(a_strOPName) {
        return this.g_op_list[a_strOPName] ?? null;
    }
    removeGOpListItem(a_strOPName) {
        delete this.g_op_list[a_strOPName];
    }
    setGCpList(list) {
        this.g_cp_list.list = list;
        this.g_cp_list.times = Date.now();
    }
    getGCpList() {
        return this.g_cp_list.list;
    }
    getFullGCpList() {
        return this.g_cp_list;
    }
    getReqIP(req) {
        return (req.headers["cf-connecting-ip"] ||
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.socket?.remoteAddress ||
            req.connection?.remoteAddress ||
            "");
    }
    async addUserObj(a_key, a_nGameCPKey, userTokenObj) {
        userTokenObj.update_time = Date.now();
        const strSessionKey = ["s", a_nGameCPKey, a_key].join("_");
        const result = await this.redisService.set(strSessionKey, JSON.stringify(userTokenObj), config_1.Config.REDIS.TRANSDATA_KEEP_SEC);
        return result;
    }
    async addToken_sign(a_token, a_nGameCPKey) {
        if (_.isNull(a_token))
            return;
        a_token.update_time = Date.now();
        this.g_tokenList[a_token.token.sign] = a_token;
        const strSessionKey = ["s", a_nGameCPKey, a_token.token.sg].join("_");
        await this.redisService.set(strSessionKey, JSON.stringify(a_token.token), config_1.Config.REDIS.TRANSDATA_KEEP_SEC);
    }
    async getUserObj(a_key, a_nGameCPKey) {
        let result;
        if (_.isNull(result) || _.isUndefined(result)) {
            const strSessionKey = ["s", a_nGameCPKey, a_key].join("_");
            console.log("[除錯使用] strSessionKey >>>", strSessionKey);
            const redisResponse = await this.redisService.get(strSessionKey);
            result = redisResponse ? JSON.parse(redisResponse) : null;
        }
        return result;
    }
    inValidToken(userObj) {
        if (_.isNil(userObj) || _.isEmpty(userObj)) {
            return true;
        }
        const requiredKeys = ["key", "id", "op", "dt"];
        if (requiredKeys.some((k) => !userObj.hasOwnProperty(k))) {
            return true;
        }
        return false;
    }
    getUserOPID(a_strOPKeyCode, a_strUserID) {
        return [a_strOPKeyCode, a_strUserID].join("_");
    }
    getOperatorCode(a_nOPID) {
        if (a_nOPID < 1000) {
            const _LEG = config_1.Config.MAX_OPERATOR_KEY_CODE_LENGTH;
            return a_nOPID.toString().padStart(Number(_LEG), "0");
        }
        else {
            const _LEG = config_1.Config.MAX_OPERATOR_KEY_ADD_VALUE;
            return (Number(a_nOPID) + Number(_LEG)).toString(36);
        }
    }
    getThirdparty(cCode) {
        const result = config_1.Config.EVOLUTION_GROUP.vendors[cCode];
        if (!result) {
            console.info(`[getThirdparty] Unknown vendor code: ${cCode}`);
            return null;
        }
        return result;
    }
    getFullTableInfoList() {
        return this.g_tables;
    }
    getTableInfo(cCode, tableId) {
        return this.g_tables?.[cCode]?.data?.[tableId] ?? null;
    }
    getTableList(cCode) {
        return this.g_tables?.[cCode]?.data ?? null;
    }
    initTableList(cCode) {
        this.g_tables[cCode] = {
            times: Date.now(),
            data: [],
        };
    }
    updateTableList(cpKey, data) {
        if (!this.g_tables[cpKey]) {
            this.initTableList(cpKey);
        }
        this.g_tables[cpKey].times = Date.now();
        this.g_tables[cpKey].data = data;
    }
    clearTableList(cpKey) {
        delete this.g_tables[cpKey];
    }
    getFullGameCPKey() {
        return this.g_slot;
    }
    getGameCPKey(cpKey) {
        const item = this.g_slot.data.find((item) => item.game_cp_key === cpKey);
        return item?.game_cp_key ?? 0;
    }
    setGSlot(data) {
        this.g_slot.data = data;
    }
    getGUserStatus(userId) {
        return this.g_userStatusList[userId];
    }
    setGUserStatus(userId, data) {
        this.g_userStatusList[userId] = data;
    }
    removeGUserStatus(userId) {
        delete this.g_userStatusList[userId];
    }
    getAllGUserStatus() {
        return { ...this.g_userStatusList };
    }
    clearGUserStatus() {
        this.g_userStatusList = {};
    }
    setUserBalance(a_nUserKey, a_fBalance) {
        this.g_userStatusList[a_nUserKey] = {
            balance: { value: a_fBalance, version: Date.now() },
        };
        return this.g_userStatusList[a_nUserKey];
    }
    buildProcessRequest(params) {
        const { body, callbackType, objUser, objThirdParty, objData, lang = access_code_enum_1.Lang.ko, } = params;
        return {
            callback_type: callbackType,
            lang,
            obj_third_party: objThirdParty,
            obj_user: objUser,
            obj_data: objData,
            trace_id: (0, uuid_1.v4)(),
        };
    }
    getNullObjThirdparty() {
        return {
            cp_key: 0,
            name: "",
            degit: 0,
            game_type: "",
            bet_limit_def: "",
            trans_stored: {
                round: 0,
                bet_trans: 0,
                result_trans: 0,
                tip_trans: 0,
                withdraw_trans: 0,
                deposit_trans: 0,
            },
            req_call_timeout: 0,
        };
    }
    attachStating(list) {
        list["starburst0000000"] = {
            name: "starburst0000000 test",
            type: "starburst",
            sign: {},
        };
        list["uwd2bl2khwcikjlz"] = {
            name: "uwd2bl2khwcikjlz test",
            type: "blackjack",
            sign: {},
        };
        list["Craps00000000001"] = {
            name: "Craps00000000001 test",
            type: "craps",
            sign: {},
        };
        list["k37tle5hfceqacik"] = {
            name: "k37tle5hfceqacik test",
            type: "roulette",
            sign: { 1: "m425yugkxfbaad56" },
        };
        list["vctlz20yfnmp1ylr"] = {
            name: "vctlz20yfnmp1ylr test",
            type: "roulette",
            sign: {},
        };
        list["starburst0000000"] = {
            name: "starburst0000000 test",
            type: "starburst",
            sign: {},
        };
        list["10001nights00000"] = {
            name: "10001nights00000 test",
            type: "10001nights",
            sign: {},
        };
    }
    async loadTableListByCPKey(cpKey) {
        if (!cpKey)
            return;
        const url = [
            config_1.Config.SP_SERVER_URL.GAMECODE,
            `game/codelist/get?prod=`,
            config_1.Config.APP_ENV === "PROD" ? "1" : "0",
            "&cpkey=",
            cpKey.toString(),
        ].join("");
        const apiResObj = await this.apiService.api("get", url, {}, {});
        if (apiResObj && apiResObj.list) {
            if (process.env.APP_ENV === "staging" || process.env.APP_ENV === "local")
                this.attachStating(apiResObj.list);
            this.updateTableList(cpKey.toString(), apiResObj.list);
        }
        else {
        }
    }
    async getTableListByCPKey(cpKey) {
        let result;
        if (!cpKey)
            return;
        const url = [
            config_1.Config.SP_SERVER_URL.GAMECODE,
            `game/codelist/get?prod=`,
            config_1.Config.APP_ENV === "PROD" ? "1" : "0",
            "&cpkey=",
            cpKey.toString(),
        ].join("");
        const apiResObj = await this.apiService.api("get", url, {}, {});
        if (apiResObj && apiResObj.list)
            result = apiResObj.list;
        return result;
    }
    getTraceCode() {
        return [this.numberPad((Date.now() % 1000) + 1, 4), (0, uuid_1.v4)()].join("-");
    }
    numberPad(a_nValue, a_nWidth) {
        let strValue = Math.pow(10, a_nWidth) + a_nValue;
        return strValue.toString().substr(1);
    }
    getVersionFromUrl(a_strUrl) {
        let nFind = a_strUrl.indexOf("/v");
        if (nFind != -1) {
            let nVer = parseInt(a_strUrl.substr(nFind + 2, 1));
            if (isNaN(nVer))
                return 1;
            else
                return nVer;
        }
        else
            return 1;
    }
    async LoadGameCPList(a_bUseViewUrl) {
        const listData = await this.accessCodeDao.getDataGameList(a_bUseViewUrl);
        this.setGCpList(listData ?? []);
    }
    async getDefSplashList(splashDefName) {
        const row = await this.accessCodeDao.getDefSplashList(splashDefName);
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
    getVpnIpIfNonProd(ip) {
        const _strlocal = "local";
        if (process.env.APP_ENV === _strlocal) {
            return config_1.Config.VPN_IP;
        }
        return ip;
    }
    getUserInfo(userId) {
        return this.accessCodeDao.getUserInfoByUserId(userId);
    }
    convertGrpcErrorStatusToText(provider, code) {
        return config_1.Config.GRPC_RES_STATUS_MAP[provider][code] || access_code_enum_1.Status.UNKNOWN_ERROR;
    }
    getUserIdByUserKey(userKey) {
        return this.accessCodeDao.getUserIdByUserKey(userKey);
    }
};
exports.AccessCodeService = AccessCodeService;
exports.AccessCodeService = AccessCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        api_service_1.ApiService,
        access_code_dao_1.AccessCodeDao])
], AccessCodeService);
//# sourceMappingURL=access.code.service.js.map