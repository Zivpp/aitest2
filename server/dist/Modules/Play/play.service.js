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
exports.PlayService = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const g_queryString = require("querystring");
const crypto = require("crypto");
const config_1 = require("../../Config/config");
const play_dao_1 = require("./play.dao");
const api_service_1 = require("../../Infrastructure/Api/api.service");
const result_code_1 = require("../../Config/result.code");
const md5 = (s) => crypto.createHash("md5").update(s, "utf8").digest("hex").toUpperCase();
let PlayService = class PlayService {
    accessCodeService;
    apiService;
    playDao;
    constructor(accessCodeService, apiService, playDao) {
        this.accessCodeService = accessCodeService;
        this.apiService = apiService;
        this.playDao = playDao;
    }
    async loadOperatorGameInfo(opId) {
        const operator = await this.playDao.getOperatorGameInfo(opId);
        if (!operator)
            return null;
        const cOperatorGameInfo = {};
        cOperatorGameInfo.op_id = opId;
        cOperatorGameInfo.op_name = operator.operator_id;
        cOperatorGameInfo.op_key = operator.operator_uuid;
        cOperatorGameInfo.wallet = operator.wallet_type;
        cOperatorGameInfo.urls.member_check = operator.callback_member;
        cOperatorGameInfo.urls.balance = operator.callback_balance;
        cOperatorGameInfo.urls.bet = operator.callback_bet;
        cOperatorGameInfo.urls.result = operator.callback_result;
        cOperatorGameInfo.urls.cancel = operator.callback_cancel;
        cOperatorGameInfo.urls.tip = operator.callback_tip;
        cOperatorGameInfo.load_time = Date.now();
        this.accessCodeService.setGOperatorGameInfo(opId, cOperatorGameInfo);
        return cOperatorGameInfo;
    }
    getBetLimitType(a_objThirdparty, a_strBetLimitType) {
        if (!a_objThirdparty?.hasOwnProperty("BET_LIMIT"))
            return config_1.Config.BET_LIMIT_DEF;
        if (a_strBetLimitType === null)
            return a_objThirdparty.BET_LIMIT_DEF;
        const strBetLimitType = a_objThirdparty.BET_LIMIT.hasOwnProperty(a_strBetLimitType)
            ? a_objThirdparty.BET_LIMIT[a_strBetLimitType]
            : a_objThirdparty.BET_LIMIT_DEF;
        return strBetLimitType;
    }
    async getEvolutionStartUrl(a_webRes, a_cOperator, a_cUser, a_strGameID, a_strPlatform, a_nGameCpKey, a_strUserAgent, a_strSiteUrl, a_strBetLimitType, a_strLanaguage, a_strCurrency) {
        const objThirdparty = config_1.Config.EVOLUTION_GROUP.VENDORS[a_nGameCpKey];
        const strLanaguage = a_strLanaguage || objThirdparty.LANGUAGE_DEF;
        const objCPAccount = await this.playDao.getCPAccount(a_cOperator.name, config_1.Game.Evolution.cp_key);
        const strRequestUrl = objCPAccount
            ? [
                config_1.Config.EVOLUTION_GROUP.URL,
                "ua/v1/",
                objCPAccount.account,
                "/",
                objCPAccount.password,
            ].join("")
            : [
                config_1.Config.EVOLUTION_GROUP.URL,
                "ua/v1/",
                config_1.Config.EVOLUTION_GROUP.KEY,
                "/",
                config_1.Config.EVOLUTION_GROUP.API_TOKEN,
            ].join("");
        let objParam = {
            uuid: md5(a_cUser.token),
            player: {
                id: a_cUser.user_id,
                update: false,
                firstName: a_cUser.user_id,
                lastName: this.accessCodeService.getOperatorCode(a_cOperator.id),
                nickname: a_cUser.user_nick,
                country: config_1.Config.COUNTRY_A2,
                language: a_nGameCpKey == config_1.Game.NextSpin.cp_key ? "en" : strLanaguage,
                currency: config_1.Config.CURRENCY.DEF,
                session: { id: a_cUser.sign, ip: a_cUser.connect_ip },
            },
            config: {
                brand: { id: a_cOperator.name, skin: "1" },
                game: { category: a_strGameID, interface: "", table: { id: "" } },
                channel: { wrapped: false, mobile: false },
            },
        };
        if (a_nGameCpKey !== config_1.Game.Evolution.cp_key) {
            objParam.config.game.category = "slots";
            objParam.config.game.interface = "view1";
            objParam.config.game.table = { id: a_strGameID };
        }
        else {
            objParam.config.brand.skin = this.getBetLimitType(config_1.Config.Evolution, a_strBetLimitType);
            if (a_strGameID.length === 16)
                objParam.config.game.table = { id: a_strGameID };
        }
        console.log("strRequestUrl >>>", strRequestUrl);
        console.log("objParam >>>", JSON.stringify(objParam));
        const res = await this.apiService.post(strRequestUrl, objParam);
        if (res.status != 200) {
            console.log("# Evolution Start Error : ", res);
            console.log(strRequestUrl);
            console.log(objParam);
            return { result: 20001, error: { code: 0, msg: "" } };
        }
        return {
            result: result_code_1.SUCCESS,
            link: [
                config_1.Config.EVOLUTION_GROUP.URL,
                res?.entry?.toString().substr(1, res?.entry?.length),
            ].join(""),
        };
    }
    async getCQ9hStartUrl() { }
    async getPPSeamlessStartUrl() { }
    async getPPTransferStartUrl() { }
    async getDGStartUrl() { }
    async getBNGStartUrl(a_webRes, a_cOperator, a_cUser, a_strGameID, a_strPlatform) {
        const objParams = {
            token: a_cUser.sign,
            ts: Math.floor(Date.now() / 1000),
            platform: a_strPlatform == config_1.Config.DEVICE.pc ? "desktop" : "mobile",
            wl: config_1.Config.BNG_GROUP.BRAND,
            lang: config_1.Config.LANGUAGE_DEF,
            tz: config_1.Config.TIME_ZONE,
            game: "",
        };
        let strRequestUrl = "";
        if (a_strGameID != config_1.Config.BNG_GROUP.LOBBY_GAMECODE) {
            strRequestUrl = [
                config_1.Config.BNG_GROUP.URL,
                config_1.Config.BNG_GROUP.PID,
                "/game.html",
            ].join("");
            objParams.game = a_strGameID;
        }
        else {
            strRequestUrl = [
                config_1.Config.BNG_GROUP.URL_LOBBY,
                config_1.Config.BNG_GROUP.PID,
                "/games/",
            ].join("");
        }
        return {
            result: result_code_1.SUCCESS,
            link: [strRequestUrl, "?", g_queryString.stringify(objParams)].join(""),
        };
    }
    async getPlayStarStartUrl() { }
    async getWMLiveStartUrl() { }
    async getTGstartUrl() { }
    async getAGStartUrl() { }
    async getHabaneroStartUrl() { }
    async getSportsStartUrl() { }
    async getPGStartUrl() { }
    async getMOAhStartUrl() { }
    async getTaishanStartUrl() { }
    async getDowinStartUrl() { }
    async getMGPStartUrl() { }
    async getKDStartUrl() { }
    async getDCStartUrl() { }
    async getVivoStartUrl() { }
    async getPlayTechStartUrl() { }
    async getBTiStartUrl() { }
    async getAStarStartUrl() { }
    async getAWCStartUrl() { }
    async getFCStartUrl() { }
    async getJDBStartUrl() { }
    async getDBCasinoStartUrl() { }
    async getHiddenPokerStartUrl() { }
    async getBGStartUrl() { }
    async getHRGStartUrl() { }
    async getSCStartUrl() { }
    async getSBStartUrl() { }
    async getSAStartUrl() { }
    async getCLPStartUrl() { }
    async sendToCallbackServer(url, body) {
        const res = await this.apiService.post(url, body);
        if (res.status != 200)
            return res;
        return { result: 20010, error: { code: 0, msg: "" } };
    }
    async getStartUrl(cp, cOperator) {
        let result = {};
        switch (cp) {
            case config_1.Game.Evolution.cp_key:
            case config_1.Game.NetEnt.cp_key:
            case config_1.Game.RedTiger.cp_key:
            case config_1.Game.NoLimitCity.cp_key:
            case config_1.Game.BTG.cp_key:
                result.funcStartUrl = this.getEvolutionStartUrl.bind(this);
                result.strSendDataToCallbackServerUrl = config_1.Config.EVOLUTION_GROUP.CALL_URL;
                break;
            case config_1.Game.CQ9.cp_key:
            case config_1.Game.CQ9_LIVE.cp_key:
            case config_1.Game.CQ9_LIVE_MOTIVATION.cp_key:
                result.funcStartUrl = this.getCQ9hStartUrl.bind(this);
                result.strSendDataToCallbackServerUrl = config_1.Game.CQ9_GROUP.CALL_URL;
                break;
            case config_1.Game.PP.cp_key:
            case config_1.Game.PP_LIVE.cp_key:
            case config_1.Game.PP_REELKINGDOM.cp_key:
            case config_1.Game.PP_FATPANDA.cp_key:
                result.funcStartUrl = this.getPPSeamlessStartUrl.bind(this);
                if (this.getOperatorGameServiceIndex(cOperator) == 1)
                    result.strSendDataToCallbackServerUrl = config_1.Config.Game.PP_2.CALL_URL;
                else if (this.getOperatorGameServiceIndex(cOperator) == 101)
                    result.strSendDataToCallbackServerUrl = config_1.Config.Game.PP_101.CALL_URL;
                else
                    result.strSendDataToCallbackServerUrl = config_1.Config.Game.PP.CALL_URL;
                break;
            case config_1.Game.PP_BT.cp_key:
                result.funcStartUrl = this.getPPTransferStartUrl.bind(this);
                break;
            case config_1.Game.DG.cp_key:
                result.funcStartUrl = this.getDGStartUrl.bind(this);
                result.strSendDataToCallbackServerUrl = config_1.Game.DG.CALL_URL;
                break;
            case config_1.Game.BNG.cp_key:
            case config_1.Game.BNG_PLAYSON.cp_key:
                result.funcStartUrl = this.getBNGStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Config.BNG_GROUP.CALL_URL;
                break;
            case config_1.Game.PlayStar.cp_key:
                result.funcStartUrl = this.getPlayStarStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.DG.CALL_URL;
                break;
            case config_1.Game.WM_LIVE.cp_key:
                result.funcStartUrl = this.getWMLiveStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.WM_LIVE.CALL_URL;
                break;
            case config_1.Game.TG.cp_key:
                result.funcStartUrl = this.getTGstartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.TG.CALL_URL;
                break;
            case config_1.Game.AG.cp_key:
            case config_1.Game.AG_SLOT.cp_key:
                result.funcStartUrl = this.getAGStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.AG_GROUP.CALL_URL;
                break;
            case config_1.Game.Habanero.cp_key:
                result.funcStartUrl = this.getHabaneroStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.Habanero.CALL_URL;
                break;
            case config_1.Game.Sports.cp_key:
                result.funcStartUrl = this.getSportsStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.Sports.CALL_URL;
                break;
            case config_1.Game.PG.cp_key:
                result.funcStartUrl = this.getPGStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.Sports.CALL_URL;
                break;
            case config_1.Game.MOA_WAZDAN.cp_key:
            case config_1.Game.MOA_TRIPLEPG.cp_key:
            case config_1.Game.MOA_GAMEART.cp_key:
            case config_1.Game.MOA_MOBILOTS.cp_key:
            case config_1.Game.MOA_PLAYPEARLS.cp_key:
            case config_1.Game.MOA_DRAGOONSOFT.cp_key:
            case config_1.Game.MOA_BETGAMESTV.cp_key:
            case config_1.Game.MOA_SKYWINDLIVE.cp_key:
            case config_1.Game.MOA_1X2.cp_key:
            case config_1.Game.MOA_ELK.cp_key:
            case config_1.Game.MOA_VIVO.cp_key:
            case config_1.Game.MOA_SKYWINDCASINO.cp_key:
            case config_1.Game.MOA_ONLYPLAY.cp_key:
                result.funcStartUrl = this.getMOAhStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.MOA_GROUP.CALL_URL;
                break;
            case config_1.Game.Taishan.cp_key:
                result.funcStartUrl = this.getTaishanStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.Taishan.CALL_URL;
                break;
            case config_1.Game.Dowin.cp_key:
                result.funcStartUrl = this.getDowinStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.Dowin.CALL_URL;
                break;
            case config_1.Game.MGP.cp_key:
            case config_1.Game.MGP_GRAND.cp_key:
            case config_1.Game.MGP_SLOT.cp_key:
                result.funcStartUrl = this.getMGPStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.MGP_GROUP.CALL_URL;
                break;
            case config_1.Game.KD.cp_key:
                result.funcStartUrl = this.getKDStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.KD.CALL_URL;
                break;
            case config_1.Game.DC_EVOPLAY.cp_key:
            case config_1.Game.DC_YGG.cp_key:
            case config_1.Game.DC_PNG.cp_key:
            case config_1.Game.DC_RELAX.cp_key:
            case config_1.Game.DC_AVATARUX.cp_key:
            case config_1.Game.DC_HACKSAW.cp_key:
            case config_1.Game.DC_OCTOPLAY.cp_key:
            case config_1.Game.DC_NOVOMATIC.cp_key:
            case config_1.Game.DC_BGAMING.cp_key:
            case config_1.Game.DC_BLUEPRINT.cp_key:
            case config_1.Game.DC_THUNDERKICK.cp_key:
                result.funcStartUrl = this.getDCStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.DC_GROUP.CALL_URL;
                break;
            case config_1.Game.VIVO.cp_key:
                result.funcStartUrl = this.getVivoStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.VIVO.CALL_URL;
                break;
            case config_1.Game.PlayTech.cp_key:
            case config_1.Game.PlayTech_slot.cp_key:
                result.funcStartUrl = this.getPlayTechStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.PLAYTECH_GROUP.CALL_URL;
                break;
            case config_1.Game.BTI.cp_key:
                result.funcStartUrl = this.getBTiStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.BTI.CALL_URL;
                break;
            case config_1.Game.ASTAR.cp_key:
                result.funcStartUrl = this.getAStarStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.ASTAR.CALL_URL;
                break;
            case config_1.Game.AWC_SEXY.cp_key:
                result.funcStartUrl = this.getAWCStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.AWC_GROUP.CALL_URL;
                break;
            case config_1.Game.FC.cp_key:
                result.funcStartUrl = this.getFCStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.FC.CALL_URL;
                break;
            case config_1.Game.JDB_JDB.cp_key:
                result.funcStartUrl = this.getJDBStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.JDB_GROUP.CALL_URL;
                break;
            case config_1.Game.DBCasino.cp_key:
                result.funcStartUrl = this.getDBCasinoStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.DBCasino.CALL_URL;
                break;
            case config_1.Game.HiddenPoker.cp_key:
                result.funcStartUrl = this.getHiddenPokerStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.HiddenPoker.CALL_URL;
                break;
            case config_1.Game.BG.cp_key:
                result.funcStartUrl = this.getBGStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.BG.CALL_URL;
                break;
            case config_1.Game.HRG.cp_key:
                result.funcStartUrl = this.getHRGStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.HRG.CALL_URL;
                break;
            case config_1.Game.SC.cp_key:
                result.funcStartUrl = this.getSCStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.SC.CALL_URL;
                break;
            case config_1.Game.SB.cp_key:
                result.funcStartUrl = this.getSBStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.SB.CALL_URL;
                break;
            case config_1.Game.SA.cp_key:
                result.funcStartUrl = this.getSAStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.SA.CALL_URL;
                break;
            case config_1.Game.CLP.cp_key:
                result.funcStartUrl = this.getCLPStartUrl;
                result.strSendDataToCallbackServerUrl = config_1.Game.CLP.CALL_URL;
                break;
        }
        return result;
    }
    getOperatorGameServiceIndex(a_cOperator) {
        if (a_cOperator.wallet_type == config_1.Config.WALLET_TYPE.SEAMLESS) {
            if (a_cOperator.qt_level == 0)
                return 0;
            else
                return 100 + a_cOperator.qt_level;
        }
        else
            return 1;
    }
};
exports.PlayService = PlayService;
exports.PlayService = PlayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        api_service_1.ApiService,
        play_dao_1.PlayDao])
], PlayService);
//# sourceMappingURL=play.service.js.map