"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlConfig = exports.Game = exports.Config = void 0;
const config_local_1 = require("./config.local");
const config_staging_1 = require("./config.staging");
const config_prod_1 = require("./config.prod");
const config_local_2 = require("./config.local");
const config_staging_2 = require("./config.staging");
const config_prod_2 = require("./config.prod");
const config_local_3 = require("./config.local");
const config_staging_3 = require("./config.staging");
const config_prod_3 = require("./config.prod");
const ENV = process.env.APP_ENV || "local";
let config;
let game;
let mysqlConfig;
switch (ENV) {
    case "production":
        config = config_prod_1.Config;
        game = config_prod_2.Game;
        mysqlConfig = config_prod_3.MysqlConfig;
        break;
    case "staging":
        config = config_staging_1.Config;
        game = config_staging_2.Game;
        mysqlConfig = config_staging_3.MysqlConfig;
        break;
    case "local":
        config = config_local_1.Config;
        game = config_local_2.Game;
        mysqlConfig = config_local_3.MysqlConfig;
        break;
    default:
        break;
}
exports.Config = config;
exports.Game = game;
exports.MysqlConfig = mysqlConfig;
//# sourceMappingURL=config.js.map