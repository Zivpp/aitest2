import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CoreGrpcClientProvider } from "./core.grpc.client.provider";
import { CoreGrpcService } from "./core.grpc.service";

@Module({
  imports: [ConfigModule],
  providers: [CoreGrpcClientProvider, CoreGrpcService],
  exports: [CoreGrpcService], // ← 這句超重要
})
export class CoreGrpcClientModule {}
