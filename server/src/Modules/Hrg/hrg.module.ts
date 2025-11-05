import { Module } from "@nestjs/common";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { CoreGrpcClientModule } from "../../Grpc/Clients/code.grpc.client.module";
import { AccessCodeModule } from "../../Global/Service/access.code.module";
import { HrgController } from "./hrg.controller";
import { HrgService } from "./hrg.service";

@Module({
  imports: [
    ApiModule,
    RedisModule, // ✅ 必須 import
    CoreGrpcClientModule,
    AccessCodeModule,
  ],
  controllers: [HrgController],
  providers: [HrgService],
  exports: [HrgService],
})
export class HrgModule { }
