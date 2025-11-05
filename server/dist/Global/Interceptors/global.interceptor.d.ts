import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { LogService } from "src/Utils/log.service";
export interface Response<T> {
    statusCode: number;
    timestamp: string;
    message: string;
    result: T;
}
export default class ApiInterceptor implements NestInterceptor {
    private readonly logService;
    constructor(logService: LogService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
