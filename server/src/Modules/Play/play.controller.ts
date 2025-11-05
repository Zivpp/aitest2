import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import apiPath from "src/Config/api.path";
import { ApiOperation } from "@nestjs/swagger";
import * as _ from "lodash";
import { Config } from "src/Config/config";
import { SUCCESS, FAILED, getResultMsg } from "src/Config/result.code";
import {
  PlayReqContext,
  PlayReqOperator,
  PlayReqUser,
} from "./Interface/play.interface";
import { PlayService } from "./play.service";
import { v4 as uuid } from "uuid";
import { base64encode } from "nodejs-base64";

@Controller()
export class PlayController {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly playService: PlayService,
  ) {}

  @Post(apiPath.play.play)
  @ApiOperation({
    summary: "play entry",
  })
  async play(@Req() req, @Res() res, @Body() body): Promise<any> {
    // Initial process parameters
    const result = { result: SUCCESS, ver: body.ver, msg: "" };

    // Initial data preparation and acquisition
    const reqContext: PlayReqContext = JSON.parse(JSON.stringify(body));
    const cOperator: PlayReqOperator = JSON.parse(JSON.stringify(body.op));
    const cUser: PlayReqUser = JSON.parse(JSON.stringify(body.user));

    if (!cOperator || !cUser) {
      result.result = 10001;
      result.msg = getResultMsg("-", 10001) ?? "";
      return res.send(result);
    }

    //	오퍼레이터 게임정보 다시 읽음 | 操作員重新讀取遊戲訊息
    //  1. 게임 시작요청이 들어올때마다 callback정보등을 다시 읽어들인다. | 每當收到遊戲開始請求時，重新讀取回呼訊息等。
    //  2. 해당정보는 항상 최신으로 유지해야함. | 這些信息必須保持最新。
    await this.playService.loadOperatorGameInfo(cOperator.id);

    const _sg = uuid().replace(/-/g, "");
    const objToken = {
      key: cUser.user_key,
      v: body.ver,
      id: cUser.user_id_org,
      op: cOperator.id,
      c: req.body.cp,
      g: req.body.gamcode,
      dt: req.body.times,
      sg: _sg,
      bl: req.body.betlimit,
      tr: req.body.tr,
    };
    cUser.token = base64encode(JSON.stringify(objToken)).toString();
    cUser.sign = _sg;

    const startUrlObj = await this.playService.getStartUrl(body.cp, cOperator);

    if (startUrlObj?.strSendDataToCallbackServerUrl)
      await this.playService.sendToCallbackServer(
        [startUrlObj.strSendDataToCallbackServerUrl, "/session"].join(""),
        { user_id: cUser.user_id, cp_key: req.body.cp, token: objToken },
      );

    try {
      const fsuRes = await startUrlObj.funcStartUrl(
        res,
        cOperator,
        cUser,
        req.body.gamecode,
        req.body.device,
        req.body.cp,
        req.body.useragent,
        req.body.siteurl,
        req.body.betlimit,
        req.body.lang,
        req.body.currency,
      );

      const objResult = {
        result: fsuRes.result,
        msg: getResultMsg("-", fsuRes.result),
        trace: req.body.tr,
        data: {}, //{ link: value }
      };

      if (fsuRes.result != SUCCESS) {
        objResult.data = { token: cUser.sign, error: fsuRes.error };
      } else {
        objResult.data = { token: cUser.sign, link: fsuRes.link };
      }
      // success end
      return res.send(objResult);
    } catch (error) {
      console.error(error);
      return res.send({ result: FAILED, msg: error.message });
    }
  }
}
