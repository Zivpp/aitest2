"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const error_code_msg_config_1 = require("../../Config/error.code.msg.config");
const global_exception_handler_1 = require("../ExceptionHandler/global.exception.handler");
class AuthGuard {
    jwtService;
    redisService;
    constructor(jwtService, redisService) {
        this.jwtService = jwtService;
        this.redisService = redisService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        return true;
    }
    async authorizeRequest(req, apiPath) {
        let { authorization } = req.headers;
        if (!authorization) {
            throw new global_exception_handler_1.CustomerException(error_code_msg_config_1.default._200003, common_1.HttpStatus.FORBIDDEN);
        }
        const token = authorization.split(" ")[1];
        const memberInfo = await this.getMemberInfoByToken(token);
        await this.hasApiPermission(apiPath, memberInfo);
        return true;
    }
    async getMemberInfoByToken(token) {
    }
    async hasApiPermission(apiPath, memberInfo) {
        const apiPathChecked = `${apiPath[2]}/${apiPath[3]}`;
        const userAuthItem = [];
        if (!userAuthItem.includes(apiPathChecked)) {
            throw new global_exception_handler_1.CustomerException(error_code_msg_config_1.default._200003, common_1.HttpStatus.FORBIDDEN);
        }
        return true;
    }
}
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=global.guard.js.map