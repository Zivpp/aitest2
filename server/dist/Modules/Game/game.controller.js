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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const api_path_1 = require("../../Config/api.path");
const microservices_1 = require("@nestjs/microservices");
let GameController = class GameController {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    async grpcClientCallingTest(body) {
        return this.gameService.callGrpcProcessCall(body);
    }
    processCall(data, metadata) {
        console.info("***** [gRPC] response *****：");
        console.info(data);
        return {
            result: {
                result: 1,
                balance: 100.5,
                time: new Date().toISOString(),
                round_id: "round123",
                trans_id: "tx123",
                error_msg: "",
            },
            error: null,
        };
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Post)(api_path_1.default.grpc.game.clientCallingTest),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "grpcClientCallingTest", null);
__decorate([
    (0, microservices_1.GrpcMethod)("CoreService", "ProcessCall"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], GameController.prototype, "processCall", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map