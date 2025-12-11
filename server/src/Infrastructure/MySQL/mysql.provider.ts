// src/database/db.providers.ts
import { Provider } from "@nestjs/common";
import { createPool, Pool, PoolOptions } from "mysql2/promise";
import { DB_POOL } from "./mysql.token";
import { MysqlConfig } from "../../Config/config";

export const MysqlPoolProvider: Provider = {
  provide: DB_POOL,
  useFactory: async () => {
    try {
      // const options: PoolOptions = {
      //   host: MysqlConfig.host,
      //   port: MysqlConfig.port,
      //   user: MysqlConfig.user,
      //   password: MysqlConfig.password,
      //   database: MysqlConfig.database,
      //   waitForConnections: MysqlConfig.waitForConnections,
      //   connectionLimit: MysqlConfig.connectionLimit,
      //   queueLimit: MysqlConfig.queueLimit,
      //   timezone: MysqlConfig.timezone,
      //   dateStrings: MysqlConfig.dateStrings,
      //   // supportBigNumbers: true, bigNumberStrings: true, // 如需 bigint 成字串
      // };
      // const pool = createPool(options);

      // // 簡單探活
      // await pool.query("SELECT 1");
      // return pool;
      return;
    } catch (error) {
      console.error("Error creating MySQL pool:", error);
      throw error;
    }
  },
};
