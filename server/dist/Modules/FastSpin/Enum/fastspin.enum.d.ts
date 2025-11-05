export declare enum Status {
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
    RelatedIdNotFound = 109,
    RecordIdNotFound_110 = 110,
    RecordIdNotFound_111 = 111,
    ApiCallLimited = 112,
    InvalidAcctId = 113,
    InvalidFormat = 118,
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
    CurrencyInvalid = 50112,
    AmountInvalid = 50113,
    DateFormatInvalid = 50115
}
export declare enum StatusStr {
    Success = "Success",
    SystemError = "System Error",
    AcctNotFound = "Acct Not Found",
    AcctInactive = "Acct Inactive",
    TokenValidationFailed = "Token Validation Failed",
    MissingParameters = "Missing Parameters",
    InvalidParameters = "Invalid Parameters",
    DuplicatedSerialNo = "Duplicated Serial No"
}
export declare enum CallbackType {
    MemberCheck = 1,
    Balance = 2,
    Bet = 3,
    Result = 4,
    Refund = 5,
    Tip = 6,
    Bonus = 7,
    Unknown = 99
}
export declare enum Lang {
    ko = "ko",
    en = "en"
}
