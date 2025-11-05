import { AccessCodeService } from "../../Global/Service/access.code.service";
import { BalanceDto, CancelDto, CheckDto, CreditDto, DebitDto, sessionDto, SidDto } from "./Dto/evolution.dto";
import { EvolutionService } from "./evolution.service";
import { BalanceResponse, CancelResponse, CheckUserResponse, CreditResponse, DebitResponse, PromoPayoutResponse } from "./Interface/evolution.interface";
import { PromoPayoutDto } from "./Dto/evolution.promo.payout.dto";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { RedisService } from "src/Infrastructure/Redis/redis.service";
export declare class EvolutionController {
    private readonly accessCodeService;
    private readonly evolutionService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, evolutionService: EvolutionService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    getConfig(res: any): Promise<any>;
    sid(body: SidDto, res: any): Promise<any>;
    session(body: sessionDto, req: any): Promise<any>;
    check(body: CheckDto): Promise<CheckUserResponse>;
    balance(body: BalanceDto): Promise<BalanceResponse>;
    debit(body: DebitDto): Promise<DebitResponse>;
    credit(body: CreditDto): Promise<CreditResponse>;
    cancel(body: CancelDto): Promise<CancelResponse>;
    promoPayout(body: PromoPayoutDto): Promise<PromoPayoutResponse>;
}
