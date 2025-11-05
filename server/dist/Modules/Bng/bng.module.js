"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BngModule = void 0;
const common_1 = require("@nestjs/common");
const bng_controller_1 = require("./bng.controller");
const bng_service_1 = require("./bng.service");
const redis_module_1 = require("../../Infrastructure/Redis/redis.module");
const api_module_1 = require("../../Infrastructure/Api/api.module");
const code_grpc_client_module_1 = require("../../Grpc/Clients/code.grpc.client.module");
const access_code_module_1 = require("../../Global/Service/access.code.module");
let BngModule = class BngModule {
};
exports.BngModule = BngModule;
exports.BngModule = BngModule = __decorate([
    (0, common_1.Module)({
        imports: [
            api_module_1.ApiModule,
            redis_module_1.RedisModule,
            code_grpc_client_module_1.CoreGrpcClientModule,
            access_code_module_1.AccessCodeModule,
        ],
        controllers: [bng_controller_1.BngController],
        providers: [bng_service_1.BngService],
        exports: [bng_service_1.BngService],
    })
], BngModule);
//# sourceMappingURL=bng.module.js.map