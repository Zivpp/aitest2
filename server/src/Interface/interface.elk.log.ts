export interface ELKLogObj {
  /** API 使用方法 */
  method: string;
  /** API 呼叫路徑 */
  route: string;
  /** 請求來源 IP */
  sourceIP: string;
  /** 請求來源設備 */
  userAgent: string;
  /** this.msg type: 可參考 elk.level.enum.ts */
  level: string;
  /** 自定義訊息/系統定義訊息/錯誤訊息 */
  msg: string;
  /** HTTP 錯誤代碼 */
  status: number;
  /** 系統定義錯誤代碼 */
  code: number;
  /** user token */
  token: string;
  /** 當前時間 ； UTCToTimeString ； 由服務自己生成不用帶 */
  time: string;
  /** API 的請求物件；注意  JSON.stringify 存入時的 error handle. */
  request: any;
  /** API 的請求回應結果；注意  JSON.stringify 存入時的 error handle. ； 注意結果太大不要存入 */
  response: string;
  /** 紀錄時機 */
  timing: string;
  /** 紀錄的 server */
  service: string;
  // ------ 以上為通用欄位，以下為該專案獨有的欄位 ------
  /** 信件接收者 */
  emailTo: string;
  /** 信件內容 */
  emailContent: string;
  /** log 來源 */
  sourceType: string;
  /** 執行時間 */
  exectime: number;
  /** HTTP header */
  headers: string;
}
