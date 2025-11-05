import { AccessCodeService } from "../../Global/Service/access.code.service";
import { UserObj } from "../../Global/Service/interface/access.code.service.interface";
import { HandleRawDto } from "./Dto/bng.dto";
import { GetBalanceResponse, LoginResponse } from "./Interface/bng.interface";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
export declare class BngService {
    private readonly accessCodeService;
    private readonly coreGrpcService;
    constructor(accessCodeService: AccessCodeService, coreGrpcService: CoreGrpcService);
    login(body: HandleRawDto, objThirdparty: any, userObj: UserObj): Promise<LoginResponse>;
    getBalance(body: HandleRawDto, objThirdparty: any, userObj: UserObj): Promise<GetBalanceResponse>;
    transaction(body: HandleRawDto, objThirdparty: any, userObj: UserObj): Promise<any>;
    private transactionBetGRPCCalling;
    private transactionResultGRPCCalling;
    rollback(body: HandleRawDto, objThirdparty: any, userObj: UserObj): Promise<{
        uid: string;
        balance: {
            value: string;
            version: number;
        };
    }>;
}
