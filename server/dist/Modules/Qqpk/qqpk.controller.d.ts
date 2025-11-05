import { AccessCodeService } from "../../Global/Service/access.code.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { SessionDto, SidDto } from "./Dto/qqpk.dto";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { QqpkService } from "./qqpk.service";
export declare class QqpkController {
    private readonly accessCodeService;
    private readonly qqpkService;
    private readonly apiService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, qqpkService: QqpkService, apiService: ApiService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    makeSign(req: any, res: any, body: any): Promise<string>;
    sid(body: SidDto, res: any): Promise<any>;
    session(req: any, body: SessionDto): Promise<any>;
    balance(req: any, res: any, body: any): Promise<any>;
    debit(req: any, res: any, body: any): Promise<any>;
    credit(req: any, res: any, body: any): Promise<any>;
}
