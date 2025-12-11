"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const global_guard_1 = require("./Global/Guards/global.guard");
const request_logger_middleware_1 = require("./Global/Middlewares/request.logger.middleware");
const redis_module_1 = require("./Infrastructure/Redis/redis.module");
const log_service_1 = require("./Utils/log.service");
const hero_module_1 = require("./Grpc/Hero/hero.module");
const game_module_1 = require("./Modules/Game/game.module");
const evolution_module_1 = require("./Modules/Evolution/evolution.module");
const access_code_module_1 = require("./Global/Service/access.code.module");
const bng_module_1 = require("./Modules/Bng/bng.module");
const config_1 = require("./Config/config");
const pp_module_1 = require("./Modules/Pp/pp.module");
const code_grpc_client_module_1 = require("./Grpc/Clients/code.grpc.client.module");
const main_app_module_1 = require("./Modules/MainApp/main.app.module");
const play_module_1 = require("./Modules/Play/play.module");
const fastspin_module_1 = require("./Modules/FastSpin/fastspin.module");
const qqpk_module_1 = require("./Modules/Qqpk/qqpk.module");
const clp_module_1 = require("./Modules/Clp/clp.module");
const hrg_module_1 = require("./Modules/Hrg/hrg.module");
const access_code_enum_1 = require("./Global/Service/Enum/access.code.enum");
const line_module_1 = require("./Modules/Line/line.module");
const excel_module_1 = require("./Modules/Excel/excel.module");
const google_generative_ai_module_1 = require("./Modules/GoogleGenerativeAI/google.generative.ai.module");
const milvus_module_1 = require("./Modules/Milvus/milvus.module");
const dynamicModules = [
    code_grpc_client_module_1.CoreGrpcClientModule,
    access_code_module_1.AccessCodeModule,
    redis_module_1.RedisModule,
    hero_module_1.HeroModule,
    game_module_1.GameModule,
    line_module_1.LineModule,
    excel_module_1.ExcelModule,
    google_generative_ai_module_1.GoogleGenerativeAIModule,
    milvus_module_1.MilvusModule
];
setGameStartModule(dynamicModules);
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(request_logger_middleware_1.RequestLoggerMiddleware)
            .forRoutes({ path: "*", method: common_1.RequestMethod.ALL });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ...dynamicModules,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, log_service_1.LogService, global_guard_1.AuthGuard],
    })
], AppModule);
function setGameStartModule(dynamicModules) {
    const _STR_LOCAL = "local";
    switch (process.env.GAME_START_CP_KEY) {
        case config_1.Game.Evolution.cp_key.toString():
            dynamicModules.push(evolution_module_1.EvolutionModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.EVOLUTION;
            console.log("Start : Server Evolution");
            break;
        case config_1.Game.PP.cp_key.toString():
            dynamicModules.push(pp_module_1.PpModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.PP;
            console.log("Start : Server PP");
            break;
        case config_1.Game.BNG.cp_key.toString():
            dynamicModules.push(bng_module_1.BngModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.BNG;
            console.log("Start : Server BNG");
            break;
        case config_1.Game.FASTSPIN.cp_key.toString():
            dynamicModules.push(fastspin_module_1.FastSpinModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.FASTSPIN;
            console.log("Start : Server FastSpin");
            break;
        case config_1.Game.QQPK.cp_key.toString():
            dynamicModules.push(qqpk_module_1.QqpkModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.QQPK;
            console.log("Start : Server QQPK");
            break;
        case config_1.Game.CLP.cp_key.toString():
            dynamicModules.push(clp_module_1.ClpModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.CLP;
            console.log("Start : Server CLP");
            break;
        case config_1.Game.HRG.cp_key.toString():
            dynamicModules.push(hrg_module_1.HrgModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.HRG;
            console.log("Start : Server HRG (Hot Road Gaming)");
            break;
        case "playApp":
            dynamicModules.push(play_module_1.PlayModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.PLAY;
            console.log("Start : Server Play");
            break;
        default:
            dynamicModules.push(main_app_module_1.MainAppModule);
            if (process.env.APP_ENV !== _STR_LOCAL)
                process.env.APP_PORT = access_code_enum_1.AppPort.MAINAPP;
            console.log("Start : Server MainApp");
            break;
    }
}
//# sourceMappingURL=app.module.js.map