import { AccessCodeService } from "../../Global/Service/access.code.service";
import { PpService } from "./pp.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { BalanceResponse, BetResponse, BonusWinResponse, EndRoundResponse, JackpotWinResponse, PromoWinResponse, ResultResponse } from "./Interface/pp.interface";
export declare class PpController {
    private readonly accessCodeService;
    private readonly ppService;
    private readonly apiService;
    private readonly coreGrpcService;
    constructor(accessCodeService: AccessCodeService, ppService: PpService, apiService: ApiService, coreGrpcService: CoreGrpcService);
    session(req: any, body: any): Promise<any>;
    auth(body: any, res: any): Promise<any>;
    balance(body: any, res: any): Promise<BalanceResponse>;
    bet(body: any, res: any): Promise<BetResponse>;
    result(body: any, res: any): Promise<ResultResponse>;
    refund(body: any, res: any): Promise<ResultResponse>;
    bonusWin(body: any, res: any): Promise<BonusWinResponse>;
    jackpotWin(body: any, res: any): Promise<JackpotWinResponse>;
    promoWin(body: any, res: any): Promise<PromoWinResponse>;
    endround(body: any, res: any): Promise<EndRoundResponse>;
}
