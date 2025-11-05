"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlBaseDao = void 0;
const common_1 = require("@nestjs/common");
const mysql_token_1 = require("./mysql.token");
let MysqlBaseDao = class MysqlBaseDao {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async query(sql, params) {
        const [rows] = await this.pool.query(sql, params);
        return rows;
    }
    async exec(sql, params) {
        const [res] = await this.pool.execute(sql, params);
        return res;
    }
    async inTx(work) {
        const conn = await this.pool.getConnection();
        try {
            await conn.beginTransaction();
            const result = await work(conn);
            await conn.commit();
            return result;
        }
        catch (e) {
            await conn.rollback();
            throw e;
        }
        finally {
            conn.release();
        }
    }
    async updateByObject(table, data, whereSql, whereParams, opts) {
        const entries = Object.entries(data).filter(([, v]) => v !== undefined);
        if (entries.length === 0)
            throw new Error("No columns to update");
        const setPairs = [];
        const setParams = {};
        for (const [k, v] of entries) {
            setPairs.push(`\`${k}\` = :set_${k}`);
            setParams[`set_${k}`] = v;
        }
        const setSql = setPairs.join(", ");
        const trimmed = (whereSql ?? "").trim();
        if (!trimmed && !opts?.allowEmptyWhere) {
            throw new Error("Unsafe UPDATE: whereSql is empty");
        }
        const sql = `UPDATE \`${table}\` SET ${setSql}${trimmed ? ` WHERE ${trimmed}` : ""}`;
        const params = { ...setParams, ...(whereParams ?? {}) };
        const runner = opts?.conn ?? this.pool;
        const [res] = await runner.execute(sql, params);
        return res;
    }
};
exports.MysqlBaseDao = MysqlBaseDao;
exports.MysqlBaseDao = MysqlBaseDao = __decorate([
    __param(0, (0, common_1.Inject)(mysql_token_1.DB_POOL)),
    __metadata("design:paramtypes", [Object])
], MysqlBaseDao);
//# sourceMappingURL=mysql.base.dao.js.map