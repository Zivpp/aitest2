import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import _CONFIG_ERR_CODE_MSG from "../../Config/error.code.msg.config";
import { CustomerException } from "../ExceptionHandler/global.exception.handler";

@Injectable()
export class GlobalDTOValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    try {
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }

      const object = plainToClass(metatype, value ?? {});
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
        // 20250717 目前服務不需要自定義錯誤型態，直接回傳錯誤訊息
        // throw new CustomerException(
        //   {
        //     ..._CONFIG_ERR_CODE_MSG._200001,
        //     additional: { msg: JSON.stringify(errors), isHide: true },
        //   },
        //   HttpStatus.OK,
        // );
      }
      return value;
    } catch (error) {
      console.error(`[GlobalDTOValidationPipe][transform] : `, error);
      throw error;
    }
  }

  private toValidate(metatype): boolean {
    try {
      const types = [String, Boolean, Number, Array, Object];
      return !types.find((type) => metatype === type);
    } catch (error) {
      console.error(`[GlobalDTOValidationPipe][toValidate] : `, error);
      throw Error(error);
    }
  }
}

export class GlobalParseArrayPipe implements PipeTransform {
  private readonly metatype;

  constructor(options: any) {
    this.metatype = options.type;
  }

  async transform(items: any) {
    try {
      if (!items?.length)
        throw new CustomerException(
          _CONFIG_ERR_CODE_MSG._200001,
          HttpStatus.OK,
        );

      return await Promise.all(
        items.map(async (item) => {
          return await this.parseAndValidate(item);
        }),
      );
    } catch (error) {
      console.error(`[GlobalParseArrayPipe][transform] : `, error);
      throw Error(error);
    }
  }

  async parseAndValidate(value: any) {
    return new Promise(async (rs, rj) => {
      try {
        switch (this.metatype) {
          case String:
            if (typeof value !== "string")
              throw new CustomerException(
                _CONFIG_ERR_CODE_MSG._200001,
                HttpStatus.OK,
              );
            rs(value);
          default:
            if (!this.metatype || !this.toValidate(this.metatype)) {
              return value;
            }
            const object = plainToClass(this.metatype, value);
            const errors = await validate(object);
            if (errors.length > 0) {
              throw new CustomerException(
                {
                  ..._CONFIG_ERR_CODE_MSG._200001,
                  additional: { msg: JSON.stringify(errors), isHide: true },
                },
                HttpStatus.OK,
              );
            }
            rs(value);
            break;
        }
      } catch (error) {
        console.error(`[GlobalParseArrayPipe][parseAndValidate] : `, error);
        rj(error);
      }
    });
  }

  private toValidate(metatype): boolean {
    try {
      const types = [String, Boolean, Number, Array, Object];
      return !types.find((type) => metatype === type);
    } catch (error) {
      console.error(`[GlobalParseArrayPipe][toValidate] : `, error);
      throw Error(error);
    }
  }
}
