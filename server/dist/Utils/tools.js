"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTCToTimeString = void 0;
const UTCToTimeString = (tStr) => {
    if (!tStr)
        return "";
    const date = new Date(tStr);
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    const dateTimeStr = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    return dateTimeStr;
};
exports.UTCToTimeString = UTCToTimeString;
//# sourceMappingURL=tools.js.map