import { AccessCodeService } from "../../Global/Service/access.code.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
export declare class ClpService {
    private readonly accessCodeService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, coreGrpcService: CoreGrpcService, redisService: RedisService);
}
