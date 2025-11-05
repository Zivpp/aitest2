export enum Status {
  Success = 200,
  Error = 500,
}

export enum StatusStr {
  Success = "Success",
  InsufficientBalance = "Insufficient Balance", // 40101
  CurrencyMismatch = "Currency Mismatch", // 40202
  InvalidGameID = "Invalid Game ID", // 40203
  InvalidCurrency = "Invalid Currency", // 40204
  InvalidPlayerID = "Invalid Player ID", // 40205
  InvalidPlatform = "Invalid Platform", // 40206
  ProviderDisabled = "Provider Disabled", // 40207
  GameDisabled = "Game Disabled", // 40208
  PlayerDisabled = "Player Disabled", // 40209
  PlatformDisabled = "Platform Disabled", // 40210
  UnknownError = "Unknown Error", // 40211
  TableNotAvailable = "Table Not Available", // 40212
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
  Unknown = 99,
}

export enum Lang {
  ko = "ko",
  en = "en",
}
