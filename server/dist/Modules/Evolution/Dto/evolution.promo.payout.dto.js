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
exports.PromoPayoutDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var PromoType;
(function (PromoType) {
    PromoType["FreeRoundPlayableSpent"] = "FreeRoundPlayableSpent";
    PromoType["JackpotWin"] = "JackpotWin";
    PromoType["RewardGamePlayableSpent"] = "RewardGamePlayableSpent";
    PromoType["RewardGameWinCapReached"] = "RewardGameWinCapReached";
    PromoType["RewardGameMinBetLimitReached"] = "RewardGameMinBetLimitReached";
    PromoType["RtrMonetaryReward"] = "RtrMonetaryReward";
    PromoType["SmartTournamentMonetaryReward"] = "SmartTournamentMonetaryReward";
    PromoType["SmartSpinsMonetaryReward"] = "SmartSpinsMonetaryReward";
    PromoType["CashReward"] = "CashReward";
})(PromoType || (PromoType = {}));
class PromoOriginDto {
    type;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoOriginDto.prototype, "type", void 0);
class JackpotDto {
    id;
    winAmount;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JackpotDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], JackpotDto.prototype, "winAmount", void 0);
class PromoTransactionDto {
    type;
    id;
    amount;
    voucherId;
    remainingRounds;
    playableBalance;
    bonusConfigId;
    rewardId;
    jackpots;
    origin;
    instanceCode;
    instanceId;
    campaignCode;
    campaignId;
    reason;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PromoTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "voucherId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoTransactionDto.prototype, "remainingRounds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PromoTransactionDto.prototype, "playableBalance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "bonusConfigId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "rewardId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => JackpotDto),
    __metadata("design:type", Array)
], PromoTransactionDto.prototype, "jackpots", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PromoOriginDto),
    __metadata("design:type", PromoOriginDto)
], PromoTransactionDto.prototype, "origin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "instanceCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoTransactionDto.prototype, "instanceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "campaignCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoTransactionDto.prototype, "campaignId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoTransactionDto.prototype, "reason", void 0);
class TableDto {
    id;
    vid;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TableDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], TableDto.prototype, "vid", void 0);
class GameDetailsDto {
    table;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TableDto),
    __metadata("design:type", TableDto)
], GameDetailsDto.prototype, "table", void 0);
class GameDto {
    id;
    type;
    details;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GameDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GameDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => GameDetailsDto),
    __metadata("design:type", GameDetailsDto)
], GameDto.prototype, "details", void 0);
class PromoPayoutDto {
    sid;
    userId;
    currency;
    uuid;
    game;
    promoTransaction;
}
exports.PromoPayoutDto = PromoPayoutDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoPayoutDto.prototype, "sid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoPayoutDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoPayoutDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PromoPayoutDto.prototype, "uuid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => GameDto),
    __metadata("design:type", Object)
], PromoPayoutDto.prototype, "game", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PromoTransactionDto),
    __metadata("design:type", PromoTransactionDto)
], PromoPayoutDto.prototype, "promoTransaction", void 0);
//# sourceMappingURL=evolution.promo.payout.dto.js.map