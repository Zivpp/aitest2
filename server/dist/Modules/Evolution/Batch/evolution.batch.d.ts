import { OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { AccessCodeService } from "../../../Global/Service/access.code.service";
import { ApiService } from "../../../Infrastructure/Api/api.service";
import { EvolutionService } from "../evolution.service";
export declare class EvolutionBatch implements OnApplicationBootstrap, OnModuleDestroy {
    private interval;
    private readonly apiService;
    private readonly evolutionService;
    private readonly accessCodeService;
    constructor(apiService: ApiService, evolutionService: EvolutionService, accessCodeService: AccessCodeService);
    onApplicationBootstrap(): void;
    loadTableList(): Promise<void>;
    loadJsonCodeList(): void;
    onModuleDestroy(): void;
}
