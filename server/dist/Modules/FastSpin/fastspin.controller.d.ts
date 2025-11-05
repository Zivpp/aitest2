import { AccessCodeService } from "../../Global/Service/access.code.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { FastSpinService } from "./fastspin.service";
import { DepositDto, GetAcctInfoDto, GetBalanceDto, SessionDto, SidDto } from "./Dto/fastspin.dto";
import { DepositResponse, GetAcctInfoResponse, GetBalanceResponse, TransferResponse } from "./Interface/fastspin.interface";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
export declare class FastSpinController {
    private readonly accessCodeService;
    private readonly fastSpinService;
    private readonly apiService;
    private readonly coreGrpcService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, fastSpinService: FastSpinService, apiService: ApiService, coreGrpcService: CoreGrpcService, redisService: RedisService);
    routerCenter(req: any, res: any, body: any): Promise<any>;
    getHash(req: any, res: any): Promise<string>;
    sid(body: SidDto, res: any): Promise<any>;
    session(req: any, body: SessionDto): Promise<any>;
    getAcctInfo(req: any, res: any, body: GetAcctInfoDto): Promise<GetAcctInfoResponse>;
    deposit(req: any, res: any, body: DepositDto): Promise<DepositResponse>;
    getBalance(req: any, res: any, body: GetBalanceDto): Promise<GetBalanceResponse>;
    transfer(req: any, res: any, body: any): Promise<TransferResponse>;
}
