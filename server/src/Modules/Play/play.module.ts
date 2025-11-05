import { Module } from "@nestjs/common";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { MysqlModule } from "../../Infrastructure/MySQL/mysql.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { PlayController } from "./play.controller";
import { PlayService } from "./play.service";
import { PlayDao } from "./play.dao";

@Module({
  imports: [ApiModule, RedisModule, MysqlModule, AccessCodeModule],
  controllers: [PlayController],
  providers: [PlayService, PlayDao],
  exports: [PlayService],
})
export class PlayModule {}
