export enum Status {
  INVALID_TOKEN_ID = "INVALID_TOKEN_ID",
  INVALID_TOKEN_KEY = "INVALID_TOKEN_KEY",
  INVALID_PARAMETER = "INVALID_PARAMETER",
  SUCCESS = "SUCCESS",
}

export enum CallbackType {
  /// 회원 확인 | 會員驗證
  MemberCheck = 1,
  /// 잔액 조회 | 剩餘金額查詢
  Balance = 2,
  /// 베팅 | 下注
  Bet = 3,
  /// 결과 | 結果
  Result = 4,
  /// 환불 | 退還
  Refund = 5,
  /// 팁 | 指示
  Tip = 6,
  /// 보너스 | 儲值獎金
  Bonus = 7,
  /// 알 수 없음 | 不明
  // Unknown,
}

export enum Lang {
  ko = "ko",
  en = "en",
}
