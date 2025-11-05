import * as ExcelJS from "exceljs";
import { border, border_cust } from "./excel.funcion";

/**
 * 消費分析內外框線
 * @param worksheet
 */
export const summary_border = (worksheet: ExcelJS.Worksheet) => {
  // 加入框線
  for (let row = 4; row <= 7; row++) {
    for (let col = 1; col <= 3; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row === 4) {
        border(worksheet, column, ["top"], "medium");
      } else if (row === 7) {
        border(worksheet, column, ["bottom"], "medium");
      } else {
        border(worksheet, column);
      }
    }
  }
};

/**
 * 月份消費分析內外框線
 * @param worksheet
 */
export const monthData_border = (worksheet: ExcelJS.Worksheet) => {
  // 框線
  for (let row = 4; row <= 9; row++) {
    for (let col = 5; col <= 13; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row <= 4) {
        border(worksheet, column, ["top"], "medium");
      } else if (row === 9) {
        border(worksheet, column, ["bottom"], "medium");
      } else if (col === 5) {
        border(worksheet, column, ["left"], "medium");
      } else if (col === 8 || col === 11 || col === 13) {
        border(worksheet, column, ["right"], "medium");
      } else {
        border(worksheet, column);
      }
    }
  }

  border_cust(worksheet, "E4", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "E9", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "medium",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "M4", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "thin" },
    right: { style: "medium" },
  });
  border_cust(worksheet, "M9", {
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

/**
 * 新舊會員消費分析內外框線
 * @param worksheet
 */
export const newOldMember_border = (worksheet: ExcelJS.Worksheet) => {
  for (let row = 12; row <= 15; row++) {
    for (let col = 1; col <= 16; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (col === 16) {
        border_cust(worksheet, column, {
          top: {
            style: `${
              row !== 13 && row !== 14 && row !== 15 ? "medium" : "thin"
            }`,
          },
          bottom: {
            style: `${row !== 12 && row !== 13 ? "medium" : "thin"}`,
          },
          left: { style: "thin" },
          right: { style: "medium" },
        });
      } else if (row === 12) {
        border(worksheet, column, ["top"], "medium");
      } else if (row === 15) {
        border(worksheet, column, ["bottom"], "medium");
      }
    }
  }

  const row_13 = ["N", "G", "O", "H", "I", "D", "E", "F"];
  const row_14 = ["A", "D", "E", "F", "G", "H", "I"];
  row_13.forEach((x) => border(worksheet, `${x}13`));
  row_14.forEach((x) => border(worksheet, `${x}14`));

  border_cust(worksheet, "C12", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "M12", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "medium" },
  });

  border_cust(worksheet, "C13", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "C14", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "K13", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "K14", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "M13", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "J13", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "thin" },
    right: { style: "medium" },
  });
  border_cust(worksheet, "M14", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });

  border_cust(worksheet, "C15", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "medium",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "K15", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "medium",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "M15", {
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

/**
 * 會員卡別消費分析內外框線
 * @param worksheet
 */
export const memberShipCard_border = (worksheet: ExcelJS.Worksheet) => {
  for (let row = 18; row <= 22; row++) {
    for (let col = 1; col <= 16; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (col === 16) {
        border_cust(worksheet, column, {
          top: {
            style: `${
              row !== 19 && row !== 20 && row !== 21 && row !== 22
                ? "medium"
                : "thin"
            }`,
          },
          bottom: {
            style: `${
              row !== 18 && row !== 19 && row !== 20 ? "medium" : "thin"
            }`,
          },
          left: { style: "thin" },
          right: { style: "medium" },
        });
      } else if (row === 18) {
        border(worksheet, column, ["top"], "medium");
      } else if (row === 22) {
        border(worksheet, column, ["bottom"], "medium");
      }
    }
  }
  const row_19 = ["D", "E", "F", "G", "H", "I"];
  row_19.forEach((c) => {
    border(worksheet, `${c}19`);
  });

  const row = ["A", "D", "E", "F", "G", "H", "I", "L", "N", "O"];
  const coloum = ["20", "21"];
  row.forEach((r) => {
    coloum.forEach((c) => {
      border(worksheet, `${r}${c}`);
    });
  });

  border_cust(worksheet, "C18", {
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
    border_cust(worksheet, x, {
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

  border_cust(worksheet, "K18", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "M18", {
    top: {
      style: "medium",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "medium" },
    right: { style: "medium" },
  });
  border_cust(worksheet, "B20", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "thin" },
    right: { style: "medium" },
  });
  border_cust(worksheet, "J20", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "thin",
    },
    left: { style: "thin" },
    right: { style: "medium" },
  });
  border_cust(worksheet, "C22", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "medium",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "K22", {
    top: {
      style: "thin",
    },
    bottom: {
      style: "medium",
    },
    left: { style: "medium" },
    right: { style: "thin" },
  });
  border_cust(worksheet, "M22", {
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

/**
 * 本月點數概況內外框線
 * @param worksheet
 */
export const thisMonthPointInfo_border = (worksheet: ExcelJS.Worksheet) => {
  // 加入框線
  for (let row = 4; row <= 7; row++) {
    for (let col = 1; col <= 4; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row === 4) {
        if (col == 4) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else if (row === 7) {
        if (col == 4) {
          border(worksheet, column, ["bottom", "right"], "medium");
        } else {
          border(worksheet, column, ["bottom"], "medium");
        }
      } else {
        if (col == 4) {
          border(worksheet, column, ["right"], "medium");
        } else {
          border(worksheet, column);
        }
      }
    }
  }
};

/**
 * 歷史點數發行＆兌換
 * @param worksheet
 */
export const historyYearPoint_border = (worksheet: ExcelJS.Worksheet) => {
  // 加入框線
  for (let row = 10; row <= 16; row++) {
    for (let col = 1; col <= 4; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row === 10) {
        if (col == 4) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else if (row === 16) {
        if (col == 4) {
          border(worksheet, column, ["bottom", "right"], "medium");
        } else {
          border(worksheet, column, ["bottom"], "medium");
        }
      } else {
        if (col == 4) {
          border(worksheet, column, ["right"], "medium");
        } else {
          border(worksheet, column);
        }
      }
    }
  }
};

/**
 * 現有會員持有點數分佈
 * @param worksheet
 */
export const memberPointBalance_border = (worksheet: ExcelJS.Worksheet) => {
  // 加入框線
  for (let row = 20; row <= 40; row++) {
    for (let col = 1; col <= 12; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row === 20) {
        if (col == 6 || col == 12) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else if (row === 40) {
        if (col == 6 || col == 12) {
          border(worksheet, column, ["bottom", "right"], "medium");
        } else {
          border(worksheet, column, ["bottom"], "medium");
        }
      } else if (row === 21 && col <= 6) {
        if (col == 6) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else {
        if (col == 6 || col == 12) {
          border(worksheet, column, ["right"], "medium");
        } else {
          border(worksheet, column);
        }
      }
    }
  }
};

/**
 * 本月使用點數統計
 * @param worksheet
 */
export const thisMonthUsedPoint_border = (worksheet: ExcelJS.Worksheet) => {
  // 加入框線
  for (let row = 43; row <= 63; row++) {
    for (let col = 1; col <= 12; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row === 43) {
        if (col == 6 || col == 12) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else if (row === 63) {
        if (col == 6 || col == 12) {
          border(worksheet, column, ["bottom", "right"], "medium");
        } else {
          border(worksheet, column, ["bottom"], "medium");
        }
      } else if (row === 44 && col <= 6) {
        if (col == 6) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else {
        if (col == 6 || col == 12) {
          border(worksheet, column, ["right"], "medium");
        } else {
          border(worksheet, column);
        }
      }
    }
  }
};

/**
 * 依點數區間統計
 * @param worksheet
 */
export const couponPointRange_border = (worksheet: ExcelJS.Worksheet) => {
  // 加入框線
  for (let row = 36; row <= 56; row++) {
    for (let col = 1; col <= 14; col++) {
      const column = `${String.fromCharCode(64 + col)}${row}`;
      if (row === 36) {
        if (col == 2 || col == 8 || col == 14) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else if (row === 56) {
        if (col == 2 || col == 8 || col == 14) {
          border(worksheet, column, ["bottom", "right"], "medium");
        } else {
          border(worksheet, column, ["bottom"], "medium");
        }
      } else if (row === 37 && col <= 8) {
        if (col == 2 || col == 8) {
          border(worksheet, column, ["top", "right"], "medium");
        } else {
          border(worksheet, column, ["top"], "medium");
        }
      } else {
        if (col == 2 || col == 8 || col == 14) {
          border(worksheet, column, ["right"], "medium");
        } else {
          border(worksheet, column);
        }
      }
    }
  }
};
