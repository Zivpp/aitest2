"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = exports.CallbackType = exports.StatusStr = exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["Success"] = 200] = "Success";
    Status[Status["Error"] = 500] = "Error";
})(Status || (exports.Status = Status = {}));
var StatusStr;
(function (StatusStr) {
    StatusStr["Success"] = "Success";
    StatusStr["InsufficientBalance"] = "Insufficient Balance";
    StatusStr["CurrencyMismatch"] = "Currency Mismatch";
    StatusStr["InvalidGameID"] = "Invalid Game ID";
    StatusStr["InvalidCurrency"] = "Invalid Currency";
    StatusStr["InvalidPlayerID"] = "Invalid Player ID";
    StatusStr["InvalidPlatform"] = "Invalid Platform";
    StatusStr["ProviderDisabled"] = "Provider Disabled";
    StatusStr["GameDisabled"] = "Game Disabled";
    StatusStr["PlayerDisabled"] = "Player Disabled";
    StatusStr["PlatformDisabled"] = "Platform Disabled";
    StatusStr["UnknownError"] = "Unknown Error";
    StatusStr["TableNotAvailable"] = "Table Not Available";
})(StatusStr || (exports.StatusStr = StatusStr = {}));
var CallbackType;
(function (CallbackType) {
    CallbackType[CallbackType["MemberCheck"] = 1] = "MemberCheck";
    CallbackType[CallbackType["Balance"] = 2] = "Balance";
    CallbackType[CallbackType["Bet"] = 3] = "Bet";
    CallbackType[CallbackType["Result"] = 4] = "Result";
    CallbackType[CallbackType["Refund"] = 5] = "Refund";
    CallbackType[CallbackType["Tip"] = 6] = "Tip";
    CallbackType[CallbackType["Bonus"] = 7] = "Bonus";
    CallbackType[CallbackType["Unknown"] = 99] = "Unknown";
})(CallbackType || (exports.CallbackType = CallbackType = {}));
var Lang;
(function (Lang) {
    Lang["ko"] = "ko";
    Lang["en"] = "en";
})(Lang || (exports.Lang = Lang = {}));
//# sourceMappingURL=qqpk.enum.js.map