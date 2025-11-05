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
exports.CustomerException = void 0;
const common_1 = require("@nestjs/common");
const error_code_msg_config_1 = require("../../Config/error.code.msg.config");
const log_service_1 = require("../../Utils/log.service");
let GlobalExceptionHandler = class GlobalExceptionHandler {
    logService;
    constructor(logService) {
        this.logService = logService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const path = req?.originalUrl || "";
        if (isBypassedPath(path))
            return;
        const isCust = exception instanceof CustomerException;
        const isHttp = exception instanceof common_1.HttpException;
        if (isCust) {
            customerErrorProcess(exception, host);
        }
        else {
            errorProcess(exception, host);
        }
    }
};
GlobalExceptionHandler = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [log_service_1.LogService])
], GlobalExceptionHandler);
exports.default = GlobalExceptionHandler;
function isBypassedPath(path) {
    const bypassPaths = [
        "/.well-known/acme-challenge",
        "/api/.well-known/acme-challenge",
        "/health",
    ];
    return bypassPaths.some((prefix) => path.startsWith(prefix));
}
const customerErrorProcess = (exception, host) => {
    try {
        const ctx = host?.switchToHttp();
        const resp = ctx?.getResponse();
        const req = ctx?.getRequest();
        const status = exception?.getStatus();
        const additionalError = exception?.getErrorResult();
        const additional = additionalError?.isHide ? {} : additionalError;
        resp.status(status).json({
            statusCode: exception?.getErrorCode(),
            timestamp: new Date().toISOString(),
            path: req?.originalUrl,
            result: {
                ...exception?.getErrorMessage(),
                ...additional,
            },
        });
    }
    catch (error) {
        console.error(`[GlobalExceptionHandler][customerErrorProcess] : `, error);
    }
};
const errorProcess = (exception, host) => {
    try {
        const ctx = host.switchToHttp();
        const resp = ctx.getResponse();
        const req = ctx.getRequest();
        const status = common_1.HttpStatus.BAD_REQUEST;
        resp.status(status).json({
            statusCode: error_code_msg_config_1.default?._200002.code,
            errMsg: error_code_msg_config_1.default._200002.msg,
            timestamp: new Date().toISOString(),
            path: req?.originalUrl,
            exception: { ...exception },
        });
    }
    catch (error) {
        console.error(`[GlobalExceptionHandler][errorProcess] : `, error);
    }
};
class CustomerException extends common_1.HttpException {
    errorVaule;
    constructor(errorVaule, statusCode) {
        super(errorVaule, statusCode);
        this.errorVaule = errorVaule;
    }
    getErrorCode() {
        return this.errorVaule.code;
    }
    getErrorResult() {
        return this.errorVaule.additional;
    }
    getErrorMessage() {
        return { msg: this.errorVaule.msg };
    }
}
exports.CustomerException = CustomerException;
//# sourceMappingURL=global.exception.handler.js.map