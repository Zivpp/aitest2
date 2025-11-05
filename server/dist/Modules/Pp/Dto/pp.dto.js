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
exports.EndRoundDto = exports.PromoWinDto = exports.JackpotWinDto = exports.BonusWinDto = exports.RefundDto = exports.ResultDto = exports.BetDto = exports.BalanceDto = exports.AuthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AuthDto {
    providerId;
    hash;
    token;
    trace;
}
exports.AuthDto = AuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "供應商 ID（大小寫不敏感）",
        example: "pragmaticplay",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], AuthDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "驗證雜湊（32字元 16 進位 MD5 等格式）",
        example: "e1467eb30743fb0a180ed141a26c58f7",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^[a-fA-F0-9]{32}$/, {
        message: "hash must be a 32-char hex string",
    }),
    __metadata("design:type", String)
], AuthDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "玩家/會話 Token",
        example: "5v93mto7jr",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => (typeof value === "string" ? value.trim() : value)),
    __metadata("design:type", String)
], AuthDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Trace ID",
        example: "1234567890",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AuthDto.prototype, "trace", void 0);
class BalanceDto {
    providerId;
    userId;
    hash;
}
exports.BalanceDto = BalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "pragmaticplay" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "421" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "b4672931ee1d78e4022faaadf58e37db" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "hash", void 0);
class BetDto {
    roundDetails;
    reference;
    gameId;
    amount;
    providerId;
    userId;
    roundId;
    hash;
    timestamp;
}
exports.BetDto = BetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "spin" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "roundDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "585c1306f89c56f5ecfc2f5d" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "vs50aladdin" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100.0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BetDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "pragmaticplay" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "421" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "5103188801" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "roundId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "4a5d375ac1311b04fba2ea66d067b8e5" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "1482429190374" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "timestamp", void 0);
class ResultDto {
    roundDetails;
    reference;
    gameId;
    amount;
    providerId;
    userId;
    roundId;
    platform;
    hash;
    timestamp;
    promoWinAmount;
    promoWinReference;
    bonusCode;
}
exports.ResultDto = ResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "roundDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ResultDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "roundId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResultDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ResultDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResultDto.prototype, "promoWinAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResultDto.prototype, "promoWinReference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResultDto.prototype, "bonusCode", void 0);
class RefundDto {
    reference;
    providerId;
    userId;
    platform;
    hash;
    gameId;
    roundId;
    amount;
}
exports.RefundDto = RefundDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefundDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RefundDto.prototype, "gameId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RefundDto.prototype, "roundId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], RefundDto.prototype, "amount", void 0);
class BonusWinDto {
    reference;
    bonusCode;
    amount;
    providerId;
    userId;
    hash;
    timestamp;
}
exports.BonusWinDto = BonusWinDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusWinDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusWinDto.prototype, "bonusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BonusWinDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusWinDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusWinDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusWinDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], BonusWinDto.prototype, "timestamp", void 0);
class JackpotWinDto {
    reference;
    bonusCode;
    amount;
    providerId;
    userId;
    hash;
    timestamp;
    roundId;
    gameId;
}
exports.JackpotWinDto = JackpotWinDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "bonusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], JackpotWinDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], JackpotWinDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "roundId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JackpotWinDto.prototype, "gameId", void 0);
class PromoWinDto {
    reference;
    campaignId;
    amount;
    providerId;
    campaignType;
    userId;
    timestamp;
    currency;
    hash;
}
exports.PromoWinDto = PromoWinDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "campaignId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PromoWinDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "campaignType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoWinDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoWinDto.prototype, "hash", void 0);
class EndRoundDto {
    gameId;
    providerId;
    userId;
    roundId;
    platform;
    hash;
}
exports.EndRoundDto = EndRoundDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EndRoundDto.prototype, "gameId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EndRoundDto.prototype, "providerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EndRoundDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EndRoundDto.prototype, "roundId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EndRoundDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EndRoundDto.prototype, "hash", void 0);
//# sourceMappingURL=pp.dto.js.map