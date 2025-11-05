import { Provider } from "@nestjs/common";
import Redis from "ioredis";
import { Config } from "../../Config/config";

export const REDIS_CLIENT = "REDIS_CLIENT";

export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: async () => {
      const client = new Redis({
        host: Config.REDIS.HOST,
        port: Config.REDIS.PORT,
        password: Config.REDIS.PASSWORD,
      });

      // console.log('Config.REDIS.HOST, >>>>', Config.REDIS.HOST)
      // console.log('Config.REDIS.PORT, >>>>', Config.REDIS.PORT)
      // console.log('Config.REDIS.PASSWORD, >>>>', Config.REDIS.PASSWORD)

      client.on("error", (err) => {
        console.error("[Redis] Connection Error:", err);
      });

      return client;
    },
  },
];
