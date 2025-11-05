import { CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/Infrastructure/Redis/redis.service";
export declare class AuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly redisService;
    constructor(jwtService: JwtService, redisService: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    authorizeRequest(req: any, apiPath: string[]): Promise<boolean>;
    getMemberInfoByToken(token: any): Promise<void>;
    hasApiPermission(apiPath: string[], memberInfo: any): Promise<boolean>;
}
