"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayController = void 0;
const common_1 = require("@nestjs/common");
const access_code_service_1 = require("../../Global/Service/access.code.service");
const api_path_1 = require("../../Config/api.path");
const swagger_1 = require("@nestjs/swagger");
const result_code_1 = require("../../Config/result.code");
const play_service_1 = require("./play.service");
const uuid_1 = require("uuid");
const nodejs_base64_1 = require("nodejs-base64");
let PlayController = class PlayController {
    accessCodeService;
    playService;
    constructor(accessCodeService, playService) {
        this.accessCodeService = accessCodeService;
        this.playService = playService;
    }
    async play(req, res, body) {
        const result = { result: result_code_1.SUCCESS, ver: body.ver, msg: "" };
        const reqContext = JSON.parse(JSON.stringify(body));
        const cOperator = JSON.parse(JSON.stringify(body.op));
        const cUser = JSON.parse(JSON.stringify(body.user));
        if (!cOperator || !cUser) {
            result.result = 10001;
            result.msg = (0, result_code_1.getResultMsg)("-", 10001) ?? "";
            return res.send(result);
        }
        await this.playService.loadOperatorGameInfo(cOperator.id);
        const _sg = (0, uuid_1.v4)().replace(/-/g, "");
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
        cUser.token = (0, nodejs_base64_1.base64encode)(JSON.stringify(objToken)).toString();
        cUser.sign = _sg;
        const startUrlObj = await this.playService.getStartUrl(body.cp, cOperator);
        if (startUrlObj?.strSendDataToCallbackServerUrl)
            await this.playService.sendToCallbackServer([startUrlObj.strSendDataToCallbackServerUrl, "/session"].join(""), { user_id: cUser.user_id, cp_key: req.body.cp, token: objToken });
        try {
            const fsuRes = await startUrlObj.funcStartUrl(res, cOperator, cUser, req.body.gamecode, req.body.device, req.body.cp, req.body.useragent, req.body.siteurl, req.body.betlimit, req.body.lang, req.body.currency);
            const objResult = {
                result: fsuRes.result,
                msg: (0, result_code_1.getResultMsg)("-", fsuRes.result),
                trace: req.body.tr,
                data: {},
            };
            if (fsuRes.result != result_code_1.SUCCESS) {
                objResult.data = { token: cUser.sign, error: fsuRes.error };
            }
            else {
                objResult.data = { token: cUser.sign, link: fsuRes.link };
            }
            return res.send(objResult);
        }
        catch (error) {
            console.error(error);
            return res.send({ result: result_code_1.FAILED, msg: error.message });
        }
    }
};
exports.PlayController = PlayController;
__decorate([
    (0, common_1.Post)(api_path_1.default.play.play),
    (0, swagger_1.ApiOperation)({
        summary: "play entry",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayController.prototype, "play", null);
exports.PlayController = PlayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_code_service_1.AccessCodeService,
        play_service_1.PlayService])
], PlayController);
//# sourceMappingURL=play.controller.js.map