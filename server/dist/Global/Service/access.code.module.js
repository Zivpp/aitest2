"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCodeModule = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("./access.code.service");
const redis_module_1 = require("../../Infrastructure/Redis/redis.module");
const api_module_1 = require("../../Infrastructure/Api/api.module");
const access_code_dao_1 = require("./access.code.dao");
const mysql_module_1 = require("../../Infrastructure/MySQL/mysql.module");
let AccessCodeModule = class AccessCodeModule {
};
exports.AccessCodeModule = AccessCodeModule;
exports.AccessCodeModule = AccessCodeModule = __decorate([
    (0, common_1.Module)({
        imports: [redis_module_1.RedisModule, api_module_1.ApiModule, mysql_module_1.MysqlModule],
        providers: [access_code_service_1.AccessCodeService, access_code_dao_1.AccessCodeDao],
        exports: [access_code_service_1.AccessCodeService, access_code_dao_1.AccessCodeDao],
    })
], AccessCodeModule);
//# sourceMappingURL=access.code.module.js.map