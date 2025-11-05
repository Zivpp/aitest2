import { OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { AccessCodeService } from "../../../Global/Service/access.code.service";
import { ApiService } from "../../../Infrastructure/Api/api.service";
export declare class PPBatch implements OnApplicationBootstrap, OnModuleDestroy {
    private interval;
    private readonly apiService;
    private readonly accessCodeService;
    constructor(apiService: ApiService, accessCodeService: AccessCodeService);
    onApplicationBootstrap(): void;
    loadTableList(): Promise<void>;
    onModuleDestroy(): void;
}
