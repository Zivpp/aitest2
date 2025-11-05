"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = exports.CallbackType = exports.Status = void 0;
var Status;
(function (Status) {
    Status["INVALID_TOKEN"] = "INVALID_TOKEN";
    Status["EXPIRED_TOKEN"] = "EXPIRED_TOKEN";
    Status["GAME_NOT_ALLOWED"] = "GAME_NOT_ALLOWED";
    Status["TIME_EXCEED"] = "TIME_EXCEED";
    Status["LOSS_EXCEED"] = "LOSS_EXCEED";
    Status["BET_EXCEED"] = "BET_EXCEED";
    Status["FUNDS_EXCEED"] = "FUNDS_EXCEED";
    Status["PLAYER_DISCONNECTED"] = "PLAYER_DISCONNECTED";
    Status["GAME_REOPENED"] = "GAME_REOPENED";
    Status["SESSION_CLOSED"] = "SESSION_CLOSED";
    Status["NOT_IMPLEMENTED"] = "NOT_IMPLEMENTED";
    Status["OTHER_EXCEED"] = "OTHER_EXCEED";
})(Status || (exports.Status = Status = {}));
var CallbackType;
(function (CallbackType) {
    CallbackType[CallbackType["MemberCheck"] = 1] = "MemberCheck";
    CallbackType[CallbackType["Balance"] = 2] = "Balance";
    CallbackType[CallbackType["Bet"] = 3] = "Bet";
    CallbackType[CallbackType["Result"] = 4] = "Result";
    CallbackType[CallbackType["Refund"] = 5] = "Refund";
    CallbackType[CallbackType["Tip"] = 6] = "Tip";
    CallbackType[CallbackType["Bonus"] = 7] = "Bonus";
})(CallbackType || (exports.CallbackType = CallbackType = {}));
var Lang;
(function (Lang) {
    Lang["ko"] = "ko";
    Lang["en"] = "en";
})(Lang || (exports.Lang = Lang = {}));
//# sourceMappingURL=bng.enum.js.map