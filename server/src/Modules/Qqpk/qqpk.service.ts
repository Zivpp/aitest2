import { BadRequestException, Delete, Injectable } from "@nestjs/common";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import {
  TokenWrapper,
  UserObj,
} from "../../Global/Service/interface/access.code.service.interface";

import * as _ from "lodash";

import { SUCCESS } from "../../Config/result.code";
import { Config, Game } from "../../Config/config";
import { CoreGrpcService } from "src/Grpc/Clients/core.grpc.service";
import { ObjData } from "src/Grpc/Clients/Interface/core.service.interface";
import { v4 as uuid } from "uuid";
import { RedisService } from "../../Infrastructure/Redis/redis.service";

const crypto = require("crypto");

const _md5 = (s: string) =>
  crypto.createHash("md5").update(s, "utf8").digest("hex").toLowerCase();

const md5Hex = (buf: Buffer): string => {
  return crypto.createHash("md5").update(buf).digest("hex");
};

const signMd5 = (rawBody: string | Buffer, secret: string | Buffer): string => {
  const bodyBuf = Buffer.isBuffer(rawBody)
    ? rawBody
    : Buffer.from(rawBody, "utf8");
  const secretBuf = Buffer.isBuffer(secret)
    ? secret
    : Buffer.from(secret, "utf8");
  return md5Hex(Buffer.concat([bodyBuf, secretBuf])); // body後面直接接secret
};

@Injectable()
export class QqpkService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * make sign for qqpk.
   * @param params
   * @returns
   */
  makeSign(params: any) {
    // 1. 過濾掉 null 與 sign
    const filtered: Record<string, string> = {};
    for (const key in params) {
      if (params[key] != null && key !== "sign") {
        filtered[key] = String(params[key]);
      }
    }

    // 2. 按鍵名排序
    const sortedKeys = Object.keys(filtered).sort();

    // 3. 組合查詢字串
    const qs = sortedKeys.map((k) => `${k}=${filtered[k]}`).join("&");

    // 4. CryptoJS MD5 (⚠️ 不要用 Utf8.parse)
    const signHash = crypto
      .createHash("md5")
      .update(qs)
      .digest("hex")
      .toUpperCase();

    return signHash;
  }

  /**
   * add token sign for fastspin.
   * @param opId
   * @param userKey
   * @param token
   */
  async addTokenSign(
    opId: number,
    userKey: number,
    token: TokenWrapper,
  ): Promise<string> {
    const key = this.getPublicUserID(opId, userKey);
    await this.redisService.set(
      key,
      JSON.stringify(token.token),
      Config.REDIS.TRANSDATA_KEEP_SEC,
    );
    return key;
  }

  /**
   * get public user id
   * @param a_nOPID
   * @param a_nUserKey
   * @param a_strFix
   * @returns
   */
  getPublicUserID(a_nOPID, a_nUserKey: number, a_strFix = "") {
    return [
      a_strFix,
      this.accessCodeService.getOperatorCode(a_nOPID),
      this.accessCodeService.numberPad(a_nUserKey, Config.MAX_USER_ID_BODY_LEN),
    ].join("");
  }

  /**
   * get user info by acctId
   * @param acctId
   * @returns
   */
  async getUserIndObj(acctId: string): Promise<UserObj> {
    // a_strFix는 보통 prefix로 사용되며, 길이가 고정되어 있거나 규칙이 있다면 그 길이만큼 자릅니다.
    // getOperatorCode( a_nOPID )의 길이는 CConfig.MAX_OPERATOR_KEY_CODE_LENGTH
    // g_f.numberPad( a_nUserKey, CConfig.MAX_USER_ID_BODY_LEN )의 길이는 CConfig.MAX_USER_ID_BODY_LEN
    const prefixLen =
      acctId.length -
      (Config.MAX_OPERATOR_KEY_CODE_LENGTH + Config.MAX_USER_ID_BODY_LEN);
    const a_strFix = acctId.slice(0, prefixLen);
    const opCode = acctId.slice(
      prefixLen,
      prefixLen + Config.MAX_OPERATOR_KEY_CODE_LENGTH,
    );
    const userKeyStr = acctId.slice(
      prefixLen + Config.MAX_OPERATOR_KEY_CODE_LENGTH,
    );
    // userKey는 numberPad로 만들어졌으므로 앞의 0을 제거해서 숫자로 변환
    const userKey = parseInt(userKeyStr, 10);
    const key = await this.getPublicUserID(
      Number(opCode),
      Number(userKey),
      a_strFix,
    );

    console.log("key = ", key);

    const redisResponse: string | null = await this.redisService.get(key);
    const result = redisResponse ? JSON.parse(redisResponse) : null;
    return result;
  }
}
