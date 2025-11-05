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
export class MainAppBatch implements OnApplicationBootstrap, OnModuleDestroy {
  private interval: NodeJS.Timeout;
  private readonly accessCodeService: AccessCodeService;

  constructor(accessCodeService: AccessCodeService) {
    this.accessCodeService = accessCodeService;
  }

  onApplicationBootstrap() {
    // gRPC Server 不會啟動
    if (process.env.APP_CONTEXT !== "HTTP") {
      console.log("[MainAppBatch] Skipped – Not HTTP App");
      return;
    }

    console.log(
      "process.env.GAME_START_CP_KEY > ",
      process.env.GAME_START_CP_KEY,
    );
    // No GAME_START_CP_KEY = main app
    if (!process.env.GAME_START_CP_KEY) {
      console.log("[MainAppBatch] Starting batch...");
      this.LoadGameCPList();
      // this.loadDefSplash();
    }
  }

  async LoadGameCPList() {
    // const intervalTime = Config.TIME_MS_OF_HOUR;
    const intervalTime = 3 * 1000; // for test
    this.interval = setInterval(async () => {
      try {
        await this.accessCodeService.LoadGameCPList(true);
      } catch (error) {
        console.error("Error in LoadGameCPList:", error);
      }
    }, intervalTime);
  }

  async loadDefSplash() {
    // const  intervalTime = Config.TIME_MS_OF_MINUTE * 5;
    const intervalTime = 3 * 1000; // for test
    this.interval = setInterval(async () => {
      try {
        const splash = await this.accessCodeService.getDefSplashList(
          Config.SPLASH_DEF_NAME,
        );
        console.log("splash > ", splash);
        this.accessCodeService.setGOpSplash(splash);
      } catch (error) {
        console.error("Error in loadDefSplash:", error);
      }
    }, intervalTime);
  }

  async LoadTopGames() {
    // const intervalTime = Config.TIME_MS_OF_HOUR;
    const intervalTime = 4 * 1000; // for test
    this.interval = setInterval(async () => {
      try {
        // 指定檔案 todo
      } catch (error) {
        console.error("Error in LoadTopGames:", error);
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
