import { AccessCodeService } from "../../Global/Service/access.code.service";
import { UserObj } from "../../Global/Service/interface/access.code.service.interface";
import { CallbackType } from "./Enum/pp.enum";
import { ObjResult, ObjThirdParty } from "../../Grpc/Clients/Interface/core.service.interface";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
export declare class PpService {
    private readonly accessCodeService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, redisService: RedisService);
    inValidToken(userObj: UserObj): boolean;
    userIdCheck(userObj: UserObj, strUserID: string): boolean;
    convertGrpcStatusToText(type: CallbackType, resCode: number): string;
    getThirdPartObjByCpKey(cpKey: string): any;
    buildServiceResult(gRPCResult: ObjResult, userObj: UserObj, objThirdparty: ObjThirdParty, type: CallbackType): any;
    isCasino(a_strGameCode: string): boolean;
    getThirdPartyObject(gameId: string, userCpKey: string): any;
    getTransData(a_strThirdpartyTransID: string): Promise<any>;
}
