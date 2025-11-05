"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = exports.CallbackType = void 0;
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
//# sourceMappingURL=clp.enum.js.map