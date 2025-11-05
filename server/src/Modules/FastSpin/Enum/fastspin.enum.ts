export enum Status {
  Success = 0,
  SystemError = 1,
  InvalidRequest = 2,
  ServiceInaccessible = 3,
  RequestTimeout = 100,
  CallLimited = 101,
  RequestForbidden = 104,
  MissingParameters = 105,
  InvalidParameters = 106,
  DuplicatedSerialNo = 107,
  RelatedIdNotFound = 109, // This Transfer API is usually used for a single wallet
  RecordIdNotFound_110 = 110,
  RecordIdNotFound_111 = 111,
  ApiCallLimited = 112, // Exceed the limit of calling API
  InvalidAcctId = 113, // Acct ID incorrect format
  InvalidFormat = 118, // Parse JSON Data Failed
  IpNotWhitelisted = 120,
  SystemMaintenance = 5003,
  MerchantNotFound = 10113,
  MerchantSuspend = 10116,
  AcctExist = 50099,
  AcctNotFound = 50100,
  AcctInactive = 50101,
  AcctLocked = 50102,
  AcctSuspend = 50103,
  TokenValidationFailed = 50104,
  InsufficientBalance = 50110,
  ExceedMaxAmount = 50111,
  CurrencyInvalid = 50112, // Deposit/withdraw currency code inconsistent with player’s default or merchant currency.
  AmountInvalid = 50113, // Deposit/withdraw amount must be greater than 0.
  DateFormatInvalid = 50115, // Date format incorrect
}

export enum StatusStr {
  Success = "Success",
  SystemError = "System Error",
  AcctNotFound = "Acct Not Found",
  AcctInactive = "Acct Inactive",
  TokenValidationFailed = "Token Validation Failed",
  MissingParameters = "Missing Parameters",
  InvalidParameters = "Invalid Parameters",
  DuplicatedSerialNo = "Duplicated Serial No",
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
