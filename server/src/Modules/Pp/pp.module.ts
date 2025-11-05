import { Module } from "@nestjs/common";
import { PpController } from "./pp.controller";
import { PpService } from "./pp.service";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { CoreGrpcClientModule } from "src/Grpc/Clients/code.grpc.client.module";
import { PPBatch } from "./Batch/pp.batch";
import { AccessCodeModule } from "src/Global/Service/access.code.module";

@Module({
  imports: [
    ApiModule,
    RedisModule, // ✅ 必須 import
    CoreGrpcClientModule,
    AccessCodeModule,
  ],
  controllers: [PpController],
  providers: [PpService, PPBatch],
  exports: [PpService],
})
export class PpModule {}
