import { Injectable } from "@nestjs/common";
import { CxUser, OperatorRow } from "./Interface/play.dao.interface";
import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
import { Config } from "src/Config/config";
import { GetAccount } from "./Interface/play.interface";

@Injectable()
export class PlayDao extends MysqlBaseDao {
  /**
   * get operator game info
   * @param opId operator id
   * @returns operator game info
   */
  async getOperatorGameInfo(opId: number) {
    const sql = `   
            SELECT 
                operator_uuid, wallet_type, _o.operator_id, callback_member, 
                callback_balance, callback_bet, callback_result, callback_cancel, 
                callback_tip 
            FROM tbl_operator_config AS _oc INNER JOIN tbl_operator AS _o 
                ON _oc.operator_id=_o.operator_id 
            WHERE _o.idx=?
        `;
    const params = [opId];
    const rows = await this.query<OperatorRow>(sql, params);
    return rows[0] ?? null;
  }

  /**
   * get cp account
   * @param opId operator id
   * @param cpKey cp key
   * @returns cp account
   */
  async getCPAccount(opId: number, cpKey: number): Promise<GetAccount | null> {
    const sql = `
            SELECT 
                gcp_account_id account, 
                gcp_account_password password 
            FROM cx_game_cp_account 
            WHERE operator_id=? 
                AND gcp_key=? 
            LIMIT 1
        `;
    const params = [opId, cpKey];
    const rows = await this.query(sql, params);
    return (rows[0] as GetAccount) ?? null;
  }
}
