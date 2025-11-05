import { Injectable } from "@nestjs/common";
import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
import { Config } from "src/Config/config";
import {
  BetLogRes,
  COperatorGameInfo,
  CxGameCp,
  CxUser,
  GameRow,
  GameV1,
  GameV2,
  HotRow,
  ProcChkOperator,
  ProcChkOperatorRow,
  TblOperator,
  TblOperatorRow,
} from "./Interface/main.app.dao.interface";
import { Operator } from "./Interface/main.app.interface";
import { SUCCESS } from "src/Config/result.code";

@Injectable()
export class MainAppDao extends MysqlBaseDao {
  /**
   * get user by op id and user id org
   * @param opId operator id
   * @param userIdOrg user id org
   * @returns user info
   */
  async getUserByOpIdAndUserIdOrg(
    opId: string,
    userIdOrg: string,
  ): Promise<CxUser | null> {
    if (!opId || !userIdOrg) {
      return null;
    }
    const sql = `   
            SELECT 
                user_key, user_id, user_id_org, user_name, user_nick, user_nick_org, op_id, cash
            FROM cx_user
            WHERE op_id = ?
            AND user_id_org = ?
            `;
    const params = [opId, userIdOrg];
    const rows = await this.query<CxUser>(sql, params);
    return rows[0] ?? null;
  }

  /**
   * insert user
   * @param dataObj
   * @returns
   */
  async insertUser(dataObj: CxUser): Promise<any> {
    const sql = `
            INSERT INTO cx_user (
                user_key, user_id, user_id_org, user_name,
                user_nick, user_nick_org, op_id
            ) VALUES (
                NULL, ?, ?, ?, ?, ?, ?
            )
            `;
    const params = [
      dataObj.user_id,
      dataObj.user_id_org,
      dataObj.user_name,
      dataObj.user_nick,
      dataObj.user_nick_org,
      dataObj.op_id,
    ];
    const result = await this.query(sql, params);
    return result;
  }

  async getOperatorInfo(
    opkey: string,
    ip: string,
  ): Promise<TblOperator | null> {
    // only for dev test
    if (process.env.APP_ENV === "local") {
      ip = Config.VPN_IP;
    }
    console.info("[getOperatorInfo][opkey] = ", opkey);
    console.info("[getOperatorInfo][ip] = ", ip);

    const sql = "CALL proc_chk_operator(?, ?, @result)";
    const [result] = await this.pool.query(sql, [opkey, ip]);
    // console.info('resultSets = ', result)

    // 檢查是否成功 ; error sample =  [{ _RESULT: 4010 }]
    if (!result || !result[0][0]?._RESULT || result[0][0]?._RESULT !== 1) {
      return null;
    }

    const resultOb: ProcChkOperatorRow = result[0][0];
    const operator = <TblOperator>{};
    operator.idx = resultOb.OPERATOR_ID ?? 0;
    operator.nickname = resultOb.OPERATOR_NAME ?? "";
    operator.uuid = opkey;
    operator.wallet_type = resultOb.WALLET_TYPE ?? "";
    operator.qt_level = resultOb.QT_LEVEL ?? null;
    operator.use_splash = resultOb.USE_SPLASH ?? 0;

    return operator;
  }

  /**
   * update user id by user key
   * @param userKey user key
   * @param newUserId new user id
   * @returns
   */
  async updateUserIdByKey(
    tableName: string,
    updateObj: any,
    conditionStr: string,
    whereObj: any,
  ) {
    return this.inTx(async (conn) => {
      return this.updateByObject(tableName, updateObj, conditionStr, whereObj, {
        conn,
      });
    });
  }

  /**
   * get cp list
   * @param a_bUseViewUrl use view url
   * @returns cp list
   */
  async getCPList(a_bUseViewUrl = false) {
    const result: CxGameCp[] = [];
    const sql = `
            SELECT 
                gcp_key, gcp_name, game_type, result_url, use_splash
            FROM  cx_game_cp
            WHERE  is_use = 1
            ORDER BY gcp_key;
        `;
    const rows: any[] = await this.query(sql);
    if (rows && rows.length > 0) {
      for (const row of rows) {
        const item: CxGameCp = {
          code: row.gcp_key,
          name: row.gcp_name,
          type: row.game_type,
        };

        if (a_bUseViewUrl) {
          item.view_url = row.result_url;
          item.use_splash = row.use_splash;
        }
        result.push(item);
      }
    }

    return result;
  }

