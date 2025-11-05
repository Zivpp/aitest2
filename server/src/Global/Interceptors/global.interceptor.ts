import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LogService } from "src/Utils/log.service";

export interface Response<T> {
  statusCode: number;
  timestamp: string;
  message: string;
  result: T;
}
@Injectable()
export default class ApiInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    // // 強制設定 POST 請求的狀態碼為 200 OK
    // if (req.method === 'POST') {
    //   res.statusCode = HttpStatus.OK;
    // }

    return next.handle().pipe(
      map((result) => {
        return {
          code: HttpStatus.OK,
          timestamp: new Date().toISOString(),
          message: "呼叫成功，未發生錯誤。",
          result,
        };
      }),
    );
  }
}
