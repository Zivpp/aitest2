"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_provider_1 = require("./redis.provider");
let RedisService = class RedisService {
    client;
    constructor(client) {
        this.client = client;
    }
    async get(key) {
        return this.client.get(key);
    }
    async getJson(key) {
        const val = await this.get(key);
        try {
            return val ? JSON.parse(val) : null;
        }
        catch {
            return null;
        }
    }
    async set(key, value, ttlSeconds) {
        const serialized = typeof value === "string" ? value : JSON.stringify(value);
        if (ttlSeconds) {
            return this.client.set(key, serialized, "EX", ttlSeconds);
        }
        return this.client.set(key, serialized);
    }
    async del(key) {
        return this.client.del(key);
    }
    async exists(key) {
        return this.client.exists(key);
    }
    async keys(pattern = "*") {
        return this.client.keys(pattern);
    }
    async flushAll() {
        return this.client.flushall();
    }
    async quit() {
        await this.client.quit();
    }
    onModuleDestroy() {
        this.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_provider_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], RedisService);
//# sourceMappingURL=redis.service.js.map