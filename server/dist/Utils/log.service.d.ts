import { ELKLogObj } from "src/Interface/interface.elk.log";
export declare class LogService {
    errorLogToElk(func: string, sourceType: string, level: string, msg: any, code?: string, timing?: string): void;
    logToELK(reqObj: ELKLogObj): void;
}
