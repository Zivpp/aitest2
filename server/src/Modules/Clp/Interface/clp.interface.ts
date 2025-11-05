export interface GameResponse {
  code: number; // 狀態代碼，例如 CP_RESULT_CODE.success
  data: {
    balance: number; // 餘額
    [key: string]: any; // 若未來 data 有更多欄位，可以這樣保留彈性
  };
  msg?: string; // 訊息內容，可為空字串
}