  /**
   * get game list
   * @param cpkey cp key
   * @returns game list
   */
  async getGameList(cpkey: number, version: number): Promise<any> {
    // SQL 定義
    const sqlHot = `
            SELECT game_code, pos
            FROM cx_game_cp_hot_list
            WHERE game_cp_key = ?
            `;
    const sqlGame = `
            SELECT
                game_code,
                game_id,
                game_name_eng,
                game_name_kor,
                game_type,
                table_type,
                is_lobby + 0  AS is_lobby,
                is_desktop + 0 AS is_desktop,
                is_mobile + 0  AS is_mobile,
                img_1,
                game_reg_date
            FROM cx_game
            WHERE game_cp_key = ? AND is_use = 1
            ORDER BY pos
            `;

    // 並行查詢
    const [[hotRows], [gameRows]] = await Promise.all([
      this.query<HotRow[]>(sqlHot, [cpkey]),
      this.query<GameRow[]>(sqlGame, [cpkey]),
    ]);

    console.log(`hotRows >>>`, hotRows);
    console.log(`gameRows >>>`, gameRows);

    if (!hotRows || !gameRows) {
      throw new Error(
        !hotRows
          ? "getGameList: hotRows is null or undefined"
          : "getGameList: gameRows is null or undefined",
      );
    }

    // 轉 Map：game_code -> pos
    const hotMap = new Map<string, number>();
    for (const h of hotRows ?? []) {
      // 如果 DB 的 pos 是 1-based，而你要用陣列索引，請改為 (h.pos - 1)
      hotMap.set(h.game_code, h.pos);
    }

    // 轉換每一筆遊戲成輸出格式
    const list: GameItem[] = [];
    for (const r of gameRows ?? []) {
      const base = {
        code: r.game_code,
        id: r.game_id,
        type: r.game_type,
        is_lobby: !!r.is_lobby,
        is_desktop: !!r.is_desktop,
        is_mobile: !!r.is_mobile,
        date: r.game_reg_date,
        table:
          r.game_type === Config.GAMECODE.LIVE
            ? { type: r.table_type ?? "", is_lobby: !!r.is_lobby }
            : null,
      };

      if (version === 2) {
        const item: GameV2 = {
          ...base,
          name: { eng: r.game_name_eng, kor: r.game_name_kor },
          thumbnail: { default: r.img_1 ?? "" },
        };
        list.push(item);
      } else {
        const item: GameV1 = {
          ...base,
          name_eng: r.game_name_eng,
          name_kor: r.game_name_kor,
          img_1: r.img_1 ?? "",
        };
        list.push(item);
      }
    }

    // 依 hotMap 組熱門陣列（索引 = pos）
    type GameItem = GameV1 | GameV2;
    const hotSparse: GameItem[] = [];
    for (const g of list) {
      const pos = hotMap.get(g.code);
      if (typeof pos === "number") {
        hotSparse[pos] = g; // 若 pos 為 1-based，請改 hotSparse[pos - 1] = g;
      }
    }

    // 壓縮空洞（若需要保持對位就回傳 hotSparse）
    const hot = hotSparse.filter(Boolean) as GameItem[];

    return { list, hot };
  }

  /**
   * get operator by uuid
   * @param uuid operator uuid
   * @returns operator info
   */
  async getTblOperatorByUuid(uuid: string): Promise<Operator | null> {
    const sql = `
            SELECT 
                idx, uuid, wallet_type, qt_level, use_splash
            FROM tbl_operator
            WHERE uuid = ?
            `;
    const params = [uuid];
    const rows = await this.query<TblOperatorRow>(sql, params);

    // 檢查 rows 是否有值
    if (!rows || rows.length === 0) {
      return null;
    }

    const rowData = rows[0];
    const result = <Operator>{};
    result._RESULT = SUCCESS;
    result.id = rowData.idx;
    result.key = rowData.uuid;
    result.wallet_type = rowData.wallet_type;
    result.qt_level = rowData.qt_level;
    result.use_splash = rowData.use_splash;
    return result;
  }

  /**
   * check operator | custom
   * @param opkey operator key
   * @param ip ip
   * @returns operator info
   */
  async procChkOperator(opkey: string, ip: string): Promise<Operator | null> {
    const sql = "CALL proc_chk_operator(?, ?, @result)";
    const params = [opkey, ip];
    const rows = await this.query<ProcChkOperator>(sql, params);
    const resPCO = rows[0][0]?._RESULT === 1 ? rows[0][0] : null;
    const result = <Operator>{};
    if (resPCO) {
      result._RESULT = resPCO._RESULT || 0;
      result.id = resPCO.OPERATOR_ID || 0;
      result.name = resPCO.OPERATOR_NAME || "";
      result.key = opkey;
      result.wallet_type = resPCO.WALLET_TYPE || "";
      result.qt_level = resPCO.QT_LEVEL || 0;
      result.use_splash = resPCO.USE_SPLASH || 0;
    } else {
      return null;
    }
    return result;
  }

  /**
   * call proc_chk_operator (pure)
   * @param opkey operator key
   * @param ip ip
   * @returns result
   */
  async callProcChkOperator(
    opkey: string,
    ip: string,
  ): Promise<Operator | null> {
    const sql = "CALL proc_chk_operator(?, ?, @result)";
    const params = [opkey, ip];
    const rows = await this.query<ProcChkOperator>(sql, params);
    const result = rows[0][0]?._RESULT === 1 ? rows[0][0] : null;
    return result;
  }

