import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
export declare class GlobalDTOValidationPipe implements PipeTransform<any> {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    private toValidate;
}
export declare class GlobalParseArrayPipe implements PipeTransform {
    private readonly metatype;
    constructor(options: any);
    transform(items: any): Promise<any[]>;
    parseAndValidate(value: any): Promise<unknown>;
    private toValidate;
}
