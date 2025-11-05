import { AccessCodeService } from "../../Global/Service/access.code.service";
import { AccountResponse, CreateAccountResponse, CurrentRResponse, GameListResponse, LogGetResponse, PlayResponse, ProvListResponse, TablelistResponse, Top30Response } from "./Interface/main.app.interface";
import { MainAppService } from "./main.app.service";
import { AccountDto, CreateAccountDto, GamelistDto, HashDto, ProvlistDto } from "./Dto/main.app.dto";
export declare class MainAppController {
    private readonly accessCodeService;
    private readonly mainAppService;
    constructor(accessCodeService: AccessCodeService, mainAppService: MainAppService);
    getIp(req: any, res: any): Promise<string>;
    hash(req: any, res: any, query: HashDto): Promise<any>;
    account(req: any, res: any, query: AccountDto): Promise<AccountResponse>;
    createAccount(req: any, res: any, query: CreateAccountDto): Promise<CreateAccountResponse>;
    provlist(req: any, res: any, query: ProvlistDto): Promise<ProvListResponse>;
    gamelist(req: any, res: any, query: GamelistDto): Promise<GameListResponse>;
    gamelist_new(req: any, res: any, query: GamelistDto): Promise<GameListResponse>;
    gameTablelist(req: any, res: any): Promise<TablelistResponse>;
    play(req: any, res: any, query: any, a_nVersion?: number): Promise<PlayResponse>;
    currentR(req: any, res: any, query: any, a_nVersion?: number): Promise<CurrentRResponse>;
    top30(req: any, res: any, query: any, a_nVersion?: number): Promise<Top30Response>;
    logGet(req: any, res: any, query: any, a_nVersion?: number): Promise<LogGetResponse>;
}
