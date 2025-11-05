import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import globalExceptionHandle from "./Global/ExceptionHandler/global.exception.handler";
import { LogService } from "./Utils/log.service";
import { GlobalDTOValidationPipe } from "./Global/Pipes/global.dto.validation.pipe";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "core_service", // 對應 .proto 裡的 package
        protoPath: join(__dirname, "../proto/core.proto"), // proto 檔案路徑
        url: "0.0.0.0:50051", // gRPC 服務的 port
      },
    },
  );

  // 加入 Global Filter（Interceptor / Guard 不適用於 gRPC microservice）
  // app.useGlobalFilters(new globalExceptionHandle(new LogService()));

  // API DTO 防護, 限制 input 參數的型態與 size, 類似 gRPC 的 .proto
  // API DTO 검증을 통해 입력 파라미터의 타입과 크기를 제한하고 있으며, gRPC의 .proto와 유사한 방식입니다.
  app.useGlobalPipes(new GlobalDTOValidationPipe());

  process.env.APP_CONTEXT = "GRPC"; // gRPC app 啟動前標記
  await app.listen();
  console.log("[gRPC] service is running on port 50051");
}
bootstrap();
