import { Injectable } from "@nestjs/common";
import { AccessCodeService } from "src/Global/Service/access.code.service";
import { ApiService } from "src/Infrastructure/Api/api.service";
import { rc_msg } from "./Config/config.rc.msg";
import * as g_queryString from "querystring";
import * as crypto from "crypto";
import { MainAppDao } from "./main.app.dao";
import { Config } from "src/Config/config";
import { ParsedUrlQueryInput } from "querystring";
import {
  CxUser,
  GameNewRow,
  GameRow,
  TblOperator,
} from "./Interface/main.app.dao.interface";
import { FAILED, SUCCESS } from "src/Config/result.code";
import * as _ from "lodash";
import * as CryptoJS from "crypto-js";
import { Operator } from "./Interface/main.app.interface";
import { from } from "rxjs";

const _md5 = (s: string) =>
  crypto.createHash("md5").update(s, "utf8").digest("hex").toUpperCase();

@Injectable()
export class MainAppService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly mainAppDao: MainAppDao,
    private readonly apiService: ApiService,
  ) {}

  /**
   * for test
   * @param req
   * @returns
   */
  async test(any): Promise<any> {
    // const ip = '13.208.47.166'; // VPN
    // console.info('****** TEST *****');
    // console.log('any = ', any)
    // const result = await this.mainAppDao.procChkOperator(any.opkey, ip);
    // // const result = await this.mainAppDao.getTblOperatorByUuid(any.opkey)
    // console.info('****** TEST *****');
    // console.info('result = ', result);
    // return result;

    // const list = await this.accessCodeService.getTableListByCPKey(any.thirdpartycode)
    // console.info('list = ', list)

    const result = await this.getTransferBalance(
      "1300",
      "50ff6f7d8dc2afe414d778ca0fc0cc39",
      "2720",
      "a7r_evol_test_01",
    );
    return result;
  }

  /**
   * get result message
   * @param key lang key
   * @param code result code
   * @returns string
   */
  getResultMsg(key: string, code: number | null): string {
    return rc_msg[key]?.[code] ?? "실패했습니다";
  }

  /**
   * check query string
   * @param a_strOPKey operator key
   * @param a_query
   * @param a_strHash hash
   * @returns boolean
   */
  checkQueryString(
    a_strOPKey: string,
    a_query: string,
    a_strHash: string,
  ): boolean {
    const strQueryStringHash = this.getMd5Hash(a_strOPKey, a_query);
    const strQueryStringEncHash = this.getMd5EncHash(a_strOPKey, a_query);
    return (
      strQueryStringHash === a_strHash || strQueryStringEncHash === a_strHash
    );
  }

  /**
   * get md5 hash
   * @param opKey operator key
   * @param queryStr query string
   * @returns string
   */
  getMd5Hash(opKey: string, queryStr: string) {
    delete queryStr["hash"];
    const strQueryString = g_queryString.stringify(
      queryStr as unknown as ParsedUrlQueryInput,
      undefined,
      undefined,
      { encodeURIComponent: (s) => s }, // 取代 deprecated 的 unescape
    );
    const strQueryStringHash = _md5(opKey + "|" + strQueryString);
    console.log("[getMd5Hash] strQueryStringHash = ", strQueryStringHash);
    return strQueryStringHash;
  }

  /**
   * get md5 hash with encoded query string
   * @param opKey operator key
   * @param queryStr query string
   * @returns string
   */
  getMd5EncHash(opKey: string, queryStr: string) {
    delete queryStr["hash"];
    const strQueryStringEnc = g_queryString.stringify(
      queryStr as unknown as ParsedUrlQueryInput,
    );
    const strQueryStringEncHash = _md5(opKey + "|" + strQueryStringEnc);
    console.log(
      "[getMd5EncHash] strQueryStringEncHash = ",
      strQueryStringEncHash,
    );
    return strQueryStringEncHash;
  }
  /**
   * get operator info
   * @param a_strOPKey operator key
   * @param a_strIP ip
   * @returns operator info
   */
  async getOperatorInfo(
    a_strOPKey: string,
    a_strIP: string,
  ): Promise<TblOperator | null> {
    const result = await this.mainAppDao.getOperatorInfo(a_strOPKey, a_strIP);
    return result;
  }

  /**
   * get or create user
   * @param a_cOperato operator
   * @param a_strUserID user id
   * @returns user info
   */
  async findUserByOperatorAndUserIdOrg(opId: string, a_strUserID: string) {
    // if exist
    console.info("[getUserInfo][opId] = ", opId);
    console.info("[getUserInfo][a_strUserID] = ", a_strUserID);
    const userInfo = await this.mainAppDao.getUserByOpIdAndUserIdOrg(
      opId,
      a_strUserID,
    );
    // console.info('[userInfo] >>>>>', userInfo)
    return userInfo;
  }

  /**
   * create user
   * @param a_cOperato operator
   * @param a_strUserID user id
   * @param userObj user obj
   * @param a_nVersion version
   * @returns user info
   */
  async createUser(
    opId: string,
    a_strUserID: string,
    reqCxUser: CxUser,
    a_nVersion?: number,
  ): Promise<CxUser | null> {
    if (!reqCxUser?.user_nick_org) {
      return null;
    }
    const opStr = this.accessCodeService.getOperatorCode(Number(opId));
    const strCreateUserID = this.accessCodeService.getUserOPID(
      opStr,
      a_strUserID,
    );
    const strCreateUserNick = this.accessCodeService.getUserOPID(
      opStr,
      reqCxUser.user_nick_org,
    );
    const insertUserObj = <CxUser>{
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
    // console.log('insertUserObj >>>', insertUserObj)

    let insertResult: any;
    try {
      // 防止重複寫入等情況
      insertResult = await this.mainAppDao.insertUser(insertUserObj);
    } catch (error) {
      console.error("[insertUser] error = ", error);
      return null;
    }

    // console.log(' insertResult >>>>>', insertResult);

    const newUser = <CxUser>{};
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
        const _LEG = Config.MAX_USER_ID_BODY_LEN;
        const userKeyStr = newUser.user_key.toString().padStart(_LEG!, "0");
        const strCreateUserID = [opCode, userKeyStr].join("");

        // console.log('strCreateUserID >>>', strCreateUserID)

        const updateResult = await this.mainAppDao.updateUserIdByKey(
          "cx_user",
          { user_id: strCreateUserID },
          "user_key = ?",
          { user_key: newUser.user_key },
        );
        newUser.user_id = strCreateUserID;
        break;
      default:
        break;
    }

    return newUser;
  }

  /**
   * get cp list
   * @returns cp list
   */
  async getCPList() {
    return this.mainAppDao.getCPList();
  }

  /**
   * get game list with table type
   * @param cpkey cp key
   * @param version version
   * @returns game list with table type
   */
  async getGameListTableType(cpkey: string, version: number) {
    const objData = await this.mainAppDao.getGameList(Number(cpkey), version);

    if (objData.list?.length && objData.list[0].type === Config.GAMECODE.LIVE) {
      const tableMap = new Map<string, any[]>();

      for (const game of objData.list) {
        const tableType = game.table?.type ?? "unknown";
        if (!tableMap.has(tableType)) {
          tableMap.set(tableType, []);
        }
        tableMap.get(tableType)!.push(game);
      }

      objData.table = {
        table_type: Array.from(tableMap.keys()),
        list: Object.fromEntries(tableMap),
      };
    }

    return objData;
  }

  /**
   * get game list
   * @param cpkey cp key
   * @param version version
   * @returns game list
   */
  async getGameList(cpkey: string, version: number) {
    const gameListObj = await this.mainAppDao.getGameList(
      Number(cpkey),
      version,
    );
    return gameListObj;
  }

  /**
   * check params
   * @param req request
   * @returns result
   */
  async checkParams(req: any) {
    const result = {
      result: SUCCESS,
      data: { user: {}, params: {}, operator: { id: 0 } },
    };
    const params = req.query;
    result.data.params = params;

    // white list check
    let strUrl = req.path;
    if (strUrl[strUrl.length - 1] != "/") strUrl += "/";
    if (!Config.TABLE_LIST_WHITE_LIST.hasOwnProperty(strUrl)) {
      result.result = 102;
      return result;
    }

    // Check required parameters
    if (!params.opkey || !params.hash) {
      result.result = 100;
      return result;
    }

    // Check required parameters
    const paramCheckKeys = Config.TABLE_LIST_WHITE_LIST[strUrl] ?? [];
    for (const key of paramCheckKeys) {
      const value = params[key];
      if (value === undefined || value === null || value === "") {
        // !params.opkey 會「誤殺」掉 0 或 false 的情況。
        result.result = 100;
        return result;
      }
    }

    if (params.opkey.length !== Config.MAX_UUID_SIZE) {
      result.result = 101; //	opkey 길이가 잘못됨
      return result;
    }

    // verfify hash
    if (
      req.method !== "POST" &&
      !this.checkQueryString(params.opkey, req.query, params.hash)
    ) {
      result.result = 10000;
      return result;
    }

    // get OP info
    const cOperator = _.isNull(Config.MANAGER_IP.find((x) => x === req.ip))
      ? await this.mainAppDao.getTblOperatorByUuid(params.opkey)
      : await this.mainAppDao.procChkOperator(params.opkey, req.ip);
    if (!cOperator) {
      result.result = 1;
      return result;
    }
    result.data.operator = cOperator;

    // get userInfo
    if (params.user_id) {
      const cxUser = await this.mainAppDao.getUserByOpIdAndUserIdOrg(
        cOperator?.id.toString(),
        params.user_id,
      );
      if (!cxUser) result.result = 10001;
      result.data.user = cxUser ?? {};
    }

    return result;
  }

  /**
   * check operator
   * @param opkey operator key
   * @param ip ip
   * @returns operator info
   */
  async procChkOperator(opkey: string, ip: string) {
    return await this.mainAppDao.procChkOperator(opkey, ip);
  }

  /**
   * get transfer balance
   * @param opId operator id
   * @param opKey operator key
   * @param userKey user key
   * @param userId user id
   * @returns transfer balance
   */
  async getTransferBalance(
    opId: string,
    opKey: string,
    userKey: string,
    userId: string,
  ) {
    const url = Config.TRANSFER_SERVER_URL + "balance";
    const result = await this.apiService.post(url, {
      op_id: opId,
      op_key: opKey,
      user_key: userKey,
      user_id: userId,
    });
    // console.log('result >>>', result) // result >>> { result: 0 }
    if (result.result === 0) {
      return { result: 20010 };
    }
    return result;
  }

  /**
   * get game mt code
   * @param strThirdPartyCode third party code
   * @param strGameCode game code
   * @returns game mt code
   */
  async getGameMTCode(strThirdPartyCode: string, strGameCode: string) {
    return await this.mainAppDao.getGameMTCode(strThirdPartyCode, strGameCode);
  }

  /**
   * check game permit
   * @param a_nOPID operator id
   * @param a_nGameCPKey game cp key
   * @param a_strGameCode game code
   * @returns result
   */
  async checkGamePermit(
    a_nOPID: number,
    a_nGameCPKey: number,
    a_strGameCode: string,
  ) {
    return await this.mainAppDao.checkGamePermit(
      a_nOPID,
      a_nGameCPKey,
      a_strGameCode,
    );
  }

  /**
   * decode site url or default
   * @param strSiteUrl site url
   * @returns site url
   */
  async decodeSiteUrlOrDefault(strSiteUrl: string) {
    if (strSiteUrl != null) {
      try {
        strSiteUrl = CryptoJS.enc.Utf8.stringify(
          CryptoJS.enc.Base64.parse(strSiteUrl),
        );
      } catch (a_err) {
        console.log(a_err);
      }
    } else strSiteUrl = Config.PUBLIC_URL.EXIT;

    return strSiteUrl;
  }

  /**
   * load operator data
   * @param oId operator id
   * @param oName operator name
   * @returns operator data
   */
  async loadOperatorData(oId: string, oName: string) {
    // get OP
    const objOPDate = this.accessCodeService.getGOpListItem(oName);
    if (!objOPDate)
      this.accessCodeService.addGOpListItem(oName, oId.toString());

    // [pass]
    if (Date.now() - objOPDate.times < Config.OPERATOR_LOAD_TTL_MS)
      return objOPDate;

    // [new]
    objOPDate.times = Date.now();
    // get tree
    const strTree = await this.mainAppDao.getOperatorTree(oId);
    console.log("strTree >>>>", strTree);
    if (!strTree) return null;
    const aTree = strTree
      .split(",") // 切割字串
      .filter((s) => s !== "") // 去掉空字串（開頭或結尾的 , 會產生空值）
      .reverse(); // 反轉

    // get splash
    const aSplash = await this.mainAppDao.getOperatorSplashInfo(aTree);
    if (!aSplash) return null;
    for (const node of aTree) {
      // 預設 splash → 立即套用並結束
      if (node === Config.SPLASH_DEF_NAME) {
        objOPDate.splash = {
          is_use: true,
          data: this.accessCodeService.getGOpSplash(),
        };
        break;
      }
      // 查詢當前 operator 的 splash 設定
      const objOperatorSplashInfo = aSplash.find((x) => x.op_name === node);
      const nUse = objOperatorSplashInfo?.use_splash ?? 0;
      if (nUse === 1) {
        const objSplashData = await this.getOperatorSplashList_name(node);
        console.info("objSplashData >>>>>", objSplashData);

        if (objSplashData) {
          objOPDate.splash = { is_use: true, data: objSplashData };
        }
      }
      // 不管有沒有成功 → 都要結束迴圈
      break;
    }
    return objOPDate;
  }

  /**
   * get operator splash list by name
   * @param name operator name
   * @returns operator splash list
   */
  async getOperatorSplashList_name(name: string) {
    const row = await this.mainAppDao.getOperatorSplashList_name(name);
    if (!row) return null;
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

  /**
   * use splash process
   * @param cOperator operator
   */
  async UseSplashProcess(cOperator: Operator, objPlayData: any, cUser: CxUser) {
    //# ISU 10000 START -----------------------------------------------------------------------------------
    //	2024-11-11
    //		# ISU 10000 - 게임실행 방법변경 ( 테스트 )
    //			1. 게임실행 요청시 필요한 모든 정보를 게임시작 out_main( out_main.js ) 로 정보 전송
    //			2. out_main에서 토큰과 정보 저장 후 웹페이지( play.ejs ) 출력
    //			3. play 웹페이지에서 IFrame에 /playinner를 호출
    //			4. /playinner에서 play.js에 게임시작 URL취득 요청
    //			5. 성공일 경우 게임URL Redirect
    //----------------------------------------------------------------------------------------------------
    const objPlayResult = { result: SUCCESS, data: { token: "", link: "" } };

    // No one use it. START
    const objOperatorData = await this.loadOperatorData(
      cOperator.id.toString(),
      cOperator.name,
    );
    console.log(objOperatorData);

    if (objOperatorData.splash && objOperatorData.splash.is_use) {
      objPlayData.splash = objOperatorData.splash;
    }
    // No one use it. END

    const strPlayData = JSON.stringify(objPlayData);
    const strPlayToken = _md5([strPlayData, cUser.sign].join(""));

    const url = [Config.SPLASH_PLAY_API_URL, Config.ENC_KEY].join("");
    const body = { json: { session: strPlayToken, data: objPlayData } };
    const result = await this.apiService.post(url, body);
    objPlayResult.result = SUCCESS;
    objPlayResult.data.token = cUser.sign ?? "";
    objPlayResult.data.link = [Config.SPLASH_PLAY_API_URL, result.session].join(
      "",
    );

    return objPlayResult;
  }

  /**
   * load operator game info
   * @param oId operator id
   */
  async loadOperatorGameInfo(oId: number) {
    const cOpGameInfo = await this.mainAppDao.getOpratorGameInfo(oId);
    if (cOpGameInfo)
      this.accessCodeService.setGOperatorGameInfo(oId, cOpGameInfo);
    return;
  }

  /**
   * no use splash process
   * @param operator operator
   * @param objPlayData play data
   * @param cUser user
   * @returns result
   */
  async NoUseSplashProcess(
    operator: Operator,
    objPlayData: any,
    cUser: CxUser,
  ) {
    await this.loadOperatorGameInfo(operator.id);
    const url = Config.Play_API_URL;
    const body = { json: objPlayData };
    const result = await this.apiService.post(url, body);
    return result;
  }

  /**
   * get r
   * @param opId operator id
   * @returns r
   */
  async getR(opId: number) {
    return await this.mainAppDao.getR(opId);
  }

  /**
   * get bet log
   * @param opkey operator key
   * @param roundid round id
   * @returns bet log
   */
  async getBetLog(opkey: number, roundid: string) {
    return await this.mainAppDao.getBetLog(opkey, roundid);
  }

  /**
   * log calling
   * @param strUserID user id
   * @param objCPData cp data
   * @param objCheckResult check result
   * @param logResult log result
   * @returns result
   */
  async logCalling(
    strUserID: string,
    objCPData: any,
    objCheckResult: any,
    logResult: any,
  ) {
    const strUserIDSlice = strUserID.slice(
      Config.MAX_OPERATOR_KEY_CODE_LENGTH + 1,
    );
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

  /**
   * log view data
   * @param objLogData log data
   * @returns result
   */
  async logViewData(objLogData: any) {
    return await this.apiService.post(Config.LOG_VIEW_API_URL.GET, {
      from: objLogData,
    });
  }

  /**
   * get new game list
   * @returns new game list
   */
  async getNewGameList() {
    const list = await this.mainAppDao.getNewGameList();
    let aList: GameNewRow[] = [];
    if (!list) return aList;
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
}
