import {
  objThirdParty,
  Provider,
  TokenWrapper,
  UserObj,
} from "./interface/access.code.service.interface";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { Config } from "../../Config/config";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import * as _ from "lodash";

import { GSlotItem } from "./interface/access.code.service.interface";
import { CallbackType, Lang, Status } from "./Enum/access.code.enum";
import {
  ObjData,
  ProcessRequest,
} from "src/Grpc/Clients/Interface/core.service.interface";
import { ApiService } from "src/Infrastructure/Api/api.service";
import { AccessCodeDao } from "./access.code.dao";

@Injectable()
export class AccessCodeService {
  constructor(
    private readonly redisService: RedisService,
    private readonly apiService: ApiService,
    private readonly accessCodeDao: AccessCodeDao,
  ) {}

  // In reality, this retrieves the user info object.
  // * Since the token originates from Server A, there won’t be a value here.
  private g_tokenList: UserObj[] = [];
  private g_tables = {};
  private g_slot: { data: GSlotItem[] } = {
    data: [],
  };
  private g_userStatusList: Record<string, any> = {};
  private g_cp_list: { list: any[]; times: number } = {
    list: [],
    times: 0,
  };
  private g_op_list: Record<string, any> = {};
  private g_operator_gameinfo: any[] = [];
  private g_current_r: Record<string, any> = {};

  /**
   * set current r
   * @param objCurrentR current r
   * @param key key
   */
  setGCurrentR(key: string, objCurrentR: any) {
    this.g_current_r[key] = objCurrentR;
  }

  /**
   * get current r
   * @param key key
   * @returns current R
   */
  getGCurrentR(key: string) {
    return this.g_current_r[key];
  }

  /**
   * set operator game info
   * @param objOperatorGameInfo operator game info
   * @param index index
   */
  setGOperatorGameInfo(index: number, objOperatorGameInfo: any) {
    this.g_operator_gameinfo[index] = objOperatorGameInfo;
  }

  /**
   * get operator game info
   * @param index index
   * @returns operator game info
   */
  getGOperatorGameInfo(index: number) {
    return this.g_operator_gameinfo[index];
  }

  /**
   * set operator splash
   * @param objSplashData operator splash data
   */
  setGOpSplash(objSplashData: any) {
    this.g_op_list.splash = objSplashData;
  }

  /**
   * get operator splash
   * @returns operator splash
   */
  getGOpSplash() {
    return this.g_op_list?.splash ?? null;
  }

  /**
   * add operator item
   * @param a_strOPName operator name | key
   * @param op_id operator id
   * @param tree_data tree data
   * @param times times
   */
  addGOpListItem(
    a_strOPName: string,
    op_id: string,
    tree_data: any[] = [],
    times = 0,
  ) {
    this.g_op_list[a_strOPName] = { op_id, tree_data, times, splash: null };
  }

  /**
   * get operator item
   * @param a_strOPName operator name
   * @returns operator item
   */
  getGOpListItem(a_strOPName: string) {
    return this.g_op_list[a_strOPName] ?? null; // 沒有就回傳 null
  }

  /**
   * remove operator item
   * @param a_strOPName operator name
   */
  removeGOpListItem(a_strOPName: string) {
    delete this.g_op_list[a_strOPName];
  }

  /**
   * set g cp list
   * @param list cp list
   */
  public setGCpList(list: any[]): void {
    this.g_cp_list.list = list;
    this.g_cp_list.times = Date.now();
  }

  /**
   * get g cp list
   * @returns cp list
   */
  public getGCpList() {
    return this.g_cp_list.list;
  }

  /**
   * get full g cp list
   * @returns full g cp list
   */
  public getFullGCpList(): any {
    return this.g_cp_list;
  }

  /**
   * get request ip
   * @param req request
   * @returns ip
   */
  /**
   * get request ip
   * @param req request
   * @returns ip
   * @description
   * 1. cf-connecting-ip: Cloudflare  proxy
   * 2. x-forwarded-for: reverse proxy
   * 3. remoteAddress: nodejs
   * 4. connection.remoteAddress: nodejs
   * 5. empty string: unknown
   */
  getReqIP(req: any): string {
    return (
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      ""
    );
  }

  /**
   * add user obj to "g_tokenList"(global variable) and redis
   * @param a_key ; 沿用舊系統慣例, 比較好認知
   * @param a_nGameCPKey ; 沿用舊系統慣例, 比較好認知
   * @param userObj ; user obj
   * @returns result
   */
  async addUserObj(
    a_key: string,
    a_nGameCPKey: string,
    userTokenObj: any,
  ): Promise<any> {
    userTokenObj.update_time = Date.now();
    const strSessionKey: string = ["s", a_nGameCPKey, a_key].join("_");

    // this.g_tokenList[userTokenObj.id] = userTokenObj;

    const result = await this.redisService.set(
      strSessionKey,
      JSON.stringify(userTokenObj),
      Config.REDIS.TRANSDATA_KEEP_SEC,
    );
    return result;
  }

