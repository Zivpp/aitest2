// src/database/base.dao.ts
import { Inject } from "@nestjs/common";
import {
  Pool,
  PoolConnection,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import { DB_POOL } from "./mysql.token";

export abstract class MysqlBaseDao {
  constructor(@Inject(DB_POOL) protected readonly pool: Pool) {}

  // 查詢：回傳型別 T 陣列
  protected async query<T = RowDataPacket>(
    sql: string,
    params?: any[],
  ): Promise<T[]> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T[];
  }

  // 執行：INSERT/UPDATE/DELETE
  protected async exec(sql: string, params?: any[]): Promise<ResultSetHeader> {
    const [res] = await this.pool.execute(sql, params);
    return res as ResultSetHeader;
  }

  // 交易輔助
  protected async inTx<T>(
    work: (conn: PoolConnection) => Promise<T>,
  ): Promise<T> {
    const conn = await this.pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await work(conn);
      await conn.commit();
      return result;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  /**
   * update by object
   * @param table table name
   * @param data data
   * @param whereSql where sql
   * @param whereParams where params
   * @param opts options
   * @returns result
   */
  protected async updateByObject(
    table: string,
    data: Record<string, unknown>,
    whereSql: string,
    whereParams: Record<string, unknown>,
    opts?: { conn?: PoolConnection; allowEmptyWhere?: boolean },
  ): Promise<ResultSetHeader> {
    // 過濾掉 undefined 欄位（不更新）；保留 null（更新為 NULL）
    const entries = Object.entries(data).filter(([, v]) => v !== undefined);
    if (entries.length === 0) throw new Error("No columns to update");

    // 組 SET 子句（用命名參數）
    const setPairs: string[] = [];
    const setParams: Record<string, unknown> = {};
    for (const [k, v] of entries) {
      // 欄位名稱以反引號包起來，避免關鍵字/特殊字元
      setPairs.push(`\`${k}\` = :set_${k}`);
      setParams[`set_${k}`] = v;
    }
    const setSql = setPairs.join(", ");

    // WHERE 防呆
    const trimmed = (whereSql ?? "").trim();
    if (!trimmed && !opts?.allowEmptyWhere) {
      throw new Error("Unsafe UPDATE: whereSql is empty");
    }

    // 最終 SQL 與參數（合併 SET 參數與 WHERE 參數）
    const sql = `UPDATE \`${table}\` SET ${setSql}${trimmed ? ` WHERE ${trimmed}` : ""}`;
    const params = { ...setParams, ...(whereParams ?? {}) };

    const runner = opts?.conn ?? this.pool;
    const [res] = await runner.execute(sql, params);
    return res as ResultSetHeader;
  }
}
