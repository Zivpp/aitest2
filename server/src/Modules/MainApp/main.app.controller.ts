import { Body, Controller, Get, Ip, Query, Req, Res } from "@nestjs/common";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import apiPath from "src/Config/api.path";
import { ApiOperation } from "@nestjs/swagger";
import * as _ from "lodash";
import {
  AccountResponse,
  CreateAccountData,
  CreateAccountResponse,
  CurrentRResponse,
  GameListResponse,
  LogGetDto,
  LogGetResponse,
  PlayResponse,
  ProvListData,
  ProvListItem,
  ProvListResponse,
  TablelistResponse,
  Top30Response,
} from "./Interface/main.app.interface";
import { Config } from "src/Config/config.local";
import { MainAppService } from "./main.app.service";
import { SUCCESS, FAILED } from "src/Config/result.code";
import {
  AccountDto,
  CreateAccountDto,
  GamelistDto,
  HashDto,
  PlayDto,
  ProvlistDto,
  TablelistDto,
} from "./Dto/main.app.dto";
import { CxUser, TblOperator } from "./Interface/main.app.dao.interface";
import { request } from "http";
import { v4 as uuidv4 } from "uuid";
import { time } from "console";

@Controller()
export class MainAppController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly mainAppService: MainAppService,
  ) {}

  @Get([apiPath.mainApp.getIp, apiPath.mainApp.v2.getIp])
  @ApiOperation({
    summary: "get IP",
  })
  async getIp(@Req() req, @Res() res): Promise<string> {
    const ip = this.accessCodeService.getReqIP(req);
    return res.send(ip);
  }

  @Get([apiPath.mainApp.hash, apiPath.mainApp.v2.hash])
  @ApiOperation({
    summary: "hash",
  })
  async hash(@Req() req, @Res() res, @Query() query: HashDto): Promise<any> {
    const queryObj: HashDto = query;
    const md5hash = this.mainAppService.getMd5Hash(queryObj.opkey, req.query);
    const md5encHash = this.mainAppService.getMd5EncHash(
      queryObj.opkey,
      req.query,
    );
    return res.send({
      md5hash,
      md5encHash,
      isMd5hash: md5hash === queryObj.hash,
      isMd5encHash: md5encHash === queryObj.hash,
      query,
    });
  }

  @Get([apiPath.mainApp.account, apiPath.mainApp.v2.account])
  @ApiOperation({
    summary: "account",
  })
  async account(
    @Req() req,
    @Res() res,
    @Query() query: AccountDto,
  ): Promise<AccountResponse> {
    const result = <AccountResponse>{};
    const strReqOPKey = query.opkey || null,
      strReqUserId = query.userid || null,
      strReqHash = query.hash || null,
      strRequestIP = this.accessCodeService.getReqIP(req);

    // console.info('[/account] strRequestIP = ', strRequestIP);

    if (!strReqOPKey || !strReqUserId || !strReqHash) {
      // U0002
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", 100);
      return res.send(result);
    }

    if (strReqOPKey.length !== Config.MAX_UUID_SIZE) {
      // U0002
      result.result = 101;
      result.msg = this.mainAppService.getResultMsg("-", 101);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0003
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", 10000);
      return res.send(result);
    }

    // get from DB
    const operatorInfo = await this.mainAppService.getOperatorInfo(
      strReqOPKey,
      strRequestIP,
    );
    if (!operatorInfo) {
      // U0004
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    const userInfo = await this.mainAppService.findUserByOperatorAndUserIdOrg(
      operatorInfo?.idx.toString(),
      strReqUserId,
    );
    if (!userInfo) {
      // U0005
      result.result = 10001;
      result.msg = this.mainAppService.getResultMsg("-", 1001);
      return res.send(result);
    }

    // success
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

  @Get([apiPath.mainApp.create_account, apiPath.mainApp.v2.create_account])
  @ApiOperation({
    summary: "create_account",
  })
  async createAccount(
    @Req() req,
    @Res() res,
    @Query() query: CreateAccountDto,
  ): Promise<CreateAccountResponse> {
    const result = <CreateAccountResponse>{};
    const strReqOPKey = query.opkey || null,
      strReqUserId = query.userid || null,
      strReqUserNick = query.nick || null,
      strReqHash = query.hash || null,
      strRequestIP = this.accessCodeService.getReqIP(req);

    if (!strReqOPKey || !strReqUserId || !strReqHash) {
      // U0012
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", 100);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0013
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", 10000);
      return res.send(result);
    }

    const operatorInfo = await this.mainAppService.getOperatorInfo(
      strReqOPKey,
      strRequestIP,
    );
    if (!operatorInfo) {
      // new
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    const newUserObject = <CxUser>{};
    newUserObject.user_nick_org = strReqUserNick
      ? strReqUserNick
      : strReqUserId;
    newUserObject.user_id_org = strReqUserId;
    const newUser = await this.mainAppService.createUser(
      operatorInfo?.idx.toString(),
      strReqUserId,
      newUserObject,
      1,
    );

    if (!newUser) {
      // U0015
      result.result = 10002;
      result.msg = this.mainAppService.getResultMsg("-", 10002);
      return res.send(result);
    }

    // success
    result.result = 1;
    result.msg = this.mainAppService.getResultMsg("-", 1);
    const resultDate = <CreateAccountData>{};
    resultDate.id = newUser.user_id ?? "";
    resultDate.nick = newUser.user_nick ?? "";
    resultDate.betskin = query.bet_skin_group ?? "";
    result.data = resultDate;

    return res.send(result);
  }

  @Get([apiPath.mainApp.provlist, apiPath.mainApp.v2.provlist])
  @ApiOperation({
    summary: "provlist",
  })
  async provlist(
    @Req() req,
    @Res() res,
    @Query() query: ProvlistDto,
  ): Promise<ProvListResponse> {
    const result = <ProvListResponse>{};
    result.ver = 1;
    let strReqOPKey = req.query.opkey || null,
      strReqHash = req.query.hash || null,
      strRequestIP = this.accessCodeService.getReqIP(req);

    if (!strReqOPKey || strReqOPKey === "") {
      // U0012
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", 100);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0013
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", 10000);
      return res.send(result);
    }

    const operatorInfo = await this.mainAppService.getOperatorInfo(
      strReqOPKey,
      strRequestIP,
    );
    if (!operatorInfo) {
      // U0014
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    result.result = SUCCESS;
    result.msg = this.mainAppService.getResultMsg("-", SUCCESS);
    const list = await this.mainAppService.getCPList();
    const provListData = <ProvListData>{ list: list };
    result.data = provListData;

    return res.send(result);
  }

  @Get([apiPath.mainApp.gamelist, apiPath.mainApp.v2.gamelist])
  @ApiOperation({
    summary: "gamelist",
  })
  async gamelist(
    @Req() req,
    @Res() res,
    @Query() query: GamelistDto,
  ): Promise<GameListResponse> {
    const result = <GameListResponse>{};
    result.ver = 1;
    let strReqOPKey = query.opkey || null,
      strThirdPartyCode = query.thirdpartycode || "",
      strReqHash = query.hash || "",
      bReqUseTableType = (query?.use_tabletype || 0) == 1,
      strRequestIP = this.accessCodeService.getReqIP(req);

    if (!strReqOPKey || strReqOPKey === "") {
      // U0012
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", 100);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0013
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", 10000);
      return res.send(result);
    }

    const operatorInfo = await this.mainAppService.getOperatorInfo(
      strReqOPKey,
      strRequestIP,
    );
    if (!operatorInfo) {
      // U0014
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    try {
      let searchResult;
      if (bReqUseTableType) {
        searchResult = await this.mainAppService.getGameListTableType(
          strThirdPartyCode,
          1,
        );
      } else {
        searchResult = await this.mainAppService.getGameList(
          strThirdPartyCode,
          1,
        );
      }

      result.result = SUCCESS;
      result.msg = this.mainAppService.getResultMsg("-", SUCCESS);
      result.data = searchResult;
    } catch (error) {
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    return res.send(result);
  }

  @Get(apiPath.mainApp.v2.gamelist_new)
  @ApiOperation({
    summary: "gamelist_new",
  })
  async gamelist_new(
    @Req() req,
    @Res() res,
    @Query() query: GamelistDto,
  ): Promise<GameListResponse> {
    const result = <any>{};
    result.ver = 1;
    let strReqOPKey = query.opkey || null,
      // strThirdPartyCode = query.thirdpartycode || '',
      strReqHash = query.hash || "",
      // bReqUseTableType = ((query?.use_tabletype || 0) == 1),
      strRequestIP = this.accessCodeService.getReqIP(req);

    if (!strReqOPKey || strReqOPKey === "") {
      // U0012
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", 100);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0013
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", 10000);
      return res.send(result);
    }

    const operatorInfo = await this.mainAppService.getOperatorInfo(
      strReqOPKey,
      strRequestIP,
    );
    if (!operatorInfo) {
      // U0014
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    try {
      result.result = SUCCESS;
      result.msg = this.mainAppService.getResultMsg("-", SUCCESS);
      result.data = await this.mainAppService.getNewGameList();
    } catch (error) {
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    return res.send(result);
  }

  @Get([apiPath.mainApp.Game.tablelist, apiPath.mainApp.v2.Game.tablelist])
  @ApiOperation({
    summary: "tablelist",
  })
  async gameTablelist(@Req() req, @Res() res): Promise<TablelistResponse> {
    const result = <TablelistResponse>{};
    result.result = SUCCESS;
    result.data = null;

    const checkResponse = await this.mainAppService.checkParams(req); // need ip, so query not used
    result.result = checkResponse.result;
    result.msg = this.mainAppService.getResultMsg("-", checkResponse.result);

    if (checkResponse.result !== SUCCESS) {
      return res.send(result);
    }

    const list = await this.accessCodeService.getTableListByCPKey(
      req.query.thirdpartycode,
    );
    if (!list) {
      result.result = FAILED;
      result.msg = "오류가 발생했습니다";
      return res.send(result);
    }

    result.data = list;

    return res.send(result);
  }

  @Get([apiPath.mainApp.play, apiPath.mainApp.v2.play])
  @ApiOperation({
    summary: "play",
  })
  async play(
    @Req() req,
    @Res() res,
    @Query() query,
    a_nVersion: number = 0,
  ): Promise<PlayResponse> {
    // const test = await this.mainAppService.test(req);
    // console.log('test = ', test)

    const result = <PlayResponse>{};
    result.result = SUCCESS;

    let nResult = SUCCESS,
      nVer =
        a_nVersion == 0
          ? this.accessCodeService.getVersionFromUrl(req.url)
          : a_nVersion;

    let strReqOPKey = query.opkey || null,
      strReqUserId = query.userid || null,
      strThirdPartyCode = query.thirdpartycode || null,
      strGameCode = query.gamecode || null,
      // strGameID = query.gameid || null,
      strReqHash = query.hash || null,
      strDevice = query.platform || Config.DEVICE.pc,
      strReqUserrIP = query.ip || null,
      strCurrency = query.currency || null,
      strBetLimitType = query.bet_limit || 0,
      strLanaguage = req.query.lang || null,
      strRequestIP = this.accessCodeService.getReqIP(req),
      strUserAgent = req.headers["user-agent"] || null,
      strSiteUrl = req.query.returnUrl || req.query.return_url || null,
      strCustomerValue = req.query.customervalue || null,
      strSrcTrace = this.accessCodeService.getTraceCode();
    // nOPID = 0;

    if (
      !strReqOPKey ||
      !strReqUserId ||
      !strThirdPartyCode ||
      !strGameCode ||
      !strReqHash
    ) {
      // U0103
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", 100);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0103
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", 10000);
      return res.send(result);
    }

    const procChkOperatorIp =
      this.accessCodeService.getVpnIpIfNonProd(strRequestIP);
    const operator = await this.mainAppService.procChkOperator(
      strReqOPKey,
      procChkOperatorIp,
    );
    if (!operator) {
      // U0104
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    const reqCxUser = <CxUser>{};
    reqCxUser.user_id_org = strReqUserId;
    reqCxUser.user_nick_org = strReqUserId;
    const cUser = await this.mainAppService.createUser(
      operator.id.toString(),
      strReqUserId,
      reqCxUser,
      nVer,
    );
    if (!cUser) {
      // U0105 | 존재하지 않는 회원
      result.result = 10001;
      result.msg = this.mainAppService.getResultMsg("-", 10);
      return res.send(result);
    }

    if (operator.wallet_type == Config.WALLET_TYPE.TRANSFER)
      await this.mainAppService.getTransferBalance(
        operator.id.toString(),
        operator.key,
        cUser.user_key.toString(),
        cUser.user_id,
      );

    //	코드매칭 & change
    const strGameMTCode = await this.mainAppService.getGameMTCode(
      strThirdPartyCode,
      strGameCode,
    );
    if (!strGameMTCode) strGameCode = strGameMTCode;

    // 게임사체크
    try {
      nResult = await this.mainAppService.checkGamePermit(
        operator.id,
        parseInt(strThirdPartyCode),
        strGameCode,
      );
    } catch (error) {
      console.error("[play][게임사체크]");
      console.error(error);
    }
    if (nResult !== SUCCESS) {
      // U0107 게임권한 오류
      result.result = 0;
      result.msg = this.mainAppService.getResultMsg("-", 0);
      return res.send(result);
    }

    // move
    if (strCustomerValue)
      strCustomerValue = strCustomerValue
        .toString()
        .slice(0, Config.MAX_CUSTOMER_VALUE_LEN);

    cUser.sign = uuidv4().replace(/-/g, "");
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
    if (Config.SPLASH_USE && objCPItem?.splash_use) {
      const result = await this.mainAppService.UseSplashProcess(
        operator,
        objPlayData,
        cUser,
      );
      return res.send(result); //*END
    } else {
      // todo
      const result = await this.mainAppService.NoUseSplashProcess(
        operator,
        objPlayData,
        cUser,
      );
      return res.send(result); //*END
    }

    // final build ?? there is not run
    // const defaultResult = {
    //     result: result,
    //     ver: nVer,
    //     msg: [this.mainAppService.getResultMsg("-", nResult), strAddErrorMsg].join("")
    // }
    // return res.send(defaultResult); //*END
  }

  @Get([apiPath.mainApp.current.r, apiPath.mainApp.v2.current.r])
  @ApiOperation({
    summary: "current/r",
  })
  async currentR(
    @Req() req,
    @Res() res,
    @Query() query,
    a_nVersion: number = 0,
  ): Promise<CurrentRResponse> {
    const result = <CurrentRResponse>{};
    result.result = SUCCESS;
    result.ver =
      a_nVersion == 0
        ? this.accessCodeService.getVersionFromUrl(req.url)
        : a_nVersion;
    result.data = { r: 0 };

    const strReqOPKey = query.opkey || null;
    const strReqHash = query.hash || null;
    const strRequestIP = this.accessCodeService.getReqIP(req);

    if (!strReqOPKey) {
      // U0012
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", result.result);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0013
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", result.result);
      return res.send(result);
    }

    const gCurrentR = this.accessCodeService.getGCurrentR(strReqOPKey);
    if (gCurrentR && Date.now() - gCurrentR.time < 3000) {
      result.data = { r: gCurrentR[strReqOPKey].r };
    } else {
      // Expired ; reset current R
      const ip = this.accessCodeService.getVpnIpIfNonProd(strRequestIP);
      const operator = await this.mainAppService.procChkOperator(
        strReqOPKey,
        ip,
      );
      if (!operator) {
        // U0104
        result.result = 4001;
        result.msg = this.mainAppService.getResultMsg("-", result.result);
        return res.send(result);
      }
      const newR = await this.mainAppService.getR(operator.id);
      if (!newR) {
        // U0104
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

    // final build
    result.msg = this.mainAppService.getResultMsg("-", result.result);
    return res.send(result);
  }

  @Get([apiPath.mainApp.hotgames.top30, apiPath.mainApp.v2.hotgames.top30])
  @ApiOperation({
    summary: "hotgames/top30",
  })
  async top30(
    @Req() req,
    @Res() res,
    @Query() query,
    a_nVersion: number = 0,
  ): Promise<Top30Response> {
    const result = <Top30Response>{};
    result.result = SUCCESS;
    result.data = {
      list: [],
    };
    const strReqOPKey = query.opkey || null;
    const strReqHash = query.hash || null;

    if (!strReqOPKey || !strReqHash) {
      // U0012
      result.result = 100;
      result.msg = this.mainAppService.getResultMsg("-", result.result);
      return res.send(result);
    }

    if (
      !this.mainAppService.checkQueryString(strReqOPKey, req.query, strReqHash)
    ) {
      // U0013
      result.result = 10000;
      result.msg = this.mainAppService.getResultMsg("-", result.result);
      return res.send(result);
    }

    // const topRank30 = await this.mainAppService.getTopRank30(); // todo 好像要讀取檔案？
    // result.data = { list: topRank30.list }
    result.msg = this.mainAppService.getResultMsg("-", result.result);
    return res.send(result);
  }

  @Get([apiPath.mainApp.log.get, apiPath.mainApp.v2.log.get])
  @ApiOperation({
    summary: "log/get",
  })
  async logGet(
    @Req() req,
    @Res() res,
    @Query() query,
    a_nVersion: number = 0,
  ): Promise<LogGetResponse> {
    const queryObj: LogGetDto = query;
    const result = <LogGetResponse>{};
    result.result = SUCCESS;
    result.data = {
      link: "",
    };

    const objCheckResult = await this.mainAppService.checkParams(req);
    const objResult = {
      result: objCheckResult.result,
      msg: this.mainAppService.getResultMsg("-", objCheckResult.result),
    };

    if (objResult.result !== SUCCESS) {
      return res.send(objResult);
    }

    if (!queryObj?.roundid) {
      result.result = FAILED;
      result.msg = this.mainAppService.getResultMsg("-", result.result);
      return res.send(result);
    }

    const logResult = await this.mainAppService.getBetLog(
      queryObj.opkey,
      queryObj.roundid,
    );
    if (!logResult) {
      result.result = FAILED;
      result.msg = "존재하지 않는 round 입니다.";
      return res.send(result);
    }

    const gCpList = this.accessCodeService.getFullGCpList();
    let objCPData = gCpList?.list.find(
      (x) => x.code == logResult.third_party_code,
    );
    if (!objCPData || !objCPData?.view_url || objCPData?.view_url === "") {
      result.result = FAILED;
      result.msg = "지원하지 않습니다.";
      return res.send(result);
    }

    let strUserID = await this.accessCodeService.getUserIdByUserKey(
      logResult.user_key,
    );
    if (!strUserID) {
      result.result = FAILED;
      result.msg = "존재하지 않는 user 입니다.";
      return res.send(result);
    }

    const logCallingRes = await this.mainAppService.logCalling(
      strUserID,
      objCPData,
      objCheckResult,
      logResult,
    );
    if (!logCallingRes || logCallingRes.statusCode !== 200) {
      result.result = FAILED;
      result.msg = "로그 호출 실패";
      return res.send(result);
    }

    const objLogData = JSON.parse(logCallingRes.body);
    if (objLogData.result !== SUCCESS) {
      result.result = FAILED;
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
      result.result = FAILED;
      result.msg = "게임사 요청 실패[3]";
      return res.send(result);
    }

    result.data.link = [
      Config.LOG_VIEW_SERVER_URL_GET,
      "?key=",
      logViewResult.body,
    ].join("");
    result.msg = this.mainAppService.getResultMsg("-", result.result);
    return res.send(result);
  }
}
