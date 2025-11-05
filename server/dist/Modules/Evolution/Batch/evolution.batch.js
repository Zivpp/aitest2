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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionBatch = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../../Config/config");
const access_code_service_1 = require("../../../Global/Service/access.code.service");
const api_service_1 = require("../../../Infrastructure/Api/api.service");
const evolution_service_1 = require("../evolution.service");
let EvolutionBatch = class EvolutionBatch {
    interval;
    apiService;
    evolutionService;
    accessCodeService;
    constructor(apiService, evolutionService, accessCodeService) {
        this.apiService = apiService;
        this.evolutionService = evolutionService;
        this.accessCodeService = accessCodeService;
    }
    onApplicationBootstrap() {
        if (process.env.APP_CONTEXT !== "HTTP") {
            console.log("[EvolutionBatch] Skipped – Not HTTP App");
            return;
        }
        if (process.env.GAME_START_CP_KEY === config_1.Game.Evolution.cp_key.toString()) {
            console.log("[EvolutionBatch] Starting batch...");
            this.loadTableList();
            this.loadJsonCodeList();
        }
    }
    async loadTableList() {
        const reloadTime = config_1.Config.GAME_USE_LIST_RELOAD_TIME;
        const intervalTime = 3 * 1000;
        this.interval = setInterval(async () => {
            try {
                await this.accessCodeService.loadTableListByCPKey(config_1.Game.Evolution.cp_key);
            }
            catch (error) {
                console.error("Error in loadTableList:", error);
            }
        }, intervalTime);
    }
    loadJsonCodeList() {
        const reloadTime = config_1.Config.TIME_MS_OF_MINUTE;
        const intervalTime = 3 * 1000;
        this.interval = setInterval(async () => {
            try {
                const listObj = await Promise.all([
                    this.evolutionService.getGameCodeList(config_1.Game.MOA_NETENT.cp_key),
                    this.evolutionService.getGameCodeList(config_1.Game.MOA_REDTIGER.cp_key),
                    this.evolutionService.getGameCodeList(config_1.Game.MOA_NOLIMITCITY.cp_key),
                    this.evolutionService.getGameCodeList(config_1.Game.BTG.cp_key),
                ]);
                await this.accessCodeService.setGSlot(listObj);
            }
            catch (error) {
                console.error("Error in LoadJsonCodeList:", error);
            }
        }, intervalTime);
    }
    onModuleDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            console.log("Cleared all interval");
        }
    }
};
exports.EvolutionBatch = EvolutionBatch;
exports.EvolutionBatch = EvolutionBatch = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_service_1.ApiService,
        evolution_service_1.EvolutionService,
        access_code_service_1.AccessCodeService])
], EvolutionBatch);
//# sourceMappingURL=evolution.batch.js.map