import { AccessCodeService } from "../../Global/Service/access.code.service";
import { BngService } from "./bng.service";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { SessionDto, SidDto } from "./Dto/bng.dto";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
export declare class BngController {
    private readonly accessCodeService;
    private readonly bngService;
    private readonly apiService;
    private readonly redisService;
    constructor(accessCodeService: AccessCodeService, bngService: BngService, apiService: ApiService, redisService: RedisService);
    sid(body: SidDto, res: any): Promise<any>;
    session(req: any, body: SessionDto): Promise<any>;
    handleRaw(res: any, body: any): Promise<any>;
}
