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
import { EvolutionService } from "../evolution.service";

@Injectable()
export class EvolutionBatch implements OnApplicationBootstrap, OnModuleDestroy {
  private interval: NodeJS.Timeout;
  private readonly apiService: ApiService;
  private readonly evolutionService: EvolutionService;
  private readonly accessCodeService: AccessCodeService;

  constructor(
    apiService: ApiService,
    evolutionService: EvolutionService,
    accessCodeService: AccessCodeService,
  ) {
    this.apiService = apiService;
    this.evolutionService = evolutionService;
    this.accessCodeService = accessCodeService;
  }

  onApplicationBootstrap() {
    // gRPC Server 不會啟動
    if (process.env.APP_CONTEXT !== "HTTP") {
      console.log("[EvolutionBatch] Skipped – Not HTTP App");
      return;
    }

    // GAME_START_CP_KEY = Evolution cp_key
    if (process.env.GAME_START_CP_KEY === Game.Evolution.cp_key.toString()) {
      console.log("[EvolutionBatch] Starting batch...");
      this.loadTableList();
      this.loadJsonCodeList();
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
        await this.accessCodeService.loadTableListByCPKey(
          Game.Evolution.cp_key,
        );
      } catch (error) {
        console.error("Error in loadTableList:", error);
      }
    }, intervalTime);
  }

  loadJsonCodeList() {
    const reloadTime = Config.TIME_MS_OF_MINUTE;
    // const intervalTime = (reloadTime ?? 60000) * 3;
    const intervalTime = 3 * 1000; // for test
    this.interval = setInterval(async () => {
      try {
        // console.info('LoadJsonCodeList run : ', intervalTime, ' | ', new Date().toISOString());
        const listObj = await Promise.all([
          this.evolutionService.getGameCodeList(Game.MOA_NETENT.cp_key),
          this.evolutionService.getGameCodeList(Game.MOA_REDTIGER.cp_key),
          this.evolutionService.getGameCodeList(Game.MOA_NOLIMITCITY.cp_key),
          this.evolutionService.getGameCodeList(Game.BTG.cp_key),
        ]);
        await this.accessCodeService.setGSlot(listObj);
        // console.log('listObj >>>>>', listObj)
      } catch (error) {
        console.error("Error in LoadJsonCodeList:", error);
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
