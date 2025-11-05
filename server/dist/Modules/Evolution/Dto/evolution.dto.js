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
exports.SidDto = exports.CancelDto = exports.CreditDto = exports.DebitDto = exports.BalanceDto = exports.CheckDto = exports.sessionDto = exports.sessionTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class sessionTokenDto {
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
exports.sessionTokenDto = sessionTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者金鑰", example: 3399999 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionTokenDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用版本", example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionTokenDto.prototype, "v", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者 ID", example: "kim9999" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], sessionTokenDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "操作員 ID", example: 3333 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionTokenDto.prototype, "op", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "遊戲公司代碼", example: 101 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionTokenDto.prototype, "c", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "遊戲執行時間 (timestamp)",
        example: 1753109748788,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionTokenDto.prototype, "dt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "遊戲啟動令牌",
        example: "b472d1484f2146e2846ebe9b8da011e2",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], sessionTokenDto.prototype, "sg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "賭率限制，可為 null",
        example: null,
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], sessionTokenDto.prototype, "bl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "記錄追蹤代碼 (trace)", example: "abc123xyz" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], sessionTokenDto.prototype, "tr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "更新時間 (timestamp)", example: 1753109748788 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionTokenDto.prototype, "update_time", void 0);
class sessionDto {
    user_id;
    cp_key;
    token;
}
exports.sessionDto = sessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者帳號", example: "bl2_kim9999" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], sessionDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "遊戲公司代碼", example: 101 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], sessionDto.prototype, "cp_key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "使用者 token 物件", type: sessionTokenDto }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", sessionTokenDto)
], sessionDto.prototype, "token", void 0);
class CheckDto {
    userId;
    sid;
    channel;
    uuid;
}
exports.CheckDto = CheckDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "player id",
        example: "todo",
        description: "Player’s ID which is sent by Licensee in UserAuthentication call(player.id)",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "session ID",
        example: "todo",
        description: "Player’s session ID",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckDto.prototype, "sid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "channel",
        example: "todo",
        description: "Object containing channel details",
        required: true,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CheckDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "uuid",
        example: "todo",
        description: "Unique request Id, that identifies CheckUserRequest",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CheckDto.prototype, "uuid", void 0);
class BalanceDto {
    sid;
    userId;
    game;
    currency;
    uuid;
}
exports.BalanceDto = BalanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "session ID",
        example: "sid-parameter-from-UserAuthentication-call",
        description: "Player’s session ID",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "sid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "player id",
        example: "euID-parameter-from-UserAuthentication-call",
        description: "Player’s ID which is sent by Licensee in UserAuthentication call(player.id)",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "game",
        example: 'null or {"id":null,"type":"blackjack","details":{"table":{"id":"aaabbbcccdddeee111","vid":"aaabbbcccdddeee111"}}}',
        description: "Player’s game",
        required: true,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], BalanceDto.prototype, "game", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "currency",
        example: "EUR",
        description: "Player’s currency",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        title: "uuid",
        example: "ce186440-ed92-11e3-ac10-0800200c9a66",
        description: "Unique request Id, that identifies CheckUserRequest",
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BalanceDto.prototype, "uuid", void 0);
class DebitTableDetailsDto {
    id;
    vid;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitTableDetailsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], DebitTableDetailsDto.prototype, "vid", void 0);
class DebitGameDetailsDto {
    table;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DebitTableDetailsDto),
    __metadata("design:type", DebitTableDetailsDto)
], DebitGameDetailsDto.prototype, "table", void 0);
class DebitBetDto {
    code;
    amount;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitBetDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DebitBetDto.prototype, "amount", void 0);
class DebitTransactionDto {
    id;
    refId;
    amount;
    bets;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitTransactionDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitTransactionDto.prototype, "refId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DebitTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DebitBetDto),
    __metadata("design:type", Array)
], DebitTransactionDto.prototype, "bets", void 0);
class DebitGameDto {
    id;
    type;
    details;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitGameDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitGameDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DebitGameDetailsDto),
    __metadata("design:type", DebitGameDetailsDto)
], DebitGameDto.prototype, "details", void 0);
class DebitDto {
    sid;
    userId;
    currency;
    transaction;
    uuid;
    game;
}
exports.DebitDto = DebitDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitDto.prototype, "sid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DebitTransactionDto),
    __metadata("design:type", DebitTransactionDto)
], DebitDto.prototype, "transaction", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitDto.prototype, "uuid", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DebitGameDto),
    __metadata("design:type", DebitGameDto)
], DebitDto.prototype, "game", void 0);
class TableDetailsDto {
    id;
    vid;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TableDetailsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], TableDetailsDto.prototype, "vid", void 0);
class GameDetailsDto {
    table;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TableDetailsDto),
    __metadata("design:type", TableDetailsDto)
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
class BetDto {
    code;
    payoff;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BetDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BetDto.prototype, "payoff", void 0);
class TransactionDto {
    id;
    refId;
    amount;
    bets;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionDto.prototype, "refId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value || []),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BetDto),
    __metadata("design:type", Array)
], TransactionDto.prototype, "bets", void 0);
class CreditDto {
    sid;
    userId;
    currency;
    game;
    transaction;
    uuid;
}
exports.CreditDto = CreditDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditDto.prototype, "sid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => GameDto),
    __metadata("design:type", GameDto)
], CreditDto.prototype, "game", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TransactionDto),
    __metadata("design:type", TransactionDto)
], CreditDto.prototype, "transaction", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreditDto.prototype, "uuid", void 0);
class CancelTableDetailsDto {
    id;
    vid;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelTableDetailsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CancelTableDetailsDto.prototype, "vid", void 0);
class CancelGameDetailsDto {
    table;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TableDetailsDto),
    __metadata("design:type", TableDetailsDto)
], CancelGameDetailsDto.prototype, "table", void 0);
class CancelGameDto {
    id;
    type;
    details;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelGameDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelGameDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CancelGameDetailsDto),
    __metadata("design:type", CancelGameDetailsDto)
], CancelGameDto.prototype, "details", void 0);
class CancelBetDto {
    code;
    amount;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelBetDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CancelBetDto.prototype, "amount", void 0);
class CancelTransactionDto {
    id;
    refId;
    amount;
    bets;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelTransactionDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelTransactionDto.prototype, "refId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CancelTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value || []),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CancelBetDto),
    __metadata("design:type", Array)
], CancelTransactionDto.prototype, "bets", void 0);
class CancelDto {
    sid;
    userId;
    currency;
    game;
    transaction;
    uuid;
}
exports.CancelDto = CancelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelDto.prototype, "sid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CancelGameDto),
    __metadata("design:type", CancelGameDto)
], CancelDto.prototype, "game", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CancelTransactionDto),
    __metadata("design:type", CancelTransactionDto)
], CancelDto.prototype, "transaction", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CancelDto.prototype, "uuid", void 0);
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
//# sourceMappingURL=evolution.dto.js.map