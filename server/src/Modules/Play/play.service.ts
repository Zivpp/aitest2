import { Injectable } from "@nestjs/common";
import { AccessCodeService } from "src/Global/Service/access.code.service";
import * as g_queryString from "querystring";
import * as crypto from "crypto";
import { Config, Game } from "src/Config/config";
import { PlayDao } from "./play.dao";
import { COperatorGameInfo, PlayReqOperator } from "./Interface/play.interface";
import { ApiService } from "src/Infrastructure/Api/api.service";
import { SUCCESS } from "src/Config/result.code";

const md5 = (s: string) =>
  crypto.createHash("md5").update(s, "utf8").digest("hex").toUpperCase();

@Injectable()
export class PlayService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly apiService: ApiService,
    private readonly playDao: PlayDao,
  ) {}

  /**
   * load operator game info
   * @param opId operator id
   */
  async loadOperatorGameInfo(opId: number) {
    const operator = await this.playDao.getOperatorGameInfo(opId);
    if (!operator) return null;

    const cOperatorGameInfo = <COperatorGameInfo>{};
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

  /**
   * get bet limit type
   * @param a_objThirdparty
   * @param a_strBetLimitType
   * @returns
   */
  getBetLimitType(a_objThirdparty, a_strBetLimitType) {
    if (!a_objThirdparty?.hasOwnProperty("BET_LIMIT"))
      return Config.BET_LIMIT_DEF;
    if (a_strBetLimitType === null) return a_objThirdparty.BET_LIMIT_DEF;
    const strBetLimitType = a_objThirdparty.BET_LIMIT.hasOwnProperty(
      a_strBetLimitType,
    )
      ? a_objThirdparty.BET_LIMIT[a_strBetLimitType]
      : a_objThirdparty.BET_LIMIT_DEF;
    return strBetLimitType;
  }

  /**
   * get evolution start url
   */
  async getEvolutionStartUrl(
    a_webRes,
    a_cOperator,
    a_cUser,
    a_strGameID,
    a_strPlatform,
    a_nGameCpKey,
    a_strUserAgent,
    a_strSiteUrl,
    a_strBetLimitType,
    a_strLanaguage,
    a_strCurrency,
  ) {
    const objThirdparty = Config.EVOLUTION_GROUP.VENDORS[a_nGameCpKey];
    const strLanaguage = a_strLanaguage || objThirdparty.LANGUAGE_DEF;

    const objCPAccount = await this.playDao.getCPAccount(
      a_cOperator.name,
      Game.Evolution.cp_key,
    );
    const strRequestUrl = objCPAccount
      ? [
          Config.EVOLUTION_GROUP.URL,
          "ua/v1/",
          objCPAccount.account,
          "/",
          objCPAccount.password,
        ].join("")
      : [
          Config.EVOLUTION_GROUP.URL,
          "ua/v1/",
          Config.EVOLUTION_GROUP.KEY,
          "/",
          Config.EVOLUTION_GROUP.API_TOKEN,
        ].join("");

    // package param
    let objParam = {
      uuid: md5(a_cUser.token),
      player: {
        id: a_cUser.user_id,
        update: false,
        firstName: a_cUser.user_id,
        lastName: this.accessCodeService.getOperatorCode(a_cOperator.id),
        nickname: a_cUser.user_nick,
        country: Config.COUNTRY_A2,
        language: a_nGameCpKey == Game.NextSpin.cp_key ? "en" : strLanaguage,
        currency: Config.CURRENCY.DEF,
        session: { id: a_cUser.sign, ip: a_cUser.connect_ip },
      },
      config: {
        brand: { id: a_cOperator.name, skin: "1" },
        game: { category: a_strGameID, interface: "", table: { id: "" } },
        channel: { wrapped: false, mobile: false },
      },
    };
    if (a_nGameCpKey !== Game.Evolution.cp_key) {
      objParam.config.game.category = "slots";
      objParam.config.game.interface = "view1";
      objParam.config.game.table = { id: a_strGameID };
    } else {
      objParam.config.brand.skin = this.getBetLimitType(
        Config.Evolution,
        a_strBetLimitType,
      );
      if (a_strGameID.length === 16)
        objParam.config.game.table = { id: a_strGameID };
    }

    console.log("strRequestUrl >>>", strRequestUrl);
    console.log("objParam >>>", JSON.stringify(objParam));

    // api
    const res = await this.apiService.post(strRequestUrl, objParam);
    if (res.status != 200) {
      console.log("# Evolution Start Error : ", res);
      console.log(strRequestUrl);
      console.log(objParam);
      return { result: 20001, error: { code: 0, msg: "" } };
    }

    return {
      result: SUCCESS,
      link: [
        Config.EVOLUTION_GROUP.URL,
        res?.entry?.toString().substr(1, res?.entry?.length),
      ].join(""),
    };
  }

  async getCQ9hStartUrl() {}

  async getPPSeamlessStartUrl() {}

  async getPPTransferStartUrl() {}

  async getDGStartUrl() {}

  async getBNGStartUrl(
    a_webRes,
    a_cOperator,
    a_cUser,
    a_strGameID,
    a_strPlatform,
  ) {
    const objParams = {
      token: a_cUser.sign,
      ts: Math.floor(Date.now() / 1000),
      platform: a_strPlatform == Config.DEVICE.pc ? "desktop" : "mobile",
      wl: Config.BNG_GROUP.BRAND,
      lang: Config.LANGUAGE_DEF,
      tz: Config.TIME_ZONE,
      game: "",
    };
    let strRequestUrl = "";
    if (a_strGameID != Config.BNG_GROUP.LOBBY_GAMECODE) {
      strRequestUrl = [
        Config.BNG_GROUP.URL,
        Config.BNG_GROUP.PID,
        "/game.html",
      ].join("");
      objParams.game = a_strGameID;
    } else {
      strRequestUrl = [
        Config.BNG_GROUP.URL_LOBBY,
        Config.BNG_GROUP.PID,
        "/games/",
      ].join("");
    }
    return {
      result: SUCCESS,
      link: [strRequestUrl, "?", g_queryString.stringify(objParams)].join(""),
    };
  }

  async getPlayStarStartUrl() {}

  async getWMLiveStartUrl() {}

  async getTGstartUrl() {}

  async getAGStartUrl() {}

  async getHabaneroStartUrl() {}

  async getSportsStartUrl() {}

  async getPGStartUrl() {}

  async getMOAhStartUrl() {}

  async getTaishanStartUrl() {}

  async getDowinStartUrl() {}

  async getMGPStartUrl() {}

  async getKDStartUrl() {}

  async getDCStartUrl() {}

  async getVivoStartUrl() {}

  async getPlayTechStartUrl() {}

  async getBTiStartUrl() {}

  async getAStarStartUrl() {}

  async getAWCStartUrl() {}

  async getFCStartUrl() {}

  async getJDBStartUrl() {}

  async getDBCasinoStartUrl() {}

  async getHiddenPokerStartUrl() {}

  async getBGStartUrl() {}

  async getHRGStartUrl() {}

  async getSCStartUrl() {}

  async getSBStartUrl() {}

  async getSAStartUrl() {}

  async getCLPStartUrl() {}

  /**
   * send to callback server
   * @param url callback url
   * @param body callback body
   * @returns
   */
  async sendToCallbackServer(url: string, body: any) {
    const res = await this.apiService.post(url, body);
    if (res.status != 200) return res;
    return { result: 20010, error: { code: 0, msg: "" } };
  }

  async getStartUrl(cp: string, cOperator: PlayReqOperator) {
    let result: any = {};
    switch (cp) {
      case Game.Evolution.cp_key:
      case Game.NetEnt.cp_key:
      case Game.RedTiger.cp_key:
      case Game.NoLimitCity.cp_key:
      case Game.BTG.cp_key:
        result.funcStartUrl = this.getEvolutionStartUrl.bind(this);
        result.strSendDataToCallbackServerUrl = Config.EVOLUTION_GROUP.CALL_URL;
        break;

      case Game.CQ9.cp_key:
      case Game.CQ9_LIVE.cp_key:
      case Game.CQ9_LIVE_MOTIVATION.cp_key:
        result.funcStartUrl = this.getCQ9hStartUrl.bind(this);
        result.strSendDataToCallbackServerUrl = Game.CQ9_GROUP.CALL_URL;
        break;

      case Game.PP.cp_key:
      case Game.PP_LIVE.cp_key:
      case Game.PP_REELKINGDOM.cp_key:
      case Game.PP_FATPANDA.cp_key:
        result.funcStartUrl = this.getPPSeamlessStartUrl.bind(this);
        if (this.getOperatorGameServiceIndex(cOperator) == 1)
          result.strSendDataToCallbackServerUrl = Config.Game.PP_2.CALL_URL;
        else if (this.getOperatorGameServiceIndex(cOperator) == 101)
          result.strSendDataToCallbackServerUrl = Config.Game.PP_101.CALL_URL;
        else result.strSendDataToCallbackServerUrl = Config.Game.PP.CALL_URL;
        break;

      case Game.PP_BT.cp_key:
        result.funcStartUrl = this.getPPTransferStartUrl.bind(this);
        break;

      case Game.DG.cp_key:
        result.funcStartUrl = this.getDGStartUrl.bind(this);
        result.strSendDataToCallbackServerUrl = Game.DG.CALL_URL;
        break;

      case Game.BNG.cp_key:
      case Game.BNG_PLAYSON.cp_key:
        result.funcStartUrl = this.getBNGStartUrl;
        result.strSendDataToCallbackServerUrl = Config.BNG_GROUP.CALL_URL;
        break;

      case Game.PlayStar.cp_key:
        result.funcStartUrl = this.getPlayStarStartUrl;
        result.strSendDataToCallbackServerUrl = Game.DG.CALL_URL;
        break;

      case Game.WM_LIVE.cp_key:
        result.funcStartUrl = this.getWMLiveStartUrl;
        result.strSendDataToCallbackServerUrl = Game.WM_LIVE.CALL_URL;
        break;

      case Game.TG.cp_key:
        result.funcStartUrl = this.getTGstartUrl;
        result.strSendDataToCallbackServerUrl = Game.TG.CALL_URL;
        break;

      case Game.AG.cp_key:
      case Game.AG_SLOT.cp_key:
        result.funcStartUrl = this.getAGStartUrl;
        result.strSendDataToCallbackServerUrl = Game.AG_GROUP.CALL_URL;
        break;

      case Game.Habanero.cp_key:
        result.funcStartUrl = this.getHabaneroStartUrl;
        result.strSendDataToCallbackServerUrl = Game.Habanero.CALL_URL;
        break;

      case Game.Sports.cp_key:
        result.funcStartUrl = this.getSportsStartUrl;
        result.strSendDataToCallbackServerUrl = Game.Sports.CALL_URL;
        break;

      case Game.PG.cp_key:
        result.funcStartUrl = this.getPGStartUrl;
        result.strSendDataToCallbackServerUrl = Game.Sports.CALL_URL;
        break;

      case Game.MOA_WAZDAN.cp_key:
      case Game.MOA_TRIPLEPG.cp_key:
      case Game.MOA_GAMEART.cp_key:
      case Game.MOA_MOBILOTS.cp_key:
      case Game.MOA_PLAYPEARLS.cp_key:
      case Game.MOA_DRAGOONSOFT.cp_key:
      case Game.MOA_BETGAMESTV.cp_key:
      case Game.MOA_SKYWINDLIVE.cp_key:
      case Game.MOA_1X2.cp_key:
      case Game.MOA_ELK.cp_key:
      case Game.MOA_VIVO.cp_key:
      case Game.MOA_SKYWINDCASINO.cp_key:
      case Game.MOA_ONLYPLAY.cp_key:
        result.funcStartUrl = this.getMOAhStartUrl;
        result.strSendDataToCallbackServerUrl = Game.MOA_GROUP.CALL_URL;
        break;

      case Game.Taishan.cp_key:
        result.funcStartUrl = this.getTaishanStartUrl;
        result.strSendDataToCallbackServerUrl = Game.Taishan.CALL_URL;
        break;

      case Game.Dowin.cp_key:
        result.funcStartUrl = this.getDowinStartUrl;
        result.strSendDataToCallbackServerUrl = Game.Dowin.CALL_URL;
        break;

      case Game.MGP.cp_key:
      case Game.MGP_GRAND.cp_key:
      case Game.MGP_SLOT.cp_key:
        result.funcStartUrl = this.getMGPStartUrl;
        result.strSendDataToCallbackServerUrl = Game.MGP_GROUP.CALL_URL;
        break;

      case Game.KD.cp_key:
        result.funcStartUrl = this.getKDStartUrl;
        result.strSendDataToCallbackServerUrl = Game.KD.CALL_URL;
        break;

      case Game.DC_EVOPLAY.cp_key:
      case Game.DC_YGG.cp_key:
      case Game.DC_PNG.cp_key:
      case Game.DC_RELAX.cp_key:
      case Game.DC_AVATARUX.cp_key:
      case Game.DC_HACKSAW.cp_key:
      case Game.DC_OCTOPLAY.cp_key:
      case Game.DC_NOVOMATIC.cp_key:
      case Game.DC_BGAMING.cp_key:
      case Game.DC_BLUEPRINT.cp_key:
      case Game.DC_THUNDERKICK.cp_key:
        result.funcStartUrl = this.getDCStartUrl;
        result.strSendDataToCallbackServerUrl = Game.DC_GROUP.CALL_URL;
        break;

      case Game.VIVO.cp_key:
        result.funcStartUrl = this.getVivoStartUrl;
        result.strSendDataToCallbackServerUrl = Game.VIVO.CALL_URL;
        break;

      case Game.PlayTech.cp_key:
      case Game.PlayTech_slot.cp_key:
        result.funcStartUrl = this.getPlayTechStartUrl;
        result.strSendDataToCallbackServerUrl = Game.PLAYTECH_GROUP.CALL_URL;
        break;

      case Game.BTI.cp_key:
        result.funcStartUrl = this.getBTiStartUrl;
        result.strSendDataToCallbackServerUrl = Game.BTI.CALL_URL;
        break;

      case Game.ASTAR.cp_key:
        result.funcStartUrl = this.getAStarStartUrl;
        result.strSendDataToCallbackServerUrl = Game.ASTAR.CALL_URL;
        break;

      case Game.AWC_SEXY.cp_key:
        result.funcStartUrl = this.getAWCStartUrl;
        result.strSendDataToCallbackServerUrl = Game.AWC_GROUP.CALL_URL;
        break;

      case Game.FC.cp_key:
        result.funcStartUrl = this.getFCStartUrl;
        result.strSendDataToCallbackServerUrl = Game.FC.CALL_URL;
        break;

      // Not used 24
      case Game.JDB_JDB.cp_key:
        result.funcStartUrl = this.getJDBStartUrl;
        result.strSendDataToCallbackServerUrl = Game.JDB_GROUP.CALL_URL;
        break;

      case Game.DBCasino.cp_key:
        result.funcStartUrl = this.getDBCasinoStartUrl;
        result.strSendDataToCallbackServerUrl = Game.DBCasino.CALL_URL;
        break;

      case Game.HiddenPoker.cp_key:
        result.funcStartUrl = this.getHiddenPokerStartUrl;
        result.strSendDataToCallbackServerUrl = Game.HiddenPoker.CALL_URL;
        break;

      // 241003 BigGame add
      case Game.BG.cp_key:
        result.funcStartUrl = this.getBGStartUrl;
        result.strSendDataToCallbackServerUrl = Game.BG.CALL_URL;
        break;

      // 241016 Hot Road Gaming add
      case Game.HRG.cp_key:
        result.funcStartUrl = this.getHRGStartUrl;
        result.strSendDataToCallbackServerUrl = Game.HRG.CALL_URL;
        break;

      // 241024 Sky City add
      case Game.SC.cp_key:
        result.funcStartUrl = this.getSCStartUrl;
        result.strSendDataToCallbackServerUrl = Game.SC.CALL_URL;
        break;
      // 241224 Saba add
      case Game.SB.cp_key:
        result.funcStartUrl = this.getSBStartUrl;
        result.strSendDataToCallbackServerUrl = Game.SB.CALL_URL;
        break;
      // 250217 SA add
      case Game.SA.cp_key:
        result.funcStartUrl = this.getSAStartUrl;
        result.strSendDataToCallbackServerUrl = Game.SA.CALL_URL;
        break;
      // 250305 CLP add
      case Game.CLP.cp_key:
        result.funcStartUrl = this.getCLPStartUrl;
        result.strSendDataToCallbackServerUrl = Game.CLP.CALL_URL;
        break;
    }
    return result;
  }

  getOperatorGameServiceIndex(a_cOperator) {
    if (a_cOperator.wallet_type == Config.WALLET_TYPE.SEAMLESS) {
      if (a_cOperator.qt_level == 0) return 0;
      else return 100 + a_cOperator.qt_level;
    } else return 1;
  }
}
