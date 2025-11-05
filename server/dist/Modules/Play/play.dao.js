"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayDao = void 0;
const common_1 = require("@nestjs/common");
const mysql_base_dao_1 = require("../../Infrastructure/MySQL/mysql.base.dao");
let PlayDao = class PlayDao extends mysql_base_dao_1.MysqlBaseDao {
    async getOperatorGameInfo(opId) {
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
        const rows = await this.query(sql, params);
        return rows[0] ?? null;
    }
    async getCPAccount(opId, cpKey) {
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
        return rows[0] ?? null;
    }
};
exports.PlayDao = PlayDao;
exports.PlayDao = PlayDao = __decorate([
    (0, common_1.Injectable)()
], PlayDao);
//# sourceMappingURL=play.dao.js.map