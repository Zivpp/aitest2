import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { LogService } from "../../Utils/log.service";
export default class GlobalExceptionHandler implements ExceptionFilter {
    private readonly logService;
    constructor(logService: LogService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
export declare class CustomerException extends HttpException {
    private errorVaule;
    constructor(errorVaule: any, statusCode: HttpStatus);
    getErrorCode(): number;
    getErrorResult<T>(): T;
    getErrorMessage(): {
        msg: any;
    };
}
