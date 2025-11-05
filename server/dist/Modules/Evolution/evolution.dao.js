"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionDao = void 0;
const common_1 = require("@nestjs/common");
const mysql_base_dao_1 = require("../../Infrastructure/MySQL/mysql.base.dao");
let EvolutionDao = class EvolutionDao extends mysql_base_dao_1.MysqlBaseDao {
    async getGameCodeListByCpkey(cpKey) {
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
};
exports.EvolutionDao = EvolutionDao;
exports.EvolutionDao = EvolutionDao = __decorate([
    (0, common_1.Injectable)()
], EvolutionDao);
//# sourceMappingURL=evolution.dao.js.map