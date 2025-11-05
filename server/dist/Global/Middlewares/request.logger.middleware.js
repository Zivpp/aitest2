"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RequestLoggerMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const elk_level_enum_1 = require("../../Enum/elk.level.enum");
const state_code_enum_1 = require("../../Enum/state.code.enum");
const log_service_1 = require("../../Utils/log.service");
const logService = new log_service_1.LogService();
const NS_TO_MS = 1e6;
const MS_TO_S = 1e3;
const getDurationInMilliseconds = (start) => {
    return Number(start) / NS_TO_MS;
};
let RequestLoggerMiddleware = RequestLoggerMiddleware_1 = class RequestLoggerMiddleware {
    logger = new common_1.Logger(RequestLoggerMiddleware_1.name);
    use(req, res, next) {
        const elkLogObj = {};
        const start = getDurationInMilliseconds(process.hrtime.bigint());
        try {
            const originalWrite = res.write;
            const originalEnd = res.end;
            const chunks = [];
            res.write = (...args) => {
                if (args[0]) {
                    chunks.push(Buffer.from(args[0]));
                }
                return originalWrite.apply(res, args);
            };
            res.end = (...args) => {
                if (args[0]) {
                    chunks.push(Buffer.from(args[0]));
                }
                const body = Buffer.concat(chunks).toString("utf8");
                let parsedBody;
                try {
                    if (body) {
                        parsedBody = JSON.parse(body);
                    }
                }
                catch (error) {
                    console.error("[RequestLoggerMiddleware][JSON.parse]:", error);
                    parsedBody = body;
                }
                elkLogObj.headers = JSON.stringify(req.headers);
                elkLogObj.response = JSON.stringify(parsedBody?.result ?? parsedBody);
                return originalEnd.apply(res, args);
            };
        }
        catch (error) {
            this.handleErrorLogging(error, req, res, elkLogObj);
        }
        next();
        res.on("finish", () => {
            const end = getDurationInMilliseconds(process.hrtime.bigint());
            const ms = end - start;
            const s = ms / MS_TO_S;
            this.logger.log(`[${res.statusCode}] ${req.method} ${req.originalUrl} ${ms.toFixed(4)} ms (${s.toFixed(2)} s)`);
            this.fillELKLog(req, res, elkLogObj, ms, s);
            console.info('[Request]');
            console.info(elkLogObj?.request);
            console.info('[Response]');
            console.info(elkLogObj?.response);
            logService.logToELK(elkLogObj);
        });
    }
    handleErrorLogging(error, req, res, elkLogObj) {
        console.error("[RequestLoggerMiddleware][Error]:", error);
        elkLogObj.status = res?.statusCode;
        elkLogObj.code = state_code_enum_1.STATE_CODE.UNEXPECTED;
        elkLogObj.level = elk_level_enum_1.ELK_LEVEL.WARN;
        elkLogObj.method = req?.method;
        elkLogObj.request = req?.body;
        elkLogObj.route = req?.originalUrl;
        elkLogObj.msg =
            typeof error === "object" ? JSON.stringify(error) : String(error);
        elkLogObj.sourceIP = this.getClientIP(req);
        elkLogObj.service = process.env.APP_NAME || "unknown";
        logService.logToELK(elkLogObj);
    }
    fillELKLog(req, res, elkLogObj, ms, s) {
        elkLogObj.status = res?.statusCode;
        elkLogObj.code = res?.code || state_code_enum_1.STATE_CODE.SUCCESS;
        elkLogObj.level = res?.level ?? elk_level_enum_1.ELK_LEVEL.INFO;
        elkLogObj.method = req?.method;
        elkLogObj.request = req?.body;
        elkLogObj.route = req?.originalUrl;
        elkLogObj.timing = `${ms.toFixed(4)} ms (${s.toFixed(2)} s)`;
        elkLogObj.msg = res?.msg || "unknown";
        elkLogObj.sourceIP = this.getClientIP(req);
        elkLogObj.service = process.env.APP_NAME || "unknown";
        elkLogObj.exectime = Math.floor(ms);
    }
    getClientIP(req) {
        const xForwardedFor = req.headers["x-forwarded-for"];
        return typeof xForwardedFor === "string"
            ? xForwardedFor.split(",")[0].trim()
            : req.socket.remoteAddress || "";
    }
};
exports.RequestLoggerMiddleware = RequestLoggerMiddleware;
exports.RequestLoggerMiddleware = RequestLoggerMiddleware = RequestLoggerMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], RequestLoggerMiddleware);
//# sourceMappingURL=request.logger.middleware.js.map