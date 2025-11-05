import { Module } from "@nestjs/common";
import { RedisModule } from "../../Infrastructure/Redis/redis.module";
import { ApiModule } from "../../Infrastructure/Api/api.module";
import { CoreGrpcClientModule } from "src/Grpc/Clients/code.grpc.client.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { QqpkService } from "./qqpk.service";
import { QqpkController } from "./qqpk.controller";

@Module({
  imports: [
    ApiModule,
    RedisModule, // ✅ 必須 import
    CoreGrpcClientModule,
    AccessCodeModule,
  ],
  controllers: [QqpkController],
  providers: [QqpkService],
  exports: [QqpkService],
})
export class QqpkModule {}
