import { AccessCodeService } from "../../Global/Service/access.code.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { ClpService } from "./clp.service";
export declare class ClpController {
    private readonly accessCodeService;
    private readonly clpService;
    private readonly apiService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, clpService: ClpService, apiService: ApiService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    session(req: any, body: any): Promise<any>;
    getBalance(req: any, res: any, query: any): Promise<any>;
    bet(req: any, res: any, body: any): Promise<any>;
    settlement(req: any, res: any, body: any): Promise<any>;
    cancel(req: any, res: any, body: any): Promise<any>;
}
