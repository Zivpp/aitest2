export declare enum Status {
    INVALID_TOKEN = "INVALID_TOKEN",
    EXPIRED_TOKEN = "EXPIRED_TOKEN",
    GAME_NOT_ALLOWED = "GAME_NOT_ALLOWED",
    TIME_EXCEED = "TIME_EXCEED",
    LOSS_EXCEED = "LOSS_EXCEED",
    BET_EXCEED = "BET_EXCEED",
    FUNDS_EXCEED = "FUNDS_EXCEED",
    PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
    GAME_REOPENED = "GAME_REOPENED",
    SESSION_CLOSED = "SESSION_CLOSED",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    OTHER_EXCEED = "OTHER_EXCEED"
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
