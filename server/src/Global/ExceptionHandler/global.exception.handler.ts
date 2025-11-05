import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import _CONFIG_ERR_CODE_MSG from "../../Config/error.code.msg.config";
import { LogService } from "../../Utils/log.service";

@Catch()
export default class GlobalExceptionHandler implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const path = req?.originalUrl || "";

    // 排除 Let's Encrypt 驗證挑戰路徑，交由 NGINX 或 cert-manager 處理
    if (isBypassedPath(path)) return;

    // 判斷錯誤類型
    const isCust = exception instanceof CustomerException;
    const isHttp = exception instanceof HttpException;

    // 錯誤處理
    if (isCust) {
      customerErrorProcess(exception, host);
    } else {
      errorProcess(exception, host);
    }
  }
}

/**
 * 不攔截的路徑
 * @param path
 * @returns
 */
function isBypassedPath(path: string): boolean {
  const bypassPaths = [
    "/.well-known/acme-challenge",
    "/api/.well-known/acme-challenge",
    "/health",
  ];
  return bypassPaths.some((prefix) => path.startsWith(prefix));
}

/**
 * [自定義] 錯誤回傳
 * @param exception
 * @param host
 */
const customerErrorProcess = (exception, host: ArgumentsHost) => {
  try {
    const ctx = host?.switchToHttp();
    const resp = ctx?.getResponse();
    const req = ctx?.getRequest();
    const status = exception?.getStatus();
    const additionalError = exception?.getErrorResult();
    const additional = additionalError?.isHide ? {} : additionalError;
    resp.status(status).json({
      statusCode: exception?.getErrorCode(),
      timestamp: new Date().toISOString(),
      path: req?.originalUrl,
      result: {
        ...exception?.getErrorMessage(),
        ...additional,
      },
    });
  } catch (error) {
    console.error(`[GlobalExceptionHandler][customerErrorProcess] : `, error);
  }
};

//[自定義] Nestjs 預設
const errorProcess = (exception, host: ArgumentsHost) => {
  try {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse();
    const req = ctx.getRequest();
    const status = HttpStatus.BAD_REQUEST;

    resp.status(status).json({
      statusCode: _CONFIG_ERR_CODE_MSG?._200002.code,
      errMsg: _CONFIG_ERR_CODE_MSG._200002.msg,
      timestamp: new Date().toISOString(),
      path: req?.originalUrl,
      exception: { ...exception },
    });
  } catch (error) {
    console.error(`[GlobalExceptionHandler][errorProcess] : `, error);
  }
};

/**
 * [自定義] 跟預設的作為區別（內容一樣, 僅因應生成實體判斷使用)
 */
export class CustomerException extends HttpException {
  private errorVaule;
  constructor(errorVaule, statusCode: HttpStatus) {
    super(errorVaule, statusCode);
    this.errorVaule = errorVaule;
  }

  getErrorCode(): number {
    return this.errorVaule.code;
  }

  getErrorResult<T>(): T {
    return this.errorVaule.additional;
  }

  getErrorMessage(): { msg } {
    return { msg: this.errorVaule.msg };
  }
}
