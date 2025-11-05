import { BadRequestException, Injectable } from "@nestjs/common";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import { UserObj } from "../../Global/Service/interface/access.code.service.interface";

import * as _ from "lodash";
import { SUCCESS } from "../../Config/result.code";
import { CallbackType } from "./Enum/pp.enum";
import { Game } from "../../Config/config";
import {
  ObjResult,
  ObjThirdParty,
} from "../../Grpc/Clients/Interface/core.service.interface";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { Config } from "../../Config/config";

@Injectable()
export class PpService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Check whether the token contains the required properties: { key, id, op, dt }.
   * If all are present, the token is considered valid and inValid is set to false.
   * @param userObj UserObj
   * @returns boolean
   */
  inValidToken(userObj: UserObj) {
    if (_.isNil(userObj) || _.isEmpty(userObj)) {
      return true;
    }

    const requiredKeys = ["key", "id", "op", "dt"];
    if (requiredKeys.some((k) => !userObj.hasOwnProperty(k))) {
      return true;
    }

    return false; // 反向判斷
  }

  userIdCheck(userObj: UserObj, strUserID: string): boolean {
    let isCheckResult = false;

    const opCode = this.accessCodeService.getOperatorCode(userObj.op);
    // console.log('opCode >>>>', opCode)
    switch (userObj.v) {
      case 2:
        const _LEG = Config.REDIS.TRANSDATA_KEEP_SEC_MIN;
        const userKeyStr = userObj.key.toString().padStart(_LEG!, "0");
        const checkId = [opCode, userKeyStr].join("");
        // console.log('[v][2] checkId >>>', checkId)
        isCheckResult = checkId == strUserID;
        break;
      default:
        const userOpId = this.accessCodeService.getUserOPID(opCode, userObj.id);
        // console.log('[v][1] userOpId >>>', userOpId)
        isCheckResult = userOpId == strUserID;
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
        status = resCode === SUCCESS ? "OK" : "INVALID_TOKEN_ID";
        break;
      case CallbackType.Balance:
        status = resCode === SUCCESS ? "OK" : "INVALID_TOKEN_ID";
        break;
      case CallbackType.Bet:
        status =
          resCode === SUCCESS
            ? "OK"
            : resCode === 5001 || resCode === 21011
              ? "INSUFFICIENT_FUNDS"
              : resCode === 20201
                ? "BET_ALREADY_EXIST"
                : "UNKNOWN_ERROR";
        break;
      case CallbackType.Result:
        status =
          resCode === SUCCESS
            ? "OK"
            : resCode === 20202 || resCode === 20206 || resCode === 20204
              ? "BET_ALREADY_SETTLED"
              : "UNKNOWN_ERROR";
        break;
      case CallbackType.Refund:
        status =
          resCode === SUCCESS
            ? "OK"
            : resCode === 20202 || resCode === 20203
              ? "BET_ALREADY_SETTLED"
              : resCode === 20200
                ? "BET_DOES_NOT_EXIST"
                : "UNKNOWN_ERROR";
        break;
      default:
        status = "UNKNOWN_ERROR";
        break;
    }

    return status;
  }

  /**
   * Get third party object by cpKey
   * @param cpKey
   * @returns
   */
  getThirdPartObjByCpKey(cpKey: string): any {
    let objThirdparty;
    switch (parseInt(cpKey)) {
      case Game.PP.cp_key:
        objThirdparty = Game.PP;
        break;
      case Game.PP_REELKINGDOM.cp_key:
        objThirdparty = Game.PP_REELKINGDOM;
        break;
      case Game.PP_FATPANDA.cp_key:
        objThirdparty = Game.PP_FATPANDA;
        break;
      default:
        objThirdparty = Game.PP_LIVE;
        break;
    }
    return objThirdparty;
  }

  /**
   * Build service result ; all type
   * @param gRPCResult
   * @param userObj
   * @param objThirdparty
   * @param type
   */
  buildServiceResult(
    gRPCResult: ObjResult,
    userObj: UserObj,
    objThirdparty: ObjThirdParty,
    type: CallbackType,
  ): any {
    try {
      switch (type) {
        case CallbackType.MemberCheck:
          if (gRPCResult.result !== SUCCESS) {
            return {
              error: 4,
              description: [
                "Membership verification failure [",
                gRPCResult.result,
                "]",
              ].join(""),
            };
          }
          let strUserID = "";
          const opCode = this.accessCodeService.getOperatorCode(userObj.op);
          switch (userObj.v) {
            case 2:
              const _LEG = Config.REDIS.TRANSDATA_KEEP_SEC_MIN;
              const userKeyStr = userObj.key.toString().padStart(_LEG!, "0");
              strUserID = [opCode, userKeyStr].join("");
              break;
            default:
              strUserID = [opCode, userObj.id.toString()].join("");
              break;
          }
          return {
            error: 0,
            description: "Success", // hot code
            userId: strUserID,
            currency: Config.CURRENCY.DEF,
            cash: gRPCResult.balance,
            bonus: 0.0,
            country: Config.COUNTRY_A2,
            jurisdiction: "99", // hot code
          };
        case CallbackType.Balance:
          if (gRPCResult.result !== SUCCESS)
            return {
              error: 4,
              description: [
                "not enough balance [",
                gRPCResult.result,
                "]",
              ].join(""),
            };
          else
            return {
              error: 0,
              description: "Success",
              currency: Config.CURRENCY.DEF,
              cash: gRPCResult.balance,
              bonus: 0.0,
            };
        case CallbackType.Bet:
          if (gRPCResult.result === SUCCESS)
            return {
              error: 0,
              description: "Success",
              transactionId: gRPCResult.trans_id,
              currency: Config.CURRENCY.DEF,
              cash: gRPCResult.balance,
              bonus: 0.0,
              usedPromo: 0,
            };
          else {
            let responseObj;
            if (gRPCResult.result == 5001 || gRPCResult.result == 21011)
              responseObj.error = 100;
            else if (gRPCResult.result == 20201) {
              //	중복데이터 결과 0으로 강제전송
              responseObj.error = 0;
              responseObj.description = "Success";
            } else if (gRPCResult.result == 21004) responseObj.error = 8;
            else responseObj.error = 100;

            responseObj.description = responseObj.description
              ? responseObj.description
              : [gRPCResult.error_msg, " [", gRPCResult.result, "]"].join("");
            responseObj.transactionId = gRPCResult.trans_id;
            responseObj.currency = Config.CURRENCY.DEF;
            responseObj.cash = gRPCResult.balance;
            responseObj.bonus = 0.0;
            return responseObj;
          }
        case CallbackType.Result:
          if (gRPCResult.result === SUCCESS) {
            return {
              error: 0,
              description: "Success",
              transactionId: gRPCResult.trans_id,
              currency: Config.CURRENCY.DEF,
              cash: gRPCResult.balance,
              bonus: 0.0,
            };
          } else {
            let strResposeCode;
            if (gRPCResult.result == 20202 || gRPCResult.result == 20206)
              strResposeCode = gRPCResult.result;
            else strResposeCode = 120;
            return {
              error: strResposeCode,
              description: [
                gRPCResult.error_msg,
                " [",
                gRPCResult.result,
                "]",
              ].join(""),
              transactionId: gRPCResult.trans_id,
              currency: Config.CURRENCY.DEF,
              cash: gRPCResult.balance,
              bonus: 0.0,
            };
          }
        case CallbackType.Refund: {
          if (gRPCResult.result == SUCCESS || gRPCResult.result == 20203)
            return {
              error: 0,
              description: "Success",
              transactionId: gRPCResult.trans_id,
            };
          else
            return {
              error: 120,
              description: [
                gRPCResult.error_msg,
                " [",
                gRPCResult.result,
                "]",
              ].join(""),
              transactionId: gRPCResult.trans_id,
            };
        }
        default:
          break;
      }
    } catch (error) {
      throw new BadRequestException({
        code: error.statuscode,
        message: error.msg,
      });
    }
  }

  /**
   * Check whether the game code is a casino game
   * @param a_strGameCode
   * @returns
   */
  isCasino(a_strGameCode: string): boolean {
    if (a_strGameCode === null || !a_strGameCode) return false;
    let prefix = a_strGameCode.substring(0, 2);
    const num = parseInt(prefix, 10);
    return !isNaN(num) && num < 10000;
  }

  /**
   * Get third party object by game id and user cp key
   * @param gameId
   * @param userCpKey
   * @returns
   */
  getThirdPartyObject(gameId: string, userCpKey: string): any {
    const isCasino = this.isCasino(gameId);
    if (isCasino) return Game.PP_LIVE;
    const cpKey = parseInt(userCpKey);
    switch (cpKey) {
      case Game.PP_REELKINGDOM.cp_key:
        return Game.PP_REELKINGDOM;
      case Game.PP_FATPANDA.cp_key:
        return Game.PP_FATPANDA;
      default:
        return Game.PP;
    }
  }

  /**
   * Get trans data from redis
   * @param a_strThirdpartyTransID
   * @returns
   */
  async getTransData(a_strThirdpartyTransID: string): Promise<any> {
    let objTransData,
      strTransKey = ["t_", a_strThirdpartyTransID].join(""),
      strTransData = await this.redisService.get(strTransKey);
    if (strTransData != null) {
      let objParseData = JSON.parse(strTransData);
      objTransData = {
        thirdparty_round_id: objParseData.trid,
        round_id: objParseData.rid,
        trans_id: objParseData.tid,
        amount: objParseData.a,
        status: objParseData.st,
        times: objParseData.tm,
        thirdparty_trans_id_list: objParseData.ttids,
      };
    }
    return objTransData;
  }
}
