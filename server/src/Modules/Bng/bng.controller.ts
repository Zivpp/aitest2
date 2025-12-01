import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import * as _ from "lodash";

import { AccessCodeService } from "../../Global/Service/access.code.service";
import apiPath from "../../Config/api.path";

import { BngService } from "./bng.service";
import { FAILED, SUCCESS } from "../../Config/result.code";
import { ApiService } from "../../Infrastructure/Api/api.service";
import { Config } from "../../Config/config";
import { SessionDto, SidDto } from "./Dto/bng.dto";
import { GlobalDTOValidationPipe } from "../../Global/Pipes/global.dto.validation.pipe";
import { TokenWrapper } from "../../Global/Service/interface/access.code.service.interface";
import { RedisService } from "../../Infrastructure/Redis/redis.service";
import { Game } from "../../Config/config";
import { v4 as uuid } from "uuid";
import { status } from "@grpc/grpc-js";
import { Status } from "./Enum/bng.enum";

@Controller()
export class BngController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly bngService: BngService,
    private readonly apiService: ApiService,
    private readonly redisService: RedisService,
  ) { }

  @Post(apiPath.bng.sid)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "sid",
  })
  async sid(@Body() body: SidDto, @Res() res): Promise<any> {
    const _BNG = "BNG";
    console.log(`[${_BNG}] API /sid request = `, body);

    const userInfo = await this.accessCodeService.getUserInfo(body.userId);

    if (!userInfo) {
      return res.send({
        status: "Failed : No search any user by : " + body.userId,
        sid: "",
        uuid: body.uuid,
      });
    }

    const objToken = {
      key: userInfo.user_key,
      v: userInfo.v ?? 1,
      id: userInfo.user_id_org,
      op: userInfo.op_id,
      c: Game.BNG.cp_key,
      g: userInfo.gamcode,
      dt: userInfo.times ?? Date.now(),
      sg: uuid().replace(/-/g, ""),
      bl: userInfo.betlimit,
      tr: userInfo.tr,
    };
    console.info("objToken = ", objToken);
    const token = JSON.stringify(objToken);
    const sid = objToken.sg;
    console.info(`[${_BNG}] API /sid = `, sid);

    const strSessionKey: string = [
      "s",
      Game.BNG.cp_key.toString(),
      body.userId,
    ].join("_");
    await this.redisService.set(strSessionKey, token);

    return res.send({ status: "OK", sid: sid, uuid: body.uuid });
  }

  @Post(apiPath.bng.session)
  @UsePipes(GlobalDTOValidationPipe)
  @ApiOperation({
    summary: "session ??",
  })
  @HttpCode(HttpStatus.OK)
  async session(@Req() req, @Body() body: SessionDto): Promise<any> {
    const rawIP = req?.ip?.replace("::ffff:", "") || "unknown";
    const allowList = Config.MAIN_APP_IP || [];
    const isAllowed = allowList.includes(rawIP);
    if (!isAllowed) {
      return { result: FAILED };
    }

    // add token sign
    const tokenSign: TokenWrapper = {
      token: body?.token,
      update_time: Date.now(),
    };
    await this.accessCodeService.addToken_sign(tokenSign, body?.token?.c);

    return { result: SUCCESS };
  }

  @Post("/")
  @ApiOperation({
    summary:
      "Multiple services are integrated into one, using objData.name when judging",
  })
  @HttpCode(HttpStatus.OK)
  async handleRaw(@Res() res, @Body() body) {
    let objThirdparty: any | null = null;
    const forceGamecode = Config.bng_force_gamecode?.[body?.game_id];
    const vendorId = forceGamecode?.to_provider_id || body?.provider_id;
    objThirdparty = Config.BNG_GROUP.vendors?.[vendorId];

    if (!objThirdparty) {
      return res.status(HttpStatus.BAD_REQUEST).send(Config.RESPONSE_ERROR);
    }

    // body.token = other server user_id
    const userObj = await this.accessCodeService.getUserObj(
      body?.token,
      objThirdparty?.cp_key?.toString(),
    );
    // console.log('userObj >>>>.', userObj)
    if (!userObj) {
      return res.send({
        uid: body?.uid,
        error: { code: Status.INVALID_TOKEN },
      });
    }

    // check userObj required properties: { key, id, op, dt }
    const inValid = this.accessCodeService.inValidToken(userObj);
    if (inValid) {
      return res.send({
        uid: body?.uid,
        error: { code: Status.INVALID_TOKEN },
      });
    }

    let result;
    const _LOGIN = "login";
    const _GET_BALANCE = "getbalance";
    const _TRANSACTION = "transaction";
    const _ROLLBACK = "rollback";
    switch (body.name) {
      case _LOGIN:
        result = await this.bngService.login(body, objThirdparty, userObj);
        break;
      case _GET_BALANCE:
        result = await this.bngService.getBalance(body, objThirdparty, userObj);
        break;
      case _TRANSACTION:
        result = await this.bngService.transaction(
          body,
          objThirdparty,
          userObj,
        );
        break;
      case _ROLLBACK:
        result = await this.bngService.rollback(body, objThirdparty, userObj);
        break;
      default:
        result = { uid: body?.uid, error: { code: Status.NOT_IMPLEMENTED } };
        break;
    }

    return res.send(result);
  }
}
