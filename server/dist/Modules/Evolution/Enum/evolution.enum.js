"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = exports.CallbackType = exports.Status = void 0;
var Status;
(function (Status) {
    Status["OK"] = "OK";
    Status["INVALID_TOKEN_ID"] = "INVALID_TOKEN_ID";
    Status["INVALID_TOKEN_KEY"] = "INVALID_TOKEN_KEY";
    Status["INVALID_PARAMETER"] = "INVALID_PARAMETER";
    Status["BET_ALREADY_EXIST"] = "BET_ALREADY_EXIST";
    Status["BET_ALREADY_SETTLED"] = "BET_ALREADY_SETTLED";
    Status["BET_DOES_NOT_EXIST"] = "BET_DOES_NOT_EXIST";
    Status["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    Status["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    Status["FINAL_ERROR_ACTION_FAILED"] = "FINAL_ERROR_ACTION_FAILED";
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
//# sourceMappingURL=evolution.enum.js.map