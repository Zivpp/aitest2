import { Injectable } from "@nestjs/common";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import { UserObj } from "../../Global/Service/interface/access.code.service.interface";
import { EvolutionDao } from "./evolution.dao";

import * as _ from "lodash";
import { CallbackType, Status } from "./Enum/evolution.enum";
import { SUCCESS } from "../../Config/result.code";
import { Config } from "../../Config/config";
import { RedisService } from "src/Infrastructure/Redis/redis.service";
import { EvolutionDebitCheck } from "./Interface/evolution.interface";

@Injectable()
export class EvolutionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly accessCodeService: AccessCodeService,
    private readonly evolutionDao: EvolutionDao,
  ) {}

  userIdCheck(userObj: UserObj, strUserID: string): boolean {
    let isCheckResult = false;

    const opCode = this.accessCodeService.getOperatorCode(userObj.op);
    // console.log('opCode >>>>', opCode)
    switch (userObj.v) {
      case 2:
        const _LEG = Config.MAX_USER_ID_BODY_LEN;
        const userKeyStr = userObj.key.toString().padStart(_LEG!, "0");
        const checkId = [opCode, userKeyStr].join("");
        // console.log('[v][2] checkId >>>', checkId)
        isCheckResult = checkId === strUserID;
        break;
      default:
        const userOpId = this.accessCodeService.getUserOPID(opCode, userObj.id);
        console.log("[v][1] userOpId >>>", userOpId);
        console.log("[v][1] strUserID >>>", strUserID);
        isCheckResult = userOpId === strUserID;
        break;
    }

    return isCheckResult;
  }

  /**
   * Convert gRPC status to text
   * @param type CallbackType
   * @param resCode
   * @returns string
   */
  convertGrpcStatusToText(type: CallbackType, resCode: number): string {
    let status;
    switch (type) {
      case CallbackType.MemberCheck:
        status = resCode === SUCCESS ? Status.OK : Status.INVALID_TOKEN_ID;
        break;
      case CallbackType.Balance:
        status = resCode === SUCCESS ? Status.OK : Status.INVALID_TOKEN_ID;
        break;
      case CallbackType.Bet:
        status =
          resCode === SUCCESS
            ? Status.OK
            : resCode === 5001 || resCode === 21011
              ? Status.INSUFFICIENT_FUNDS
              : resCode === 20201
                ? Status.BET_ALREADY_EXIST
                : Status.UNKNOWN_ERROR;
        break;
      case CallbackType.Result:
        status =
          resCode === SUCCESS
            ? Status.OK
            : resCode === 20202 || resCode === 20206 || resCode === 20204
              ? Status.BET_ALREADY_SETTLED
              : Status.UNKNOWN_ERROR;
        break;
      case CallbackType.Refund:
        status =
          resCode === SUCCESS
            ? Status.OK
            : resCode === 20202 || resCode === 20203
              ? Status.BET_ALREADY_SETTLED
              : resCode === 20200
                ? Status.BET_DOES_NOT_EXIST
                : Status.UNKNOWN_ERROR;
        break;
      default:
        status = Status.UNKNOWN_ERROR;
        break;
    }
    return status;
  }

  /**
   * Get game code list by cp key
   * @param cpKey cp key
   * @returns game code list
   */
  async getGameCodeList(cpKey: number) {
    const rows = await this.evolutionDao.getGameCodeListByCpkey(cpKey);

    if (!rows || rows.length === 0) return {};

    const objList: Record<string, { cp_key: string; name: string }> = {};
    for (const row of rows) {
      objList[row.game_code] = {
        cp_key: row.game_cp_key,
        name: row.game_name_eng,
      };
    }

    return objList;
  }

  /**
   * Get check debit key ; Use function and input restrictions to reduce errors and reusability
   * @param refId string
   * @returns key ; string
   */
  getCheckDebitKey(refId: string) {
    return `${Config.EVOLUTION_DEBIT_CHECK_PREFIX}${refId}`;
  }

  /**
   * Get pre cancel key ; Use function and input restrictions to reduce errors and reusability
   * @param refId string
   * @param id string
   * @returns key ; string
   */
  getPreCancelKey(refId: string, id: string) {
    return `${Config.EVOLUTION_PRE_CANCEL_PREFIX}${refId}_${id}`;
  }

  /**
   * Get check debit obj ; Use function and input restrictions to reduce errors and reusability
   * @param refId string
   * @returns EvolutionDebitCheck | null
   */
  async getCheckDebitObj(refId: string): Promise<EvolutionDebitCheck | null> {
    const checkDebitKey = this.getCheckDebitKey(refId);
    let refStr: string | null = await this.redisService.get(checkDebitKey);
    const debitCheckObj = refStr ? JSON.parse(refStr) : null;
    return debitCheckObj;
  }

  /**
   * Init check debit obj ; Use function and input restrictions to reduce errors and reusability
   * @param refId string
   * @returns boolean
   */
  async initCheckDebitObj(refId: string): Promise<boolean> {
    const checkDebitKey = this.getCheckDebitKey(refId);
    await this.redisService.set(
      checkDebitKey,
      JSON.stringify(Config.EVOLUTION_DEBIT_CHECK_INIT),
      Config.REDIS.GAME_USE_LIST_USE_KEEP_SEC,
    );
    return true;
  }

  /**
   * End check debit obj ; Use function and input restrictions to reduce errors and reusability
   * @param refId string
   * @returns boolean
   */
  async endCheckDebitObj(refId: string, changeBy: string): Promise<boolean> {
    const checkDebitKey = this.getCheckDebitKey(refId);
    const obj = JSON.parse(JSON.stringify(Config.EVOLUTION_DEBIT_CHECK_INIT));
    obj.isEnd = true;
    obj.changeBy = changeBy;
    await this.redisService.set(
      checkDebitKey,
      JSON.stringify(obj),
      Config.REDIS.GAME_USE_LIST_USE_KEEP_SEC,
    );
    return true;
  }
}
