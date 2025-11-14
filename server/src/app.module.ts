import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthGuard } from "./Global/Guards/global.guard";
import { RequestLoggerMiddleware } from "./Global/Middlewares/request.logger.middleware";
import { RedisModule } from "./Infrastructure/Redis/redis.module";
import { LogService } from "./Utils/log.service";
import { HeroModule } from "./Grpc/Hero/hero.module";
import { GameModule } from "./Modules/Game/game.module";
import { EvolutionModule } from "./Modules/Evolution/evolution.module";
import { AccessCodeModule } from "./Global/Service/access.code.module";
import { BngModule } from "./Modules/Bng/bng.module";

import { Type } from "@nestjs/common";
import { DynamicModule } from "@nestjs/common";
import { Game } from "./Config/config";
import { PpModule } from "./Modules/Pp/pp.module";
import { CoreGrpcClientModule } from "./Grpc/Clients/code.grpc.client.module";
import { MainAppModule } from "./Modules/MainApp/main.app.module";
import { MysqlModule } from "./Infrastructure/MySQL/mysql.module";
import { PlayModule } from "./Modules/Play/play.module";
import { FastSpinModule } from "./Modules/FastSpin/fastspin.module";
import { QqpkModule } from "./Modules/Qqpk/qqpk.module";
import { ClpModule } from "./Modules/Clp/clp.module";
import { HrgModule } from "./Modules/Hrg/hrg.module";
import { AppPort } from "./Global/Service/Enum/access.code.enum";
import { LineModule } from "./Modules/Line/line.module";
import { ExcelModule } from "./Modules/Excel/excel.module";
import { GoogleGenerativeAIModule } from "./Modules/GoogleGenerativeAI/google.generative.ai.module";
import { MilvusModule } from "./Modules/Milvus/milvus.module";

const dynamicModules: Array<Type<any> | DynamicModule> = [
  CoreGrpcClientModule,
  AccessCodeModule,
  RedisModule,
  HeroModule,
  GameModule,
  MysqlModule,
  LineModule,
  ExcelModule,
  GoogleGenerativeAIModule,
  MilvusModule
];

setGameStartModule(dynamicModules);

@Module({
  imports: [
    // // 靜態檔案取代 router 入口；應用於 Client 與 Server 結合 ; SPA
    // // 정적 파일이 라우터 진입점을 대체하며, 클라이언트와 서버가 결합된 SPA(싱글 페이지 애플리케이션)에 적용됩니다.
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../../../client', 'build'),
    // }),
    // ConfigModule.forRoot({ // 不使用 env.
    //   isGlobal: true,
    //   envFilePath: `.env.${process.env.APP_ENV || 'dev'}`
    // }),
    ...dynamicModules,
  ],
  controllers: [AppController],
  providers: [AppService, LogService, AuthGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}

/**
 * set game start module ; dynamicModules call by value
 * @param dynamicModules
 */
function setGameStartModule(dynamicModules: Array<Type<any> | DynamicModule>) {
  const _STR_LOCAL = "local";
  switch (process.env.GAME_START_CP_KEY) {
    case Game.Evolution.cp_key.toString():
      dynamicModules.push(EvolutionModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.EVOLUTION;
      console.log("Start : Server Evolution");
      break;
    case Game.PP.cp_key.toString():
      dynamicModules.push(PpModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.PP;
      console.log("Start : Server PP");
      break;
    case Game.BNG.cp_key.toString():
      dynamicModules.push(BngModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.BNG;
      console.log("Start : Server BNG");
      break;
    case Game.FASTSPIN.cp_key.toString():
      dynamicModules.push(FastSpinModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.FASTSPIN;
      console.log("Start : Server FastSpin");
      break;
    case Game.QQPK.cp_key.toString():
      dynamicModules.push(QqpkModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.QQPK;
      console.log("Start : Server QQPK");
      break;
    case Game.CLP.cp_key.toString():
      dynamicModules.push(ClpModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.CLP;
      console.log("Start : Server CLP");
      break;
    case Game.HRG.cp_key.toString():
      dynamicModules.push(HrgModule)
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.HRG;
      console.log("Start : Server HRG (Hot Road Gaming)");
      break;
    case "playApp":
      dynamicModules.push(PlayModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.PLAY;
      console.log("Start : Server Play");
      break;
    default:
      dynamicModules.push(MainAppModule);
      if (process.env.APP_ENV !== _STR_LOCAL) process.env.APP_PORT = AppPort.MAINAPP;
      console.log("Start : Server MainApp");
      break;
  }
}
