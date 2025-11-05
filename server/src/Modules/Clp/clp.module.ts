import { ClpController } from "./clp.controller";
import { ClpService } from "./clp.service";
import { Module } from "@nestjs/common";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { CoreGrpcClientModule } from "../../Grpc/Clients/code.grpc.client.module";
import { AccessCodeModule } from "../../Global/Service/access.code.module";

@Module({
  imports: [
    ApiModule,
    RedisModule, // ✅ 必須 import
    CoreGrpcClientModule,
    AccessCodeModule,
  ],
  controllers: [ClpController],
  providers: [ClpService],
  exports: [ClpService],
})
export class ClpModule {}
