import { AccessCodeService } from "../../Global/Service/access.code.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { HrgService } from "./hrg.service";
import { CancelBetDto, EventSettleDto, PlaceBetDto, SettleDto } from "./Dto/hrg.dto";
export declare class HrgController {
    private readonly accessCodeService;
    private readonly hrgService;
    private readonly apiService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, hrgService: HrgService, apiService: ApiService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    session(req: any, body: any): Promise<any>;
    bet(req: any, res: any, body: any): Promise<any>;
    place_bet(req: any, res: any, body: PlaceBetDto): Promise<any>;
    cancel_bet(req: any, res: any, body: CancelBetDto): Promise<any>;
    settle(req: any, res: any, body: SettleDto): Promise<any>;
    eventSettle(req: any, res: any, body: EventSettleDto): Promise<any>;
}
