import { Module } from "@nestjs/common";
import { FastSpinController } from "./fastspin.controller";
import { FastSpinService } from "./fastspin.service";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { CoreGrpcClientModule } from "src/Grpc/Clients/code.grpc.client.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";

@Module({
  imports: [
    ApiModule,
    RedisModule, // ✅ 必須 import
    CoreGrpcClientModule,
    AccessCodeModule,
  ],
  controllers: [FastSpinController],
  providers: [FastSpinService],
  exports: [FastSpinService],
})
export class FastSpinModule {}
