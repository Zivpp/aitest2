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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSettleDto = exports.EventSettleItem = exports.SettleDto = exports.CancelBetDto = exports.PlaceBetDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PlaceBetDto {
    ts;
    gameType;
    gameCode;
    userId;
    roundId;
    txId;
    tableId;
    betTime;
    betAmount;
    category;
}
exports.PlaceBetDto = PlaceBetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "ts", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 10),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "gameType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "gameCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "roundId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "txId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "tableId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "betTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "betAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], PlaceBetDto.prototype, "category", void 0);
class CancelBetDto {
    ts;
    reason;
    userId;
    txId;
    gameType;
    gameCode;
}
exports.CancelBetDto = CancelBetDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(28, 28),
    __metadata("design:type", String)
], CancelBetDto.prototype, "ts", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 30),
    __metadata("design:type", String)
], CancelBetDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], CancelBetDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], CancelBetDto.prototype, "txId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 10),
    __metadata("design:type", String)
], CancelBetDto.prototype, "gameType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], CancelBetDto.prototype, "gameCode", void 0);
class SettleDto {
    ts;
    gameType;
    gameCode;
    userId;
    txId;
    roundId;
    betTime;
    betAmount;
    validBetAmount;
    winAmount;
    roundStartTime;
    odds;
    status;
    result;
    commission;
}
exports.SettleDto = SettleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(28, 28),
    __metadata("design:type", String)
], SettleDto.prototype, "ts", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 10),
    __metadata("design:type", String)
], SettleDto.prototype, "gameType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], SettleDto.prototype, "gameCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 50),
    __metadata("design:type", String)
], SettleDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], SettleDto.prototype, "txId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 20),
    __metadata("design:type", String)
], SettleDto.prototype, "roundId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(28, 28),
    __metadata("design:type", String)
], SettleDto.prototype, "betTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettleDto.prototype, "betAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettleDto.prototype, "validBetAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettleDto.prototype, "winAmount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(28, 28),
    __metadata("design:type", String)
], SettleDto.prototype, "roundStartTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettleDto.prototype, "odds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 10),
    __metadata("design:type", String)
], SettleDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SettleDto.prototype, "result", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettleDto.prototype, "commission", void 0);
class EventSettleItem {
    settleId;
    eventId;
    userId;
    amount;
    createTime;
}
exports.EventSettleItem = EventSettleItem;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSettleItem.prototype, "settleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSettleItem.prototype, "eventId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSettleItem.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSettleItem.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSettleItem.prototype, "createTime", void 0);
class EventSettleDto {
    ts;
    settles;
}
exports.EventSettleDto = EventSettleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EventSettleDto.prototype, "ts", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EventSettleItem),
    __metadata("design:type", Array)
], EventSettleDto.prototype, "settles", void 0);
//# sourceMappingURL=hrg.dto.js.map