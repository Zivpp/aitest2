import { AccessCodeService } from "../../Global/Service/access.code.service";
import { TokenWrapper, UserObj } from "../../Global/Service/interface/access.code.service.interface";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
export declare class QqpkService {
    private readonly accessCodeService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    makeSign(params: any): any;
    addTokenSign(opId: number, userKey: number, token: TokenWrapper): Promise<string>;
    getPublicUserID(a_nOPID: any, a_nUserKey: number, a_strFix?: string): string;
    getUserIndObj(acctId: string): Promise<UserObj>;
}