  /**
   * add token sign to "g_tokenList"(global variable) and redis
   * @param a_token
   * @param a_nGameCPKey
   * @returns
   */
  async addToken_sign(
    a_token: TokenWrapper,
    a_nGameCPKey: number,
  ): Promise<any> {
    if (_.isNull(a_token)) return;

    a_token.update_time = Date.now();
    this.g_tokenList[a_token.token.sign] = a_token;

    const strSessionKey = ["s", a_nGameCPKey, a_token.token.sg].join("_");
    await this.redisService.set(
      strSessionKey,
      JSON.stringify(a_token.token),
      Config.REDIS.TRANSDATA_KEEP_SEC,
    );
  }

  /**
   * get user obj from  "g_tokenList"(global variable) or redis
   * @param a_key string ; body.userId
   * @param a_nGameCPKey string ; body.sid
   * @returns UserObj
   */
  async getUserObj(a_key: string, a_nGameCPKey: string): Promise<UserObj> {
    let result;

    // Step 1 : get by server memory
    // result = this.g_tokenList[a_key];

    // Step 2 : if step 1 no result, get by redis
    if (_.isNull(result) || _.isUndefined(result)) {
      // if (!CConfig.REDIS_SESSION_USE) // what is "REDIS_SESSION_USE"?
      //     return;
      const strSessionKey: string = ["s", a_nGameCPKey, a_key].join("_");
      console.log("[除錯使用] strSessionKey >>>", strSessionKey);
      const redisResponse: string | null =
        await this.redisService.get(strSessionKey);
      result = redisResponse ? JSON.parse(redisResponse) : null;
    }

    // end
    return result;
  }

  /**
   * Check whether the token contains the required properties: { key, id, op, dt }.
   * If all are present, the token is considered valid and inValid is set to false.
   * @param userObj UserObj
   * @returns boolean
   */
  inValidToken(userObj: UserObj) {
    if (_.isNil(userObj) || _.isEmpty(userObj)) {
      return true;
    }

    const requiredKeys = ["key", "id", "op", "dt"];
    if (requiredKeys.some((k) => !userObj.hasOwnProperty(k))) {
      return true;
    }

    return false; // 反向判斷
  }

  /**
   * get user op id
   * @param a_strOPKeyCode operator code
   * @param a_strUserID user id
   * @returns user op id
   */
  getUserOPID(a_strOPKeyCode: string, a_strUserID: string): string {
    return [a_strOPKeyCode, a_strUserID].join("_");
  }

  /**
   * get operator code
   *
   * getOperatorCode(999) | 999 < 1000 成立 | padStart(3, '0') → "999"
   *
   * getOperatorCode(9999) | 1001 >= 1000 | 1001 + 12000 = 13001 | 13001.toString(36) = "a6p"
   * @param a_nOPID operator id
   * @returns operator code
   */
  getOperatorCode(a_nOPID: number): string {
    if (a_nOPID < 1000) {
      const _LEG = Config.MAX_OPERATOR_KEY_CODE_LENGTH;
      return a_nOPID.toString().padStart(Number(_LEG), "0"); // _LEG! 使用非空斷言 !（確定不會是 undefined）
    } else {
      const _LEG = Config.MAX_OPERATOR_KEY_ADD_VALUE;
      return (Number(a_nOPID) + Number(_LEG)).toString(36); // MAX: 4095
    }
  }

  /**
   * get thirdparty obj
   * @param userObj user obj
   * @returns thirdparty obj | null
   */
  getThirdparty(cCode: string): objThirdParty | null {
    const result = Config.EVOLUTION_GROUP.vendors[cCode];
    if (!result) {
      console.info(`[getThirdparty] Unknown vendor code: ${cCode}`);
      return null;
    }
    return result;
  }

  /**
   * get full table info list ; this.g_tables is global variable
   * @returns table info list
   */
  getFullTableInfoList() {
    return this.g_tables;
  }

  /**
   * get table info ; this.g_tables is global variable
   * @param cCode vendor code
   * @param tableId table id
   * @returns table info | null
   */
  getTableInfo(cCode: string, tableId: string) {
    return this.g_tables?.[cCode]?.data?.[tableId] ?? null;
  }

