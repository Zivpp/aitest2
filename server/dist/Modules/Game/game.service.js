"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const core_client_1 = require("../../Grpc/Clients/core.client");
let GameService = class GameService {
    getHello() {
        return "Hello World!";
    }
    async callGrpcProcessCall(data) {
        return new Promise((resolve, reject) => {
            core_client_1.coreServiceClient.ProcessCall(data, (err, response) => {
                if (err) {
                    console.error("gRPC Error:", err);
                    return reject(err);
                }
                return resolve(response);
            });
        });
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map