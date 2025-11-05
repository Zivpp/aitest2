"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppModule = void 0;
const common_1 = require("@nestjs/common");
const api_module_1 = require("../../Infrastructure/Api/api.module");
const redis_module_1 = require("../../Infrastructure/Redis/redis.module");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const main_app_controller_1 = require("./main.app.controller");
const main_app_service_1 = require("./main.app.service");
const main_app_dao_1 = require("./main.app.dao");
const access_code_module_1 = require("../../Global/Service/access.code.module");
const main_app_batch_1 = require("./Batch/main.app.batch");
let MainAppModule = class MainAppModule {
};
exports.MainAppModule = MainAppModule;
exports.MainAppModule = MainAppModule = __decorate([
    (0, common_1.Module)({
        imports: [api_module_1.ApiModule, redis_module_1.RedisModule, access_code_module_1.AccessCodeModule],
        controllers: [main_app_controller_1.MainAppController],
        providers: [access_code_service_1.AccessCodeService, main_app_service_1.MainAppService, main_app_dao_1.MainAppDao, main_app_batch_1.MainAppBatch],
        exports: [],
    })
], MainAppModule);
//# sourceMappingURL=main.app.module.js.map