  /**
   * get table list ; this.g_tables is global variable
   * @param cCode vendor code
   * @returns table list | null
   */
  getTableList(cCode: string): objThirdParty[] | null {
    return this.g_tables?.[cCode]?.data ?? null;
  }

  /**
   * init table list ; this.g_tables is global variable
   * @param cCode vendor code
   */
  initTableList(cCode: string): void {
    this.g_tables[cCode] = {
      times: Date.now(),
      data: [],
    };
  }

  /**
   * update table list ; this.g_tables is global variable
   * @param cpKey vendor code
   * @param data table list
   */
  updateTableList(cpKey: string, data: any[]) {
    if (!this.g_tables[cpKey]) {
      this.initTableList(cpKey);
    }
    this.g_tables[cpKey].times = Date.now();
    this.g_tables[cpKey].data = data;
  }

  /**
   * clear table list ; this.g_tables is global variable
   * @param cpKey vendor code
   */
  clearTableList(cpKey: string) {
    delete this.g_tables[cpKey];
  }

  /**
   * get full game cp key
   * @returns
   */
  getFullGameCPKey() {
    return this.g_slot;
  }

  /**
   * get game cp key
   * @param cpKey game cp key
   * @returns
   */
  getGameCPKey(cpKey: number): number {
    const item = this.g_slot.data.find((item) => item.game_cp_key === cpKey);
    return item?.game_cp_key ?? 0;
  }

  /**
   * set g slot
   * @param data
   */
  setGSlot(data: any[]) {
    this.g_slot.data = data;
  }

  getGUserStatus(userId: string): any {
    return this.g_userStatusList[userId];
  }

  setGUserStatus(userId: string, data: any): void {
    this.g_userStatusList[userId] = data;
  }

  removeGUserStatus(userId: string): void {
    delete this.g_userStatusList[userId];
  }

  getAllGUserStatus(): Record<string, any> {
    return { ...this.g_userStatusList };
  }

  clearGUserStatus(): void {
    this.g_userStatusList = {};
  }

  setUserBalance(a_nUserKey: string, a_fBalance: number): any {
    this.g_userStatusList[a_nUserKey] = {
      balance: { value: a_fBalance, version: Date.now() },
    };
    return this.g_userStatusList[a_nUserKey];

    // 原來的方法 nVersion 沒有使用
    // 都只有進行 g_userStatusList[ a_nUserKey ] = { balance: { value: a_fBalance, version: Date.now() } };
    // if( g_userStatusList.hasOwnProperty( a_nUserKey ) )
    //     {
    //         let nVersion = g_userStatusList[ a_nUserKey ].balance.version;

    //         if( a_fBalance != g_userStatusList[ a_nUserKey ].balance.value )
    //             nVersion++;

    //         g_userStatusList[ a_nUserKey ] = { balance: { value: a_fBalance, version: Date.now() } };
    //     }
    //     else
    //         g_userStatusList[ a_nUserKey ] = { balance: { value: a_fBalance, version: Date.now() } };

    //     return g_userStatusList[ a_nUserKey ];
  }

  // /**
  //  * create trans id
  //  * @returns string
  //  */
  // createTransID() {
  //     //	한국기준시간, new로 직접 숫자로 지정할때만 한국시간이 적용된다
  //     const g_nDefTime = (new Date(2021, 10, 28, 9, 0, 0, 0)).getTime();

  //     const timeMsOfDay = this.configService.get<number>('TIME_MS_OF_DAY') ?? 86400000
  //     return (
  //         [Math.floor((Date.now() - g_nDefTime) / timeMsOfDay),
  //         this.numberPad((g_pm_id || 0) % 100, 2),
  //         this.numberPad(Math.floor(Date.now() % timeMsOfDay / 1000), 5),
  //         this.numberPad(Math.floor(process.hrtime()[1] / 100), 8)].join(""));
  // }

  // /**
  //  * number padding
  //  * @param a_nValue number
  //  * @param a_nWidth number
  //  * @returns string
  //  */
  // numberPad(a_nValue: number, a_nWidth: number): string {
  //     let strValue = (Math.pow(10, a_nWidth) + a_nValue);
  //     return strValue.toString().substr(1);
  // }

  /**
   * build grpc process request
   * @param params
   * @returns ProcessRequest
   */
  buildProcessRequest(params: {
    body: any;
    callbackType: CallbackType;
    objUser: UserObj;
    objThirdParty: objThirdParty;
    objData: ObjData;
    lang?: Lang;
  }): ProcessRequest {
    const {
      body,
      callbackType,
      objUser,
      objThirdParty,
      objData,
      lang = Lang.ko,
    } = params;

    return {
      callback_type: callbackType,
      lang,
      obj_third_party: objThirdParty,
      obj_user: objUser,
      obj_data: objData,
      trace_id: uuidv4(),
    };
  }

