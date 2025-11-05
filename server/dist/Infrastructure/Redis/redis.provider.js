"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisProviders = exports.REDIS_CLIENT = void 0;
const ioredis_1 = require("ioredis");
const config_1 = require("../../Config/config");
exports.REDIS_CLIENT = "REDIS_CLIENT";
exports.redisProviders = [
    {
        provide: exports.REDIS_CLIENT,
        useFactory: async () => {
            const client = new ioredis_1.default({
                host: config_1.Config.REDIS.HOST,
                port: config_1.Config.REDIS.PORT,
                password: config_1.Config.REDIS.PASSWORD,
            });
            client.on("error", (err) => {
                console.error("[Redis] Connection Error:", err);
            });
            return client;
        },
    },
];
//# sourceMappingURL=redis.provider.js.map