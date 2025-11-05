import { Injectable } from "@nestjs/common";
import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
import { GetDataGameListRes } from "./interface/access.code.service.interface";
import { CxUser } from "src/Modules/MainApp/Interface/main.app.dao.interface";

@Injectable()
export class AccessCodeDao extends MysqlBaseDao {
  async getDataGameList(a_bUseViewUrl = false) {
    const sql = `
            SELECT 
                gcp_key, gcp_name, game_type, result_url, use_splash 
            FROM cx_game_cp 
            WHERE is_use=1 
            ORDER BY gcp_key
        `;
    const rows = await this.query(sql);

    // 檢查 rows 是否有值
    if (!rows || rows.length === 0) {
      return null;
    }

    // result
    let aList: GetDataGameListRes[] = [];
    for (let i = 0; i < rows.length; i++) {
      aList.push({
        code: rows[i].gcp_key,
        name: rows[i].gcp_name,
        type: rows[i].game_type,
        view_url: a_bUseViewUrl ? rows[i].result_url : "",
        use_splash: a_bUseViewUrl ? rows[i].use_splash : 0,
      });
    }
    return aList;
  }

  /**
   * get default splash list
   * @param splashDefName splash def name
   * @returns default splash list
   */
  async getDefSplashList(splashDefName: string) {
    const sql = `
            SELECT 
                splash_name,splash_url,css_bg_color,css_img_size 
            FROM tbl_operator_splash 
            WHERE operator_id=? and is_use=1 
            ORDER BY pos LIMIT 1
        `;
    const params = [splashDefName];
    const rows = await this.query(sql, params);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  /**
   * Get user info by user id
   * @param userId user id
   * @returns user info
   */
  async getUserInfoByUserId(userId: string): Promise<CxUser | null> {
    const sql = `   
        SELECT
            user_key,
            user_id,
            user_id_org,
            user_name,
            user_nick,
            user_nick_org,
            op_id,
            cash
        FROM
            cx_user
        WHERE
            user_id = ?
        `;
    const params = [userId];
    const rows = await this.query<CxUser>(sql, params);
    return rows[0] ?? null;
  }

  /**
   * Get user id by user key
   * @param userKey user key
   * @returns user id
   */
  async getUserIdByUserKey(userKey: number): Promise<any> {
    const sql = `
            SELECT
                user_id
            FROM cx_user
            WHERE user_key = ?
        `;
    const params = [userKey];
    const rows = await this.query(sql, params);
    if (!rows || rows.length === 0) {
      return null;
    }
    return rows[0].user_id;
  }
}
