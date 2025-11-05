import { AccessCodeService } from "../../Global/Service/access.code.service";
import { UserObj } from "../../Global/Service/interface/access.code.service.interface";
import { EvolutionDao } from "./evolution.dao";
import { CallbackType } from "./Enum/evolution.enum";
import { RedisService } from "src/Infrastructure/Redis/redis.service";
import { EvolutionDebitCheck } from "./Interface/evolution.interface";
export declare class EvolutionService {
    private readonly redisService;
    private readonly accessCodeService;
    private readonly evolutionDao;
    constructor(redisService: RedisService, accessCodeService: AccessCodeService, evolutionDao: EvolutionDao);
    userIdCheck(userObj: UserObj, strUserID: string): boolean;
    convertGrpcStatusToText(type: CallbackType, resCode: number): string;
    getGameCodeList(cpKey: number): Promise<Record<string, {
        cp_key: string;
        name: string;
    }>>;
    getCheckDebitKey(refId: string): string;
    getPreCancelKey(refId: string, id: string): string;
    getCheckDebitObj(refId: string): Promise<EvolutionDebitCheck | null>;
    initCheckDebitObj(refId: string): Promise<boolean>;
    endCheckDebitObj(refId: string, changeBy: string): Promise<boolean>;
}
