import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { Config, Game } from "../../../Config/config";
import { AccessCodeService } from "../../../Global/Service/access.code.service";
import { ApiService } from "../../../Infrastructure/Api/api.service";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class PPBatch implements OnApplicationBootstrap, OnModuleDestroy {
  private interval: NodeJS.Timeout;
  private readonly apiService: ApiService;
  private readonly accessCodeService: AccessCodeService;

  constructor(apiService: ApiService, accessCodeService: AccessCodeService) {
    this.apiService = apiService;
    this.accessCodeService = accessCodeService;
  }

  onApplicationBootstrap() {
    // gRPC Server 不會啟動
    if (process.env.APP_CONTEXT !== "HTTP") {
      console.log("[PP Batch] Skipped – Not HTTP App");
      return;
    }

    if (process.env.GAME_START_CP_KEY === Game.PP.cp_key.toString()) {
      console.log("[PP Batch] Starting batch...");
      this.loadTableList();
    }
  }

  /**
   * load table list every hour
   */
  async loadTableList() {
    const reloadTime = Config.GAME_USE_LIST_RELOAD_TIME;
    // const intervalTime = (reloadTime ?? 60000) * 3;
    const intervalTime = 3 * 1000; // for test

    this.interval = setInterval(async () => {
      try {
        // console.info('loadTableList run : ', intervalTime, ' | ', new Date().toISOString());
        await this.accessCodeService.loadTableListByCPKey(Game.PP_LIVE.cp_key);
      } catch (error) {
        console.error("Error in loadTableList:", error);
      }
    }, intervalTime);
  }

  /**
   * clear interval
   */
  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      console.log("Cleared all interval");
    }
  }
}
