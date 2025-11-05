export declare enum Status {
    OK = "OK",
    INVALID_TOKEN_ID = "INVALID_TOKEN_ID",
    INVALID_TOKEN_KEY = "INVALID_TOKEN_KEY",
    INVALID_PARAMETER = "INVALID_PARAMETER",
    BET_ALREADY_EXIST = "BET_ALREADY_EXIST",
    BET_ALREADY_SETTLED = "BET_ALREADY_SETTLED",
    BET_DOES_NOT_EXIST = "BET_DOES_NOT_EXIST",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    FINAL_ERROR_ACTION_FAILED = "FINAL_ERROR_ACTION_FAILED"
}
export declare enum CallbackType {
    MemberCheck = 1,
    Balance = 2,
    Bet = 3,
    Result = 4,
    Refund = 5,
    Tip = 6,
    Bonus = 7
}
export declare enum Lang {
    ko = "ko",
    en = "en"
}
