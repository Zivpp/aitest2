// src/config/config.ts
import { Config as LocalConfig } from "./config.local";
import { Config as StagingConfig } from "./config.staging";
import { Config as ProdConfig } from "./config.prod";
import { Game as LocationGame } from "./config.local";
import { Game as StagingGame } from "./config.staging";
import { Game as ProdGame } from "./config.prod";
import { MysqlConfig as LocalMysqlConfig } from "./config.local";
import { MysqlConfig as StagingMysqlConfig } from "./config.staging";
import { MysqlConfig as ProdMysqlConfig } from "./config.prod";

const ENV = process.env.APP_ENV || "local"; // 預設 local

let config;
let game;
let mysqlConfig;

switch (ENV) {
  case "production":
    config = ProdConfig;
    game = ProdGame;
    mysqlConfig = ProdMysqlConfig;
    break;
  case "staging":
    config = StagingConfig;
    game = StagingGame;
    mysqlConfig = StagingMysqlConfig;
    break;
  case "local":
    config = LocalConfig;
    game = LocationGame;
    mysqlConfig = LocalMysqlConfig;
    break;
  default:
    break;
}

export const Config = config;
export const Game = game;
export const MysqlConfig = mysqlConfig;
