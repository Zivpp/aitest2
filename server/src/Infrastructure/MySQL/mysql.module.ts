// src/database/database.module.ts
import { Module, Inject, OnModuleDestroy, Global } from "@nestjs/common";
import { Pool } from "mysql2/promise";
import { DB_POOL } from "./mysql.token";
import { MysqlPoolProvider } from "./mysql.provider";

@Global() // 全域可用，免每次 imports
@Module({
  providers: [MysqlPoolProvider],
  exports: [MysqlPoolProvider],
})
export class MysqlModule implements OnModuleDestroy {
  constructor(@Inject(DB_POOL) private readonly pool: Pool) {}
  async onModuleDestroy() {
    await this.pool.end();
  }
}
