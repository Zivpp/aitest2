"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionModule = void 0;
const common_1 = require("@nestjs/common");
const evolution_controller_1 = require("./evolution.controller");
const evolution_service_1 = require("./evolution.service");
const redis_module_1 = require("../../Infrastructure/Redis/redis.module");
const evolution_batch_1 = require("./Batch/evolution.batch");
const api_module_1 = require("../../Infrastructure/Api/api.module");
const code_grpc_client_module_1 = require("../../Grpc/Clients/code.grpc.client.module");
const evolution_dao_1 = require("./evolution.dao");
const mysql_module_1 = require("../../Infrastructure/MySQL/mysql.module");
const access_code_module_1 = require("../../Global/Service/access.code.module");
let EvolutionModule = class EvolutionModule {
};
exports.EvolutionModule = EvolutionModule;
exports.EvolutionModule = EvolutionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            api_module_1.ApiModule,
            access_code_module_1.AccessCodeModule,
            code_grpc_client_module_1.CoreGrpcClientModule,
            mysql_module_1.MysqlModule,
            access_code_module_1.AccessCodeModule,
            redis_module_1.RedisModule,
            mysql_module_1.MysqlModule,
        ],
        controllers: [evolution_controller_1.EvolutionController],
        providers: [evolution_service_1.EvolutionService, evolution_batch_1.EvolutionBatch, evolution_dao_1.EvolutionDao],
        exports: [evolution_service_1.EvolutionService],
    })
], EvolutionModule);
//# sourceMappingURL=evolution.module.js.map