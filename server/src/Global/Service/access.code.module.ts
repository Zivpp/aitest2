// access.code.module.ts
import { Module } from "@nestjs/common";
import { AccessCodeService } from "./access.code.service";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { AccessCodeDao } from "./access.code.dao";
import { MysqlModule } from "src/Infrastructure/MySQL/mysql.module";

@Module({
  imports: [RedisModule, ApiModule, MysqlModule], // ⬅️ 關鍵：匯入 RedisModule
  providers: [AccessCodeService, AccessCodeDao],
  exports: [AccessCodeService, AccessCodeDao], // ⬅️ 匯出給其他 module 用
})
export class AccessCodeModule {}
