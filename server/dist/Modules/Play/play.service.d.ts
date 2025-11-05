import { AccessCodeService } from "src/Global/Service/access.code.service";
import { PlayDao } from "./play.dao";
import { COperatorGameInfo, PlayReqOperator } from "./Interface/play.interface";
import { ApiService } from "src/Infrastructure/Api/api.service";
export declare class PlayService {
    private readonly accessCodeService;
    private readonly apiService;
    private readonly playDao;
    constructor(accessCodeService: AccessCodeService, apiService: ApiService, playDao: PlayDao);
    loadOperatorGameInfo(opId: number): Promise<COperatorGameInfo | null>;
    getBetLimitType(a_objThirdparty: any, a_strBetLimitType: any): any;
    getEvolutionStartUrl(a_webRes: any, a_cOperator: any, a_cUser: any, a_strGameID: any, a_strPlatform: any, a_nGameCpKey: any, a_strUserAgent: any, a_strSiteUrl: any, a_strBetLimitType: any, a_strLanaguage: any, a_strCurrency: any): Promise<{
        result: number;
        error: {
            code: number;
            msg: string;
        };
        link?: undefined;
    } | {
        result: number;
        link: string;
        error?: undefined;
    }>;
    getCQ9hStartUrl(): Promise<void>;
    getPPSeamlessStartUrl(): Promise<void>;
    getPPTransferStartUrl(): Promise<void>;
    getDGStartUrl(): Promise<void>;
    getBNGStartUrl(a_webRes: any, a_cOperator: any, a_cUser: any, a_strGameID: any, a_strPlatform: any): Promise<{
        result: number;
        link: string;
    }>;
    getPlayStarStartUrl(): Promise<void>;
    getWMLiveStartUrl(): Promise<void>;
    getTGstartUrl(): Promise<void>;
    getAGStartUrl(): Promise<void>;
    getHabaneroStartUrl(): Promise<void>;
    getSportsStartUrl(): Promise<void>;
    getPGStartUrl(): Promise<void>;
    getMOAhStartUrl(): Promise<void>;
    getTaishanStartUrl(): Promise<void>;
    getDowinStartUrl(): Promise<void>;
    getMGPStartUrl(): Promise<void>;
    getKDStartUrl(): Promise<void>;
    getDCStartUrl(): Promise<void>;
    getVivoStartUrl(): Promise<void>;
    getPlayTechStartUrl(): Promise<void>;
    getBTiStartUrl(): Promise<void>;
    getAStarStartUrl(): Promise<void>;
    getAWCStartUrl(): Promise<void>;
    getFCStartUrl(): Promise<void>;
    getJDBStartUrl(): Promise<void>;
    getDBCasinoStartUrl(): Promise<void>;
    getHiddenPokerStartUrl(): Promise<void>;
    getBGStartUrl(): Promise<void>;
    getHRGStartUrl(): Promise<void>;
    getSCStartUrl(): Promise<void>;
    getSBStartUrl(): Promise<void>;
    getSAStartUrl(): Promise<void>;
    getCLPStartUrl(): Promise<void>;
    sendToCallbackServer(url: string, body: any): Promise<any>;
    getStartUrl(cp: string, cOperator: PlayReqOperator): Promise<any>;
    getOperatorGameServiceIndex(a_cOperator: any): any;
}
