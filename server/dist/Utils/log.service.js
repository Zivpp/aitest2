"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const common_1 = require("@nestjs/common");
const tools_1 = require("./tools");
let LogService = class LogService {
    errorLogToElk(func, sourceType, level, msg, code, timing = "end") {
        const now = Date.now();
        const log = [
            `function=${func}`,
            `level=${level}`,
            `msg=${msg ?? ""}`,
            `code=${code ?? ""}`,
            `time=${(0, tools_1.UTCToTimeString)(now)}`,
            `timing=${timing}`,
            `sourceType=${sourceType}`,
            `service=crm_backstage`,
        ].join("|");
        console.error(log);
    }
    logToELK(reqObj) {
        try {
            const log = {};
            try {
                const body = reqObj?.request?.body ?? reqObj.request;
                log.request = body ? JSON.stringify(body) : "";
            }
            catch (err) {
                log.request = `[request stringify error] ${err.message}`;
            }
            try {
                const responseStr = reqObj.response
                    ? JSON.stringify(reqObj.response)
                    : "";
                log.response = responseStr;
            }
            catch (err) {
                log.response = `[response JSON stringify ERROR] ${err.message}`;
            }
            log.time = (0, tools_1.UTCToTimeString)(new Date());
            for (const key of Object.keys(reqObj)) {
                if (!log[key] && reqObj[key] !== undefined && reqObj[key] !== null) {
                    log[key] = String(reqObj[key]);
                }
            }
            const elkLog = Object.entries(log)
                .map(([k, v]) => `${k}=${v}`)
                .join("|");
            console.info(elkLog);
        }
        catch (err) {
            console.error("[LogService][printELKLog] error:", err);
        }
    }
};
exports.LogService = LogService;
exports.LogService = LogService = __decorate([
    (0, common_1.Injectable)()
], LogService);
//# sourceMappingURL=log.service.js.map