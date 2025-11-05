export enum Status {
  INVALID_TOKEN_ID = "INVALID_TOKEN_ID",
  INVALID_TOKEN_KEY = "INVALID_TOKEN_KEY",
  INVALID_PARAMETER = "INVALID_PARAMETER",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
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
  /// TODO: 범용 특수처리  
  Etc = 8,
  // 출금 (게임사로 보내는 경우)
  Withdraw = 13,
  // 입금 (게임사에서 회수하는 경우)
  Deposit = 14,
  /// 알 수 없음 | 不明
  Unknown = 99,
}

export enum Lang {
  ko = "ko",
  en = "en",
}


export enum AppPort {
  MAINAPP = "9000",
  EVOLUTION = "9009",
  PP = "9019",
  BNG = "9023",
  FASTSPIN = "9101",
  QQPK = "9103",
  CLP = "9093",
  HRG = "9083",
  PLAY = "9001",
}