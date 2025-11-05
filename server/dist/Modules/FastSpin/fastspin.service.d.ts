import { AccessCodeService } from "../../Global/Service/access.code.service";
import { TokenWrapper, UserObj } from "../../Global/Service/interface/access.code.service.interface";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
export declare class FastSpinService {
    private readonly accessCodeService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    getPublicUserID(a_nOPID: number, a_nUserKey: number, a_strFix?: string): string;
    addTokenSign(opId: number, userKey: number, token: TokenWrapper): Promise<void>;
    getUserIndObj(acctId: string): Promise<UserObj>;
    verifyDigest(_digest: string, req: any): Promise<Number>;
    getDigest(req: any): string;
    getKeyDebitTransferPrefix(transferId: string): string;
    getKeyDebitReferencePrefix(referenceId: string): string;
    transferIdCheck(transferId: string): Promise<boolean>;
    transferBetProcess(response: any, req: any, userObj: any, objThirdparty: any): Promise<void>;
    transferCancelProcess(response: any, req: any, userObj: any, objThirdparty: any): Promise<void>;
    transferPayoutProcess(response: any, req: any, userObj: any, objThirdparty: any): Promise<void>;
    transferBonusProcess(response: any, req: any, userObj: any, objThirdparty: any): Promise<void>;
}
