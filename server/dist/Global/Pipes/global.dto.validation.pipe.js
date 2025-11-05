"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalParseArrayPipe = exports.GlobalDTOValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const error_code_msg_config_1 = require("../../Config/error.code.msg.config");
const global_exception_handler_1 = require("../ExceptionHandler/global.exception.handler");
let GlobalDTOValidationPipe = class GlobalDTOValidationPipe {
    async transform(value, metadata) {
        const { metatype } = metadata;
        try {
            if (!metatype || !this.toValidate(metatype)) {
                return value;
            }
            const object = (0, class_transformer_1.plainToClass)(metatype, value ?? {});
            const errors = await (0, class_validator_1.validate)(object);
            if (errors.length > 0) {
                throw new common_1.BadRequestException(errors);
            }
            return value;
        }
        catch (error) {
            console.error(`[GlobalDTOValidationPipe][transform] : `, error);
            throw error;
        }
    }
    toValidate(metatype) {
        try {
            const types = [String, Boolean, Number, Array, Object];
            return !types.find((type) => metatype === type);
        }
        catch (error) {
            console.error(`[GlobalDTOValidationPipe][toValidate] : `, error);
            throw Error(error);
        }
    }
};
exports.GlobalDTOValidationPipe = GlobalDTOValidationPipe;
exports.GlobalDTOValidationPipe = GlobalDTOValidationPipe = __decorate([
    (0, common_1.Injectable)()
], GlobalDTOValidationPipe);
class GlobalParseArrayPipe {
    metatype;
    constructor(options) {
        this.metatype = options.type;
    }
    async transform(items) {
        try {
            if (!items?.length)
                throw new global_exception_handler_1.CustomerException(error_code_msg_config_1.default._200001, common_1.HttpStatus.OK);
            return await Promise.all(items.map(async (item) => {
                return await this.parseAndValidate(item);
            }));
        }
        catch (error) {
            console.error(`[GlobalParseArrayPipe][transform] : `, error);
            throw Error(error);
        }
    }
    async parseAndValidate(value) {
        return new Promise(async (rs, rj) => {
            try {
                switch (this.metatype) {
                    case String:
                        if (typeof value !== "string")
                            throw new global_exception_handler_1.CustomerException(error_code_msg_config_1.default._200001, common_1.HttpStatus.OK);
                        rs(value);
                    default:
                        if (!this.metatype || !this.toValidate(this.metatype)) {
                            return value;
                        }
                        const object = (0, class_transformer_1.plainToClass)(this.metatype, value);
                        const errors = await (0, class_validator_1.validate)(object);
                        if (errors.length > 0) {
                            throw new global_exception_handler_1.CustomerException({
                                ...error_code_msg_config_1.default._200001,
                                additional: { msg: JSON.stringify(errors), isHide: true },
                            }, common_1.HttpStatus.OK);
                        }
                        rs(value);
                        break;
                }
            }
            catch (error) {
                console.error(`[GlobalParseArrayPipe][parseAndValidate] : `, error);
                rj(error);
            }
        });
    }
    toValidate(metatype) {
        try {
            const types = [String, Boolean, Number, Array, Object];
            return !types.find((type) => metatype === type);
        }
        catch (error) {
            console.error(`[GlobalParseArrayPipe][toValidate] : `, error);
            throw Error(error);
        }
    }
}
exports.GlobalParseArrayPipe = GlobalParseArrayPipe;
//# sourceMappingURL=global.dto.validation.pipe.js.map