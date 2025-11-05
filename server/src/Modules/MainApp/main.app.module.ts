import { Module } from "@nestjs/common";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { MainAppController } from "./main.app.controller";
import { MainAppService } from "./main.app.service";
import { MainAppDao } from "./main.app.dao";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { MainAppBatch } from "./Batch/main.app.batch";

@Module({
  imports: [ApiModule, RedisModule, AccessCodeModule],
  controllers: [MainAppController],
  providers: [AccessCodeService, MainAppService, MainAppDao, MainAppBatch],
  exports: [],
})
export class MainAppModule {}
