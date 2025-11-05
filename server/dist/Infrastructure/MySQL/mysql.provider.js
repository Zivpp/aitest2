"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlPoolProvider = void 0;
const promise_1 = require("mysql2/promise");
const mysql_token_1 = require("./mysql.token");
const config_1 = require("../../Config/config");
exports.MysqlPoolProvider = {
    provide: mysql_token_1.DB_POOL,
    useFactory: async () => {
        const options = {
            host: config_1.MysqlConfig.host,
            port: config_1.MysqlConfig.port,
            user: config_1.MysqlConfig.user,
            password: config_1.MysqlConfig.password,
            database: config_1.MysqlConfig.database,
            waitForConnections: config_1.MysqlConfig.waitForConnections,
            connectionLimit: config_1.MysqlConfig.connectionLimit,
            queueLimit: config_1.MysqlConfig.queueLimit,
            timezone: config_1.MysqlConfig.timezone,
            dateStrings: config_1.MysqlConfig.dateStrings,
        };
        const pool = (0, promise_1.createPool)(options);
        await pool.query("SELECT 1");
        return pool;
    },
};
//# sourceMappingURL=mysql.provider.js.map