"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayModule = void 0;
const common_1 = require("@nestjs/common");
const api_module_1 = require("../../Infrastructure/Api/api.module");
const redis_module_1 = require("../../Infrastructure/Redis/redis.module");
const mysql_module_1 = require("../../Infrastructure/MySQL/mysql.module");
const access_code_module_1 = require("../../Global/Service/access.code.module");
const play_controller_1 = require("./play.controller");
const play_service_1 = require("./play.service");
const play_dao_1 = require("./play.dao");
let PlayModule = class PlayModule {
};
exports.PlayModule = PlayModule;
exports.PlayModule = PlayModule = __decorate([
    (0, common_1.Module)({
        imports: [api_module_1.ApiModule, redis_module_1.RedisModule, mysql_module_1.MysqlModule, access_code_module_1.AccessCodeModule],
        controllers: [play_controller_1.PlayController],
        providers: [play_service_1.PlayService, play_dao_1.PlayDao],
        exports: [play_service_1.PlayService],
    })
], PlayModule);
//# sourceMappingURL=play.module.js.map