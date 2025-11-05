import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import globalExceptionHandle from "./Global/ExceptionHandler/global.exception.handler";
import { AuthGuard } from "./Global/Guards/global.guard";
import globalInterceptor from "./Global/Interceptors/global.interceptor";
import { GlobalDTOValidationPipe } from "./Global/Pipes/global.dto.validation.pipe";
import { LogService } from "./Utils/log.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Config } from "./Config/config";
import { json, urlencoded } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // [Global] | [글로벌 ; 백그라운드 실행]
  // for React.js SPA 應用, User > React.js Router > Nest.js Router ; 加上 pre-text api 後就不會互搶
  // React.js SPA 애플리케이션의 경우, 사용자 > React.js 라우터 > Nest.js 라우터; 사전 텍스트 API를 추가한 후에는 서로 경쟁하지 않습니다.
  // app.setGlobalPrefix('api')

  // 更安全的取得環境變數
  // 환경 변수를 보다 안전하게 불러오는 방법을 적용합니다.
  // const configService = app.get(ConfigService)

  // 用 app.get 由 Nest 管理的實例
  // app.get 을 사용하여 Nest가 관리하는 인스턴스를 가져옵니다.
  // const logService = app.get(LogService)

  // API DTO 防護, 限制 input 參數的型態與 size, 類似 gRPC 的 .proto
  // API DTO 검증을 통해 입력 파라미터의 타입과 크기를 제한하고 있으며, gRPC의 .proto와 유사한 방식입니다.
  app.useGlobalPipes(new GlobalDTOValidationPipe());

  // 客製化 API response 格式, 給第三方服務介接時有統一的格式可以遵循
  // API 응답 형식을 커스터마이징하여, 외부 서비스와 연동 시 일관된 포맷을 따를 수 있도록 구성했습니다.
  // app.useGlobalInterceptors(new globalInterceptor(logService))

  // 全域錯誤攔截, 客製化錯誤格式, 給第三方服務介接時有統一的格式可以遵循 & 防止伺服器因為錯誤而終止服務
  // 전역 에러 처리 기능을 통해 에러 응답을 커스터마이징하였고, 외부 서비스와의 연동 시 일관된 포맷을 따를 수 있도록 구성했습니다. 또한, 예외가 발생하더라도 서버가 중단되지 않도록 방지하는 로직이 포함되어 있습니다.
  // app.useGlobalFilters(new globalExceptionHandle(logService))

  // https api 進入服務運算之前的身份驗證, 例如 : session, jwt 等等 ; 可以設定白名單 api path.
  // HTTPS API 요청이 서비스 로직에 진입하기 전에, 세션이나 JWT 등의 방식으로 인증 처리를 수행하며, 화이트리스트로 등록된 API 경로는 예외로 설정할 수 있습니다.
  app.useGlobalGuards(app.get(AuthGuard));

  // -- Defend --
  // [CSP] 防止 xss [尚未完成]
  // [CSP] XSS 방지용 [아직 미완료]
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        // scriptSrc: ["'self'", 'https://trusted.cdn.com'],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        // imgSrc: ["'self'", 'https: data: blob:'] // 建議改成走 CDN = imgSrc: ["'self'", 'https://cdn.example.com'] ; 非必要不要接收  JavaScript 動態生成圖片
      },
    }),
  );

  // [cookie-parser]
  app.use(cookieParser());

  // [CORS]
  // *dev
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });
  // *uat/prod
  // app.enableCors({
  //   origin: true,
  //   // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 不建議開放 Delete, 太危險
  //   methods: 'GET,HEAD,PUT,PATCH,POST',
  //   credentials: true, // 因應 cookie 或憑證（含 JWT with cookie）
  //   optionsSuccessStatus: 200, // CORS OPTION 預設為 204, 因應遊覽器相容, 改為預設 200
  //   allowedHeaders: ['Content-Type', 'Authorization', 'refresh-token'],
  // });

  // Swagger setting
  const config = new DocumentBuilder()
    .setTitle("API 文件")
    .setDescription("這是自動生成的 Swagger API 文件")
    .setVersion("1.0")
    // .addBearerAuth() // 如果有使用 JWT，可加這行
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document); // 可用 `/swagger` 查看

  // In response to the original body buffer required by the customer for encryption and signature,
  //  it is pre-injected into req for subsequent encryption and decryption judgment
  app.use(
    json({
      verify: (req: any, _res, buf) => {
        // 存下原始位元組
        req.rawBody = Buffer.from(buf);
      },
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      verify: (req: any, _res, buf) => {
        req.rawBody = Buffer.from(buf);
      },
    }),
  );

  // [Server Go]
  process.env.APP_CONTEXT = "HTTP"; // gRPC both in this project, so this is controller batch start.
  const server = await app.listen(process.env.APP_PORT ?? 3000);

  // 60s ; 保持 keep-alive TCP 連線的時間上限。連線閒置多久關閉。
  // 60초 ; keep-alive TCP 연결의 최대 유지 시간. 연결이 유휴 상태일 때 얼마 후 종료되는지를 의미합니다.
  server.keepAliveTimeout = 60 * 1000;

  // 65s ; 等待完整 headers 傳送完成的時間上限。
  // 65초 ; 전체 헤더가 전송 완료되기를 기다리는 최대 시간입니다.
  server.headersTimeout = 65 * 1000;

  // server.requestTimeout // 處理整個請求的最大時間（包含 headers + body + 處理邏輯）。超時會斷線。
  // server.maxHeadersCount // 最大可接受的 headers 數量。設上限可防止攻擊。
  // server.maxRequestsPerSocket // 每個 socket 可處理的最大請求數。可控制連線回收。
}
bootstrap();