  /**
   * get game mt code
   * @param strThirdPartyCode third party code
   * @param strGameCode game code
   * @returns game mt code
   */
  async getGameMTCode(strThirdPartyCode: string, strGameCode: string) {
    const sql = `
            SELECT 
                game_mt_code 
            FROM cx_game_mt 
            WHERE 
                game_cp_key=? AND game_code=?`;
    const params = [strThirdPartyCode, strGameCode];
    const rows = await this.query(sql, params);
    // 檢查 rows 是否有值
    if (!rows || rows.length === 0 || !rows[0]?.game_mt_code) {
      return null;
    }

    return rows[0].game_mt_code;
  }

  /**
   * check game permit
   * @param a_nOPID operator id
   * @param a_nGameCPKey game cp key
   * @param a_strGameCode game code
   * @returns result code
   */
  async checkGamePermit(
    a_nOPID: number,
    a_nGameCPKey: number,
    a_strGameCode: string,
  ) {
    const sql = `CALL proc_chk_game(?,?,?,@result)`;
    const params = [a_nOPID, a_nGameCPKey, a_strGameCode];
    const rows = await this.query(sql, params);
    // 檢查 rows 是否有值
    const nResult = parseInt(rows[0][0]?._RESULT);
    return nResult;
  }

  /**
   * get operator tree
   * @param oId operator id
   * @returns operator tree
   */
  async getOperatorTree(oId: string) {
    const sql = `
            SELECT parent_operator_tree 
            FROM tbl_operator 
            WHERE idx=?
        `;
    const params = [oId];
    const rows = await this.query(sql, params);
    // 檢查 rows 是否有值
    if (!rows || rows.length === 0 || !rows[0]?.parent_operator_tree) {
      return null;
    }

    return rows[0].parent_operator_tree;
  }

  /**
   * get operator splash info
   * @param aTree operator tree
   * @returns operator splash info
   */
  async getOperatorSplashInfo(aTree: string[]) {
    const aFilter = aTree.map((item) => `'${item}'`);
    const sql = [
      "SELECT operator_id AS op_name, use_splash FROM tbl_operator WHERE operator_id IN(",
      aFilter.join(","),
      ")",
    ].join("");
    const rows = await this.query(sql);
    return rows;
  }

  /**
   * get operator splash list by name
   * @param name operator name
   * @returns operator splash list
   */
  async getOperatorSplashList_name(name: string) {
    const sql = `
            SELECT 
                splash_name,splash_url,css_bg_color,css_img_size 
            FROM tbl_operator_splash 
            WHERE operator_id=? and is_use=1 
            ORDER BY pos LIMIT 1
        `;
    const params = [name];
    const rows = await this.query(sql, params);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  /**
   * get operator game info
   * @param oId operator id
   * @returns operator game info
   */
  async getOpratorGameInfo(oId: number) {
    const sql = `
            SELECT 
                operator_uuid, wallet_type, _o.operator_id, callback_member, 
                callback_balance, callback_bet, callback_result, callback_cancel, 
                callback_tip 
            FROM tbl_operator_config AS _oc 
                INNER JOIN tbl_operator AS _o ON _oc.operator_id=_o.operator_id 
            WHERE _o.idx=?
        `;
    const params = [oId];
    const rows = await this.query(sql, params);
    if (!rows || rows.length === 0) {
      return null;
    }
    const rowData = rows[0];
    const result = <COperatorGameInfo>{
      op_id: rowData.operator_id,
      op_key: rowData.operator_uuid,
      load_time: Date.now(),
      wallet: rowData.wallet_type,
      urls: {
        member_check: rowData.callback_member,
        balance: rowData.callback_balance,
        bet: rowData.callback_bet,
        result: rowData.callback_result,
        cancel: rowData.callback_cancel,
        tip: rowData.callback_tip,
        etc: rowData.callback_etc,
      },
    };
    return result;
  }

  /**
   * get r
   * @param opId operator id
   * @returns r
   */
  async getR(opId: number) {
    const sql = `
            SELECT cash 
            FROM tbl_operator 
            WHERE idx=?
        `;
    const params = [opId];
    const rows = await this.query(sql, params);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0].cash;
  }

  /**
   * get bet log
   * @param opkey operator key
   * @param roundId round id
   * @returns bet log
   */
  async getBetLog(opkey: number, roundId: string): Promise<BetLogRes | null> {
    const sql = [
      `SELECT 
                user_key, third_party_code, game_code,
                third_party_round_id, third_party_trans_id, times 
            FROM bet_`,
      opkey,
      "WHERE round_id=",
      roundId,
      " LIMIT 1",
    ].join("");
    const params = [opkey, roundId];
    const rows = await this.query(sql, params);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0] as BetLogRes;
  }

  /**
   * get new game list
   * @returns new game list
   */
  async getNewGameList() {
    const sql = `
            SELECT 
                game_id, game_code, game_name_eng, game_name_kor, game_type, is_desktop+0 AS is_desktop,
                is_mobile+0 AS is_mobile, img_1, game_reg_date
            FROM cx_game_new
            ORDER BY game_cp_key
        `;
    const rows = await this.query(sql);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows;
  }
}
