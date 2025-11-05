import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ELK_LEVEL } from "../../Enum/elk.level.enum";
import { STATE_CODE } from "../../Enum/state.code.enum";
export declare class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: Request, res: Response & {
        msg?: string;
        level?: ELK_LEVEL;
        code?: STATE_CODE;
    }, next: NextFunction): void;
    private handleErrorLogging;
    private fillELKLog;
    private getClientIP;
}
