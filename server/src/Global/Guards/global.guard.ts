import { CanActivate, ExecutionContext, HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "src/Infrastructure/Redis/redis.service";
import * as _Config from "../../Config/config";
import configError from "../../Config/error.code.msg.config";
import { CustomerException } from "../ExceptionHandler/global.exception.handler";

export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // 20250717 Ziv 服務屬於B2B服務, 不用驗證使用者登入情況, 以下方式不適用
    return true; // 直接通過即可

    // // White list API paths
    // const publicPathPrefixList = ['/api/test', '/api/grpc'];
    // if (publicPathPrefixList.some(prefix => req.originalUrl.startsWith(prefix))) {
    //   return true;
    // }

    // const apiPath = req.originalUrl.split('/');
    // try {
    //   // this.jwtService may be undefined in early bootstrap phase
    //   if (this.jwtService) {
    //     await this.authorizeRequest(req, apiPath);
    //     return true;
    //   }
    // } catch (error) {
    //   throw new CustomerException(
    //     {
    //       code: configError._200004.code,
    //       msg: error?.errorValue?.msg || error?.message || 'Unauthorized'
    //     },
    //     HttpStatus.FORBIDDEN
    //   );
    // }

    // // fallback: reject by default
    // return false;
  }

  /**
   * Verify token and check API access permission.
   * @param req
   * @param apiPath
   * @returns
   */
  async authorizeRequest(req, apiPath: string[]): Promise<boolean> {
    let { authorization } = req.headers;

    if (!authorization) {
      throw new CustomerException(configError._200003, HttpStatus.FORBIDDEN);
    }

    const token = authorization.split(" ")[1]; // Remove 'Bearer'

    const memberInfo = await this.getMemberInfoByToken(token);

    await this.hasApiPermission(apiPath, memberInfo);

    return true;
  }

  /**
   * Verify session: retrieve token from Redis
   * @param token
   * @returns
   */
  async getMemberInfoByToken(token) {
    // const memberKey = `${_Config.REDIS_KEY.TOKEN}:${token}`;
    // const memberRaw = await this.redisService.get(memberKey);
    // const memberInfo = memberRaw ? JSON.parse(memberRaw) : null; // 建立使用後，加上 Interface
    // // 如果 memberInfo 不存在 or token 不一樣請重新登入
    // // 如果存在 重新賦予兩個小時生命
    // if (!memberInfo || memberInfo?.token !== token) {
    //   throw new CustomerException(configError._200004, HttpStatus.FORBIDDEN);
    // }
    // // refresh TTL if valid
    // if (memberInfo) {
    //   await this.redisService.set(memberKey, memberInfo, 60 * 60 * 4);
    // }
    // return memberInfo;
  }

  /**
   * 檢查使用者是否有此 API 使用權限 by api path and db config
   * @param apiPath - Array of API path segments
   * @param memberInfo - [TODO] Interface
   * @returns
   */
  async hasApiPermission(apiPath: string[], memberInfo: any): Promise<boolean> {
    const apiPathChecked = `${apiPath[2]}/${apiPath[3]}`;

    // Sample: memberInfo.userAuthItem from redis or DB
    const userAuthItem: string[] = [];
    if (!userAuthItem.includes(apiPathChecked)) {
      throw new CustomerException(configError._200003, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
