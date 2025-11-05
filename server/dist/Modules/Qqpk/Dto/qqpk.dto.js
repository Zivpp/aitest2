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
exports.DepositDto = exports.GetAcctInfoDto = exports.GetBalanceDto = exports.SessionDto = exports.SessionTokenDto = exports.SidDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const class_validator_2 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ChannelDto {
    type;
}
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], ChannelDto.prototype, "type", void 0);
class SidDto {
    channel;
    sid;
    userId;
    uuid;
    someFakeField;
}
exports.SidDto = SidDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ChannelDto),
    __metadata("design:type", ChannelDto)
], SidDto.prototype, "channel", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "sid", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "uuid", void 0);
__decorate([
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "someFakeField", void 0);
class SessionTokenDto {
    sign;
    key;
    v;
    id;
    op;
    c;
    dt;
    sg;
    bl;
    tr;
    update_time;
}
exports.SessionTokenDto = SessionTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "sign", example: "xxxxx" }),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "sign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者金鑰", example: 3399999 }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用版本", example: 1 }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "v", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者 ID", example: "kim9999" }),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "操作員 ID", example: 3333 }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "op", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "遊戲公司代碼", example: 101 }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "c", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "遊戲執行時間 (timestamp)",
        example: 1753109748788,
    }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "dt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "遊戲啟動令牌",
        example: "b472d1484f2146e2846ebe9b8da011e2",
    }),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "sg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "賭率限制，可為 null",
        example: null,
        nullable: true,
    }),
    (0, class_validator_2.IsOptional)(),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", Object)
], SessionTokenDto.prototype, "bl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "記錄追蹤代碼 (trace)", example: "abc123xyz" }),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "tr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "更新時間 (timestamp)", example: 1753109748788 }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "update_time", void 0);
class SessionDto {
    user_id;
    cp_key;
    token;
}
exports.SessionDto = SessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者帳號", example: "bl2_kim9999" }),
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], SessionDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "遊戲公司代碼", example: 101 }),
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], SessionDto.prototype, "cp_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者 token 物件", type: SessionTokenDto }),
    (0, class_validator_2.IsNotEmpty)(),
    __metadata("design:type", SessionTokenDto)
], SessionDto.prototype, "token", void 0);
class GetBalanceDto {
    acctId;
    merchantCode;
    serialNo;
    gameCode;
}
exports.GetBalanceDto = GetBalanceDto;
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_2.IsNotEmpty)(),
    __metadata("design:type", String)
], GetBalanceDto.prototype, "acctId", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], GetBalanceDto.prototype, "merchantCode", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], GetBalanceDto.prototype, "serialNo", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    (0, class_validator_2.IsOptional)(),
    __metadata("design:type", String)
], GetBalanceDto.prototype, "gameCode", void 0);
class GetAcctInfoDto {
    acctId;
    pageIndex;
    merchantCode;
    serialNo;
}
exports.GetAcctInfoDto = GetAcctInfoDto;
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], GetAcctInfoDto.prototype, "acctId", void 0);
__decorate([
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], GetAcctInfoDto.prototype, "pageIndex", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], GetAcctInfoDto.prototype, "merchantCode", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], GetAcctInfoDto.prototype, "serialNo", void 0);
class DepositDto {
    acctId;
    amount;
    currency;
    merchantCode;
    serialNo;
}
exports.DepositDto = DepositDto;
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "acctId", void 0);
__decorate([
    (0, class_validator_2.IsNumber)(),
    __metadata("design:type", Number)
], DepositDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "merchantCode", void 0);
__decorate([
    (0, class_validator_2.IsString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "serialNo", void 0);
//# sourceMappingURL=qqpk.dto.js.map