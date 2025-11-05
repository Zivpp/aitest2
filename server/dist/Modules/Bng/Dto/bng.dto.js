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
exports.HandleRawDto = exports.ArgsDto = exports.BonusDto = exports.PlayerDto = exports.SessionDto = exports.SessionTokenDto = exports.SidDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ChannelDto {
    type;
}
__decorate([
    (0, class_validator_1.IsString)(),
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
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "sid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SidDto.prototype, "uuid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
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
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "sign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者金鑰", example: 3399999 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用版本", example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "v", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者 ID", example: "kim9999" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "操作員 ID", example: 3333 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "op", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "遊戲公司代碼", example: 101 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "c", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "遊戲執行時間 (timestamp)",
        example: 1753109748788,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionTokenDto.prototype, "dt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "遊戲啟動令牌",
        example: "b472d1484f2146e2846ebe9b8da011e2",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "sg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "賭率限制，可為 null",
        example: null,
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SessionTokenDto.prototype, "bl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "記錄追蹤代碼 (trace)", example: "abc123xyz" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionTokenDto.prototype, "tr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "更新時間 (timestamp)", example: 1753109748788 }),
    (0, class_validator_1.IsNumber)(),
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
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "遊戲公司代碼", example: 101 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionDto.prototype, "cp_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者 token 物件", type: SessionTokenDto }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", SessionTokenDto)
], SessionDto.prototype, "token", void 0);
class PlayerDto {
    id;
    currency;
    mode;
    is_test;
    brand;
}
exports.PlayerDto = PlayerDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayerDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["FUN", "REAL"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayerDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PlayerDto.prototype, "is_test", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayerDto.prototype, "brand", void 0);
class BonusDto {
    campaign;
    source;
    bonus_id;
    ext_bonus_id;
    bonus_type;
    event;
    start_date;
    end_date;
    total_bet;
    total_win;
    played_bet;
    played_win;
    status;
}
exports.BonusDto = BonusDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "campaign", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["OPERATOR", "PROVIDER"] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], BonusDto.prototype, "bonus_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "ext_bonus_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "bonus_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "end_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "total_bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "total_win", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "played_bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "played_win", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BonusDto.prototype, "status", void 0);
class ArgsDto {
    action;
    bet;
    win;
    round_started;
    round_finished;
    round_id;
    transaction_uid;
    bonus;
    player;
    tag;
}
exports.ArgsDto = ArgsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArgsDto.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        nullable: true,
        type: String,
        description: "decimal string or null",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ArgsDto.prototype, "bet", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        nullable: true,
        type: String,
        description: "decimal string or null",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ArgsDto.prototype, "win", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ArgsDto.prototype, "round_started", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ArgsDto.prototype, "round_finished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: "biginteger as string" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ArgsDto.prototype, "round_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "ID of the transaction to be rolled back",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArgsDto.prototype, "transaction_uid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: BonusDto, required: false, nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BonusDto),
    __metadata("design:type", Object)
], ArgsDto.prototype, "bonus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PlayerDto, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PlayerDto),
    __metadata("design:type", PlayerDto)
], ArgsDto.prototype, "player", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ArgsDto.prototype, "tag", void 0);
class HandleRawDto {
    name;
    uid;
    token;
    session;
    game_id;
    game_name;
    provider_id;
    provider_name;
    c_at;
    sent_at;
    args;
}
exports.HandleRawDto = HandleRawDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "uid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "game_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "game_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "provider_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "provider_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "c_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], HandleRawDto.prototype, "sent_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ArgsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ArgsDto),
    __metadata("design:type", ArgsDto)
], HandleRawDto.prototype, "args", void 0);
//# sourceMappingURL=bng.dto.js.map