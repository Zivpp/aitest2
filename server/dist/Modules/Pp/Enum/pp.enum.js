"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = exports.CallbackType = exports.Status = void 0;
var Status;
(function (Status) {
    Status["INVALID_TOKEN_ID"] = "INVALID_TOKEN_ID";
    Status["INVALID_TOKEN_KEY"] = "INVALID_TOKEN_KEY";
    Status["INVALID_PARAMETER"] = "INVALID_PARAMETER";
    Status["SUCCESS"] = "SUCCESS";
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
//# sourceMappingURL=pp.enum.js.map