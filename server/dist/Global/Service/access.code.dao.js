"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCodeDao = void 0;
const common_1 = require("@nestjs/common");
const mysql_base_dao_1 = require("../../Infrastructure/MySQL/mysql.base.dao");
let AccessCodeDao = class AccessCodeDao extends mysql_base_dao_1.MysqlBaseDao {
    async getDataGameList(a_bUseViewUrl = false) {
        const sql = `
            SELECT 
                gcp_key, gcp_name, game_type, result_url, use_splash 
            FROM cx_game_cp 
            WHERE is_use=1 
            ORDER BY gcp_key
        `;
        const rows = await this.query(sql);
        if (!rows || rows.length === 0) {
            return null;
        }
        let aList = [];
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
    async getDefSplashList(splashDefName) {
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
    async getUserInfoByUserId(userId) {
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
        const rows = await this.query(sql, params);
        return rows[0] ?? null;
    }
    async getUserIdByUserKey(userKey) {
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
};
exports.AccessCodeDao = AccessCodeDao;
exports.AccessCodeDao = AccessCodeDao = __decorate([
    (0, common_1.Injectable)()
], AccessCodeDao);
//# sourceMappingURL=access.code.dao.js.map