import { OnModuleDestroy } from "@nestjs/common";
import { Pool } from "mysql2/promise";
export declare class MysqlModule implements OnModuleDestroy {
    private readonly pool;
    constructor(pool: Pool);
    onModuleDestroy(): Promise<void>;
}
