import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ELK_LEVEL } from "../../Enum/elk.level.enum";
import { STATE_CODE } from "../../Enum/state.code.enum";
import { ELKLogObj } from "../../Interface/interface.elk.log";
import { LogService } from "../../Utils/log.service";

const logService = new LogService();
const NS_TO_MS = 1e6;
const MS_TO_S = 1e3;

const getDurationInMilliseconds = (start: bigint): number => {
  return Number(start) / NS_TO_MS;
};

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(
    req: Request,
    res: Response & {
      msg?: string;
      level?: ELK_LEVEL;
      code?: STATE_CODE;
    },
    next: NextFunction,
  ): void {
    const elkLogObj: ELKLogObj = {} as ELKLogObj;
    const start = getDurationInMilliseconds(process.hrtime.bigint());

    try {
      const originalWrite = res.write;
      const originalEnd = res.end;
      const chunks: Buffer[] = [];

      res.write = (...args: any[]) => {
        if (args[0]) {
          chunks.push(Buffer.from(args[0]));
        }
        return originalWrite.apply(res, args);
      };

      res.end = (...args: any[]) => {
        if (args[0]) {
          chunks.push(Buffer.from(args[0]));
        }

        const body = Buffer.concat(chunks).toString("utf8");
        let parsedBody: any;

        try {
          if (body) {
            parsedBody = JSON.parse(body);
          }
        } catch (error) {
          console.error("[RequestLoggerMiddleware][JSON.parse]:", error);
          parsedBody = body;
        }

        elkLogObj.headers = JSON.stringify(req.headers);
        elkLogObj.response = JSON.stringify(parsedBody?.result ?? parsedBody);

        // ⚠️ 確保把原始內容寫回給 client
        return originalEnd.apply(res, args);
      };
    } catch (error) {
      this.handleErrorLogging(error, req, res, elkLogObj);
    }

    next();

    res.on("finish", () => {
      const end = getDurationInMilliseconds(process.hrtime.bigint());
      const ms = end - start;
      const s = ms / MS_TO_S;

      this.logger.log(
        `[${res.statusCode}] ${req.method} ${req.originalUrl} ${ms.toFixed(4)} ms (${s.toFixed(2)} s)`,
      );

      this.fillELKLog(req, res, elkLogObj, ms, s);

      console.info('[Request]')
      console.info(elkLogObj?.request);
      console.info('[Response]')
      console.info(elkLogObj?.response);
      logService.logToELK(elkLogObj);
    });
  }

  private handleErrorLogging(
    error: unknown,
    req: Request,
    res: Response,
    elkLogObj: ELKLogObj,
  ) {
    console.error("[RequestLoggerMiddleware][Error]:", error);

    elkLogObj.status = res?.statusCode;
    elkLogObj.code = STATE_CODE.UNEXPECTED;
    elkLogObj.level = ELK_LEVEL.WARN;
    elkLogObj.method = req?.method;
    elkLogObj.request = req?.body;
    elkLogObj.route = req?.originalUrl;
    elkLogObj.msg =
      typeof error === "object" ? JSON.stringify(error) : String(error);
    elkLogObj.sourceIP = this.getClientIP(req);
    elkLogObj.service = process.env.APP_NAME || "unknown";

    logService.logToELK(elkLogObj);
  }

  private fillELKLog(
    req: Request,
    res: Response & { msg?: string; level?: ELK_LEVEL; code?: STATE_CODE },
    elkLogObj: ELKLogObj,
    ms: number,
    s: number,
  ) {
    elkLogObj.status = res?.statusCode;
    elkLogObj.code = res?.code || STATE_CODE.SUCCESS;
    elkLogObj.level = res?.level ?? ELK_LEVEL.INFO;
    elkLogObj.method = req?.method;
    elkLogObj.request = req?.body;
    elkLogObj.route = req?.originalUrl;
    elkLogObj.timing = `${ms.toFixed(4)} ms (${s.toFixed(2)} s)`;
    elkLogObj.msg = res?.msg || "unknown";
    elkLogObj.sourceIP = this.getClientIP(req);
    elkLogObj.service = process.env.APP_NAME || "unknown";
    elkLogObj.exectime = Math.floor(ms);
  }

  private getClientIP(req: Request): string {
    const xForwardedFor = req.headers["x-forwarded-for"];
    return typeof xForwardedFor === "string"
      ? xForwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress || "";
  }
}