  /**
   * get null obj thirdparty
   * @returns objThirdParty
   */
  getNullObjThirdparty(): objThirdParty {
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

  /**
   * hot code for stating test.
   * @param list
   */
  attachStating(list: any[]) {
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

  /**
   * load table list by cp key
   * @param cpKey cp key
   */
  async loadTableListByCPKey(cpKey: number): Promise<void> {
    if (!cpKey) return;
    const url = [
      Config.SP_SERVER_URL.GAMECODE,
      `game/codelist/get?prod=`,
      Config.APP_ENV === "PROD" ? "1" : "0",
      "&cpkey=",
      cpKey.toString(),
    ].join("");
    const apiResObj = await this.apiService.api("get", url, {}, {});

    if (apiResObj && apiResObj.list) {
      if (process.env.APP_ENV === "staging" || process.env.APP_ENV === "local")
        this.attachStating(apiResObj.list);
      this.updateTableList(cpKey.toString(), apiResObj.list);
    } else {
      // for test
      // if (Config.CONFIG_NAME === 'local') {
      //     const filePath = path.join(process.cwd(), 'assets/exampleTableList.json');
      //     const rawData = fs.readFileSync(filePath, 'utf-8');
      //     const apiResObj = JSON.parse(rawData);
      //     this.updateTableList(cpKey.toString(), apiResObj.list);
      // }
    }
  }

  /**
   * get table list by cp key
   * @param cpKey cp key
   * @returns table list
   */
  async getTableListByCPKey(cpKey: number): Promise<any> {
    let result: any;
    if (!cpKey) return;
    const url = [
      Config.SP_SERVER_URL.GAMECODE,
      `game/codelist/get?prod=`,
      Config.APP_ENV === "PROD" ? "1" : "0",
      "&cpkey=",
      cpKey.toString(),
    ].join("");
    const apiResObj = await this.apiService.api("get", url, {}, {});
    if (apiResObj && apiResObj.list) result = apiResObj.list;
    return result;
  }

  /**
   * get trace code
   * @returns trace code
   */
  getTraceCode(): string {
    return [this.numberPad((Date.now() % 1000) + 1, 4), uuidv4()].join("-");
  }

  /**
   * number padding
   * @param a_nValue
   * @param a_nWidth
   * @returns
   */
  numberPad(a_nValue: number, a_nWidth: number): string {
    let strValue = Math.pow(10, a_nWidth) + a_nValue;
    return strValue.toString().substr(1);
  }

  /**
   * get version from url
   * @param a_strUrl url
   * @returns version
   */
  getVersionFromUrl(a_strUrl: string): number {
    let nFind = a_strUrl.indexOf("/v");
    if (nFind != -1) {
      let nVer = parseInt(a_strUrl.substr(nFind + 2, 1));
      if (isNaN(nVer)) return 1;
      else return nVer;
    } else return 1;
  }

  /**
   * get data game list
   * @param a_bUseViewUrl use view url
   * @returns data game list
   */
  async LoadGameCPList(a_bUseViewUrl: boolean) {
    const listData = await this.accessCodeDao.getDataGameList(a_bUseViewUrl);
    // console.info('LoadGameCPList >>>>>> ', listData)
    this.setGCpList(listData ?? []);
  }

  /**
   * get default splash list
   * @param splashDefName splash def name
   * @returns default splash list
   */
  async getDefSplashList(splashDefName: string) {
    const row = await this.accessCodeDao.getDefSplashList(splashDefName);
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
   * is IP get by develop conversion
   * @param ip ip
   * @returns ip
   */
  getVpnIpIfNonProd(ip: string) {
    const _strlocal = "local";
    if (process.env.APP_ENV === _strlocal) {
      return Config.VPN_IP;
    }
    return ip;
  }

  /**
   * Get user info by user id
   * @param userId
   * @returns
   */
  getUserInfo(userId: string): Promise<any> {
    return this.accessCodeDao.getUserInfoByUserId(userId);
  }

  /**
   * Convert gRPC error status to text
   * @param provider provider name
   * @param code gRPC error status code
   * @returns string
   */
  convertGrpcErrorStatusToText(provider: Provider, code: number): string {
    return Config.GRPC_RES_STATUS_MAP[provider][code] || Status.UNKNOWN_ERROR;
  }

  getUserIdByUserKey(userKey: number): Promise<any> {
    return this.accessCodeDao.getUserIdByUserKey(userKey);
  }
}
