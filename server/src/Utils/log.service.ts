import { Injectable } from "@nestjs/common";
import { ELKLogObj } from "src/Interface/interface.elk.log";
import { UTCToTimeString } from "./tools";

@Injectable()
export class LogService {
  /**
   * 紀錄錯誤至 ELK
   */
  errorLogToElk(
    func: string,
    sourceType: string,
    level: string,
    msg: any,
    code?: string,
    timing: string = "end",
  ) {
    const now = Date.now();

    const log = [
      `function=${func}`,
      `level=${level}`,
      `msg=${msg ?? ""}`,
      `code=${code ?? ""}`,
      `time=${UTCToTimeString(now)}`,
      `timing=${timing}`,
      `sourceType=${sourceType}`,
      `service=crm_backstage`,
    ].join("|");

    console.error(log);
  }

  /**
   * Print log in ELK-compatible format
   */
  logToELK(reqObj: ELKLogObj) {
    try {
      const log: Record<string, string> = {};

      // 處理 request
      try {
        const body = reqObj?.request?.body ?? reqObj.request;
        log.request = body ? JSON.stringify(body) : "";
      } catch (err) {
        log.request = `[request stringify error] ${err.message}`;
      }

      // 處理 response
      try {
        const responseStr = reqObj.response
          ? JSON.stringify(reqObj.response)
          : "";
        log.response = responseStr; // 不再受字數限制
        // log.response =
        //   responseStr.length < 300
        //     ? responseStr
        //     : `${reqObj.route} response too long`;
      } catch (err) {
        log.response = `[response JSON stringify ERROR] ${err.message}`;
      }

      // 時間與其餘欄位
      log.time = UTCToTimeString(new Date());

      for (const key of Object.keys(reqObj)) {
        if (!log[key] && reqObj[key] !== undefined && reqObj[key] !== null) {
          log[key] = String(reqObj[key]);
        }
      }

      // 組合成 log string
      const elkLog = Object.entries(log)
        .map(([k, v]) => `${k}=${v}`)
        .join("|");

      console.info(elkLog);
    } catch (err) {
      console.error("[LogService][printELKLog] error:", err);
    }
  }
}
