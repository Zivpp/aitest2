import { Module } from "@nestjs/common";
import { EvolutionController } from "./evolution.controller";
import { EvolutionService } from "./evolution.service";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { EvolutionBatch } from "./Batch/evolution.batch";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { CoreGrpcClientModule } from "src/Grpc/Clients/code.grpc.client.module";
import { EvolutionDao } from "./evolution.dao";
import { MysqlModule } from "../../Infrastructure/MySQL/mysql.module";
import { AccessCodeModule } from "../../Global/Service/access.code.module";

@Module({
  imports: [
    ApiModule,
    AccessCodeModule,
    CoreGrpcClientModule,
    MysqlModule,
    AccessCodeModule,
    RedisModule, // ✅ 必須 import
    MysqlModule,
  ],
  controllers: [EvolutionController],
  providers: [EvolutionService, EvolutionBatch, EvolutionDao],
  exports: [EvolutionService],
})
export class EvolutionModule {}
