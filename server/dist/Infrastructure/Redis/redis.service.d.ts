import { OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
export declare class RedisService implements OnModuleDestroy {
    private readonly client;
    constructor(client: Redis);
    get(key: string): Promise<string | null>;
    getJson<T = any>(key: string): Promise<T | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<"OK">;
    del(key: string): Promise<number>;
    exists(key: string): Promise<number>;
    keys(pattern?: string): Promise<string[]>;
    flushAll(): Promise<"OK">;
    quit(): Promise<void>;
    onModuleDestroy(): void;
}
