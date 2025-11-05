import { Injectable } from "@nestjs/common";
import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";

@Injectable()
export class EvolutionDao extends MysqlBaseDao {
  /**
   * Get game code list by cp key
   * @param cpKey cp key
   * @returns game code list
   */
  async getGameCodeListByCpkey(cpKey: number) {
    const sql = `
            SELECT game_cp_key, game_code, game_name_eng 
            FROM cx_game 
            WHERE game_cp_key=? AND is_use=1 
            ORDER BY pos
        `;
    const params = [cpKey];
    const rows = await this.query(sql, params);
    return rows;
  }
}
