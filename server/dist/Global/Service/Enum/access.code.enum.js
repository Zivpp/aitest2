"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPort = exports.Lang = exports.CallbackType = exports.Status = void 0;
var Status;
(function (Status) {
    Status["INVALID_TOKEN_ID"] = "INVALID_TOKEN_ID";
    Status["INVALID_TOKEN_KEY"] = "INVALID_TOKEN_KEY";
    Status["INVALID_PARAMETER"] = "INVALID_PARAMETER";
    Status["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
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
    CallbackType[CallbackType["Etc"] = 8] = "Etc";
    CallbackType[CallbackType["Withdraw"] = 13] = "Withdraw";
    CallbackType[CallbackType["Deposit"] = 14] = "Deposit";
    CallbackType[CallbackType["Unknown"] = 99] = "Unknown";
})(CallbackType || (exports.CallbackType = CallbackType = {}));
var Lang;
(function (Lang) {
    Lang["ko"] = "ko";
    Lang["en"] = "en";
})(Lang || (exports.Lang = Lang = {}));
var AppPort;
(function (AppPort) {
    AppPort["MAINAPP"] = "9000";
    AppPort["EVOLUTION"] = "9009";
    AppPort["PP"] = "9019";
    AppPort["BNG"] = "9023";
    AppPort["FASTSPIN"] = "9101";
    AppPort["QQPK"] = "9103";
    AppPort["CLP"] = "9093";
    AppPort["HRG"] = "9083";
    AppPort["PLAY"] = "9001";
})(AppPort || (exports.AppPort = AppPort = {}));
//# sourceMappingURL=access.code.enum.js.map