import { OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { AccessCodeService } from "../../../Global/Service/access.code.service";
export declare class MainAppBatch implements OnApplicationBootstrap, OnModuleDestroy {
    private interval;
    private readonly accessCodeService;
    constructor(accessCodeService: AccessCodeService);
    onApplicationBootstrap(): void;
    LoadGameCPList(): Promise<void>;
    loadDefSplash(): Promise<void>;
    LoadTopGames(): Promise<void>;
    onModuleDestroy(): void;
}
