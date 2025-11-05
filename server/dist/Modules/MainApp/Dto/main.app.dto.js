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
exports.PlayDto = exports.TablelistDto = exports.GamelistDto = exports.ProvlistDto = exports.CreateAccountDto = exports.HashDto = exports.AccountDto = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AccountDto {
    opkey;
    userid;
    hash;
}
exports.AccountDto = AccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccountDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccountDto.prototype, "userid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AccountDto.prototype, "hash", void 0);
class HashDto {
    opkey;
    hash;
}
exports.HashDto = HashDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HashDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HashDto.prototype, "hash", void 0);
class CreateAccountDto {
    opkey;
    userid;
    nick;
    bet_skin_group;
    hash;
}
exports.CreateAccountDto = CreateAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "userid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "nick", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "bet_skin_group", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "hash", void 0);
class ProvlistDto {
    opkey;
    hash;
}
exports.ProvlistDto = ProvlistDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvlistDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvlistDto.prototype, "hash", void 0);
class GamelistDto {
    opkey;
    thirdpartycode;
    hash;
    use_tabletype;
}
exports.GamelistDto = GamelistDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GamelistDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GamelistDto.prototype, "thirdpartycode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GamelistDto.prototype, "hash", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GamelistDto.prototype, "use_tabletype", void 0);
class TablelistDto {
    opkey;
    thirdpartycode;
    hash;
}
exports.TablelistDto = TablelistDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TablelistDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TablelistDto.prototype, "thirdpartycode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TablelistDto.prototype, "hash", void 0);
class PlayDto {
    opkey;
    userid;
    thirdpartycode;
    gamecode;
    platform;
    ip;
    bet_skin_group;
    lang;
    hash;
    gameid;
    currency;
    bet_limit;
}
exports.PlayDto = PlayDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayDto.prototype, "opkey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayDto.prototype, "userid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayDto.prototype, "thirdpartycode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayDto.prototype, "gamecode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["PC", "MOBILE"]),
    __metadata("design:type", String)
], PlayDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIP)(),
    __metadata("design:type", String)
], PlayDto.prototype, "ip", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayDto.prototype, "bet_skin_group", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["ko", "en"]),
    __metadata("design:type", String)
], PlayDto.prototype, "lang", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlayDto.prototype, "hash", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], PlayDto.prototype, "gameid", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, common_1.Optional)(),
    __metadata("design:type", String)
], PlayDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, common_1.Optional)(),
    __metadata("design:type", Number)
], PlayDto.prototype, "bet_limit", void 0);
//# sourceMappingURL=main.app.dto.js.map