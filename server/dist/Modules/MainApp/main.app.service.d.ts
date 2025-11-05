import { AccessCodeService } from "src/Global/Service/access.code.service";
import { ApiService } from "src/Infrastructure/Api/api.service";
import { MainAppDao } from "./main.app.dao";
import { CxUser, GameNewRow, TblOperator } from "./Interface/main.app.dao.interface";
import { Operator } from "./Interface/main.app.interface";
export declare class MainAppService {
    private readonly accessCodeService;
    private readonly mainAppDao;
    private readonly apiService;
    constructor(accessCodeService: AccessCodeService, mainAppDao: MainAppDao, apiService: ApiService);
    test(any: any): Promise<any>;
    getResultMsg(key: string, code: number | null): string;
    checkQueryString(a_strOPKey: string, a_query: string, a_strHash: string): boolean;
    getMd5Hash(opKey: string, queryStr: string): string;
    getMd5EncHash(opKey: string, queryStr: string): string;
    getOperatorInfo(a_strOPKey: string, a_strIP: string): Promise<TblOperator | null>;
    findUserByOperatorAndUserIdOrg(opId: string, a_strUserID: string): Promise<CxUser | null>;
    createUser(opId: string, a_strUserID: string, reqCxUser: CxUser, a_nVersion?: number): Promise<CxUser | null>;
    getCPList(): Promise<import("./Interface/main.app.dao.interface").CxGameCp[]>;
    getGameListTableType(cpkey: string, version: number): Promise<any>;
    getGameList(cpkey: string, version: number): Promise<any>;
    checkParams(req: any): Promise<{
        result: number;
        data: {
            user: {};
            params: {};
            operator: {
                id: number;
            };
        };
    }>;
    procChkOperator(opkey: string, ip: string): Promise<Operator | null>;
    getTransferBalance(opId: string, opKey: string, userKey: string, userId: string): Promise<any>;
    getGameMTCode(strThirdPartyCode: string, strGameCode: string): Promise<any>;
    checkGamePermit(a_nOPID: number, a_nGameCPKey: number, a_strGameCode: string): Promise<number>;
    decodeSiteUrlOrDefault(strSiteUrl: string): Promise<string>;
    loadOperatorData(oId: string, oName: string): Promise<any>;
    getOperatorSplashList_name(name: string): Promise<{
        name: any;
        url: any;
        css: {
            bg_color: any;
            img_size: any;
        };
    } | null>;
    UseSplashProcess(cOperator: Operator, objPlayData: any, cUser: CxUser): Promise<{
        result: number;
        data: {
            token: string;
            link: string;
        };
    }>;
    loadOperatorGameInfo(oId: number): Promise<void>;
    NoUseSplashProcess(operator: Operator, objPlayData: any, cUser: CxUser): Promise<any>;
    getR(opId: number): Promise<any>;
    getBetLog(opkey: number, roundid: string): Promise<import("./Interface/main.app.dao.interface").BetLogRes | null>;
    logCalling(strUserID: string, objCPData: any, objCheckResult: any, logResult: any): Promise<any>;
    logViewData(objLogData: any): Promise<any>;
    getNewGameList(): Promise<GameNewRow[] | {
        list: GameNewRow[];
    }>;
}
