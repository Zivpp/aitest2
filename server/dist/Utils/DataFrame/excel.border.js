"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponPointRange_border = exports.thisMonthUsedPoint_border = exports.memberPointBalance_border = exports.historyYearPoint_border = exports.thisMonthPointInfo_border = exports.memberShipCard_border = exports.newOldMember_border = exports.monthData_border = exports.summary_border = void 0;
const excel_funcion_1 = require("./excel.funcion");
const summary_border = (worksheet) => {
    for (let row = 4; row <= 7; row++) {
        for (let col = 1; col <= 3; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row === 4) {
                (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
            }
            else if (row === 7) {
                (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
            }
            else {
                (0, excel_funcion_1.border)(worksheet, column);
            }
        }
    }
};
exports.summary_border = summary_border;
const monthData_border = (worksheet) => {
    for (let row = 4; row <= 9; row++) {
        for (let col = 5; col <= 13; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row <= 4) {
                (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
            }
            else if (row === 9) {
                (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
            }
            else if (col === 5) {
                (0, excel_funcion_1.border)(worksheet, column, ["left"], "medium");
            }
            else if (col === 8 || col === 11 || col === 13) {
                (0, excel_funcion_1.border)(worksheet, column, ["right"], "medium");
            }
            else {
                (0, excel_funcion_1.border)(worksheet, column);
            }
        }
    }
    (0, excel_funcion_1.border_cust)(worksheet, "E4", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "E9", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M4", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "thin" },
        right: { style: "medium" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M9", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "thin" },
        right: { style: "medium" },
    });
};
exports.monthData_border = monthData_border;
const newOldMember_border = (worksheet) => {
    for (let row = 12; row <= 15; row++) {
        for (let col = 1; col <= 16; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (col === 16) {
                (0, excel_funcion_1.border_cust)(worksheet, column, {
                    top: {
                        style: `${row !== 13 && row !== 14 && row !== 15 ? "medium" : "thin"}`,
                    },
                    bottom: {
                        style: `${row !== 12 && row !== 13 ? "medium" : "thin"}`,
                    },
                    left: { style: "thin" },
                    right: { style: "medium" },
                });
            }
            else if (row === 12) {
                (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
            }
            else if (row === 15) {
                (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
            }
        }
    }
    const row_13 = ["N", "G", "O", "H", "I", "D", "E", "F"];
    const row_14 = ["A", "D", "E", "F", "G", "H", "I"];
    row_13.forEach((x) => (0, excel_funcion_1.border)(worksheet, `${x}13`));
    row_14.forEach((x) => (0, excel_funcion_1.border)(worksheet, `${x}14`));
    (0, excel_funcion_1.border_cust)(worksheet, "C12", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M12", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "medium" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "C13", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "C14", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "K13", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "K14", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M13", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "J13", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "thin" },
        right: { style: "medium" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M14", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "C15", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "K15", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M15", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
};
exports.newOldMember_border = newOldMember_border;
const memberShipCard_border = (worksheet) => {
    for (let row = 18; row <= 22; row++) {
        for (let col = 1; col <= 16; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (col === 16) {
                (0, excel_funcion_1.border_cust)(worksheet, column, {
                    top: {
                        style: `${row !== 19 && row !== 20 && row !== 21 && row !== 22
                            ? "medium"
                            : "thin"}`,
                    },
                    bottom: {
                        style: `${row !== 18 && row !== 19 && row !== 20 ? "medium" : "thin"}`,
                    },
                    left: { style: "thin" },
                    right: { style: "medium" },
                });
            }
            else if (row === 18) {
                (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
            }
            else if (row === 22) {
                (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
            }
        }
    }
    const row_19 = ["D", "E", "F", "G", "H", "I"];
    row_19.forEach((c) => {
        (0, excel_funcion_1.border)(worksheet, `${c}19`);
    });
    const row = ["A", "D", "E", "F", "G", "H", "I", "L", "N", "O"];
    const coloum = ["20", "21"];
    row.forEach((r) => {
        coloum.forEach((c) => {
            (0, excel_funcion_1.border)(worksheet, `${r}${c}`);
        });
    });
    (0, excel_funcion_1.border_cust)(worksheet, "C18", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    const coloum_border = [
        "C19",
        "C20",
        "C21",
        "K20",
        "K21",
        "M19",
        "M20",
        "M21",
    ];
    coloum_border.forEach((x) => {
        (0, excel_funcion_1.border_cust)(worksheet, x, {
            top: {
                style: "thin",
            },
            bottom: {
                style: "thin",
            },
            left: { style: "medium" },
            right: { style: "thin" },
        });
    });
    (0, excel_funcion_1.border_cust)(worksheet, "K18", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M18", {
        top: {
            style: "medium",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "medium" },
        right: { style: "medium" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "B20", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "thin" },
        right: { style: "medium" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "J20", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "thin",
        },
        left: { style: "thin" },
        right: { style: "medium" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "C22", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "K22", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
    (0, excel_funcion_1.border_cust)(worksheet, "M22", {
        top: {
            style: "thin",
        },
        bottom: {
            style: "medium",
        },
        left: { style: "medium" },
        right: { style: "thin" },
    });
};
exports.memberShipCard_border = memberShipCard_border;
const thisMonthPointInfo_border = (worksheet) => {
    for (let row = 4; row <= 7; row++) {
        for (let col = 1; col <= 4; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row === 4) {
                if (col == 4) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else if (row === 7) {
                if (col == 4) {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
                }
            }
            else {
                if (col == 4) {
                    (0, excel_funcion_1.border)(worksheet, column, ["right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column);
                }
            }
        }
    }
};
exports.thisMonthPointInfo_border = thisMonthPointInfo_border;
const historyYearPoint_border = (worksheet) => {
    for (let row = 10; row <= 16; row++) {
        for (let col = 1; col <= 4; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row === 10) {
                if (col == 4) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else if (row === 16) {
                if (col == 4) {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
                }
            }
            else {
                if (col == 4) {
                    (0, excel_funcion_1.border)(worksheet, column, ["right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column);
                }
            }
        }
    }
};
exports.historyYearPoint_border = historyYearPoint_border;
const memberPointBalance_border = (worksheet) => {
    for (let row = 20; row <= 40; row++) {
        for (let col = 1; col <= 12; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row === 20) {
                if (col == 6 || col == 12) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else if (row === 40) {
                if (col == 6 || col == 12) {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
                }
            }
            else if (row === 21 && col <= 6) {
                if (col == 6) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else {
                if (col == 6 || col == 12) {
                    (0, excel_funcion_1.border)(worksheet, column, ["right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column);
                }
            }
        }
    }
};
exports.memberPointBalance_border = memberPointBalance_border;
const thisMonthUsedPoint_border = (worksheet) => {
    for (let row = 43; row <= 63; row++) {
        for (let col = 1; col <= 12; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row === 43) {
                if (col == 6 || col == 12) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else if (row === 63) {
                if (col == 6 || col == 12) {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
                }
            }
            else if (row === 44 && col <= 6) {
                if (col == 6) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else {
                if (col == 6 || col == 12) {
                    (0, excel_funcion_1.border)(worksheet, column, ["right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column);
                }
            }
        }
    }
};
exports.thisMonthUsedPoint_border = thisMonthUsedPoint_border;
const couponPointRange_border = (worksheet) => {
    for (let row = 36; row <= 56; row++) {
        for (let col = 1; col <= 14; col++) {
            const column = `${String.fromCharCode(64 + col)}${row}`;
            if (row === 36) {
                if (col == 2 || col == 8 || col == 14) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else if (row === 56) {
                if (col == 2 || col == 8 || col == 14) {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["bottom"], "medium");
                }
            }
            else if (row === 37 && col <= 8) {
                if (col == 2 || col == 8) {
                    (0, excel_funcion_1.border)(worksheet, column, ["top", "right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column, ["top"], "medium");
                }
            }
            else {
                if (col == 2 || col == 8 || col == 14) {
                    (0, excel_funcion_1.border)(worksheet, column, ["right"], "medium");
                }
                else {
                    (0, excel_funcion_1.border)(worksheet, column);
                }
            }
        }
    }
};
exports.couponPointRange_border = couponPointRange_border;
//# sourceMappingURL=excel.border.js.map