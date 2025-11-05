import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import { REDIS_CLIENT } from "./redis.provider";

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async getJson<T = any>(key: string): Promise<T | null> {
    const val = await this.get(key);
    try {
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<"OK"> {
    const serialized =
      typeof value === "string" ? value : JSON.stringify(value);
    if (ttlSeconds) {
      return this.client.set(key, serialized, "EX", ttlSeconds);
    }
    return this.client.set(key, serialized);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async keys(pattern = "*"): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async flushAll(): Promise<"OK"> {
    return this.client.flushall();
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }

  onModuleDestroy() {
    this.quit();
  }
}
