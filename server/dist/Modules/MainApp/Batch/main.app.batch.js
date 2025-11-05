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
exports.MainAppBatch = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("../../../Config/config");
const access_code_service_1 = require("../../../Global/Service/access.code.service");
let MainAppBatch = class MainAppBatch {
    interval;
    accessCodeService;
    constructor(accessCodeService) {
        this.accessCodeService = accessCodeService;
    }
    onApplicationBootstrap() {
        if (process.env.APP_CONTEXT !== "HTTP") {
            console.log("[MainAppBatch] Skipped – Not HTTP App");
            return;
        }
        console.log("process.env.GAME_START_CP_KEY > ", process.env.GAME_START_CP_KEY);
        if (!process.env.GAME_START_CP_KEY) {
            console.log("[MainAppBatch] Starting batch...");
            this.LoadGameCPList();
        }
    }
    async LoadGameCPList() {
        const intervalTime = 3 * 1000;
        this.interval = setInterval(async () => {
            try {
                await this.accessCodeService.LoadGameCPList(true);
            }
            catch (error) {
                console.error("Error in LoadGameCPList:", error);
            }
        }, intervalTime);
    }
    async loadDefSplash() {
        const intervalTime = 3 * 1000;
        this.interval = setInterval(async () => {
            try {
                const splash = await this.accessCodeService.getDefSplashList(config_1.Config.SPLASH_DEF_NAME);
                console.log("splash > ", splash);
                this.accessCodeService.setGOpSplash(splash);
            }
            catch (error) {
                console.error("Error in loadDefSplash:", error);
            }
        }, intervalTime);
    }
    async LoadTopGames() {
        const intervalTime = 4 * 1000;
        this.interval = setInterval(async () => {
            try {
            }
            catch (error) {
                console.error("Error in LoadTopGames:", error);
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
exports.MainAppBatch = MainAppBatch;
exports.MainAppBatch = MainAppBatch = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService])
], MainAppBatch);
//# sourceMappingURL=main.app.batch.js.map