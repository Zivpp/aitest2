export declare enum Status {
    Success = 200,
    Error = 500
}
export declare enum StatusStr {
    Success = "Success",
    InsufficientBalance = "Insufficient Balance",
    CurrencyMismatch = "Currency Mismatch",
    InvalidGameID = "Invalid Game ID",
    InvalidCurrency = "Invalid Currency",
    InvalidPlayerID = "Invalid Player ID",
    InvalidPlatform = "Invalid Platform",
    ProviderDisabled = "Provider Disabled",
    GameDisabled = "Game Disabled",
    PlayerDisabled = "Player Disabled",
    PlatformDisabled = "Platform Disabled",
    UnknownError = "Unknown Error",
    TableNotAvailable = "Table Not Available"
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
