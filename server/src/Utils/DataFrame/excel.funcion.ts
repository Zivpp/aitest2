import * as ExcelJS from "exceljs";

/**
 * 無條件捨去取到小數點第？位
 * @param value 數字
 * @param decimalPlaces 取到小數點第幾位
 * @returns
 */
export const floorToDecimal = (value: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor(value * factor) / factor;
};

/**
 * 將值寫入欄位
 * @param worksheet
 * @param column 欄列
 * @param value 值
 * @returns
 */
export const value = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  value: string | number,
) => {
  const cell = worksheet.getCell(column);
  return (cell.value = value);
};

/**
 * 取得欄位值
 * @param worksheet
 * @param column 欄列
 * @returns
 */
export const getValue = (worksheet: ExcelJS.Worksheet, column: string) => {
  const cell = worksheet.getCell(column);
  return cell.value;
};

/**
 * 調整單一欄位長度
 * @param worksheet
 * @param column 欄
 * @param width 長度
 * @returns
 */
export const width = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  width: number,
) => {
  const cell = worksheet.getColumn(column);
  return (cell.width = width);
};

/**
 * 字體加入粗體
 * @param worksheet
 * @param column 欄列
 * @returns
 */
export const font_bold = (worksheet: ExcelJS.Worksheet, column: string) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    bold: true,
    name: "微軟正黑體",
  });
};

/**
 * 將字體加入顏色
 * @param worksheet
 * @param column 欄列
 * @param color 顏色
 * @returns
 */
export const font_color = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  color: string,
) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    color: { argb: color },
    name: "微軟正黑體",
  });
};

/**
 * 加壓入粗體＆顏色
 * @param worksheet
 * @param column 欄列
 * @param color 顏色
 * @returns
 */
export const font_bold_color = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  color: string,
) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    bold: true,
    color: { argb: color },
    name: "微軟正黑體",
  });
};

/**
 * 加入字大小＆顏色
 * @param worksheet
 * @param column 欄列
 * @param size 大小
 * @param color 顏色
 * @returns
 */
export const font_size_color = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  size: number,
  color: string,
) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    size,
    color: { argb: color },
    name: "微軟正黑體",
  });
};

/**
 * 加入粗體＆字大小
 * @param worksheet
 * @param column 欄列
 * @param size 大小
 * @returns
 */
export const font_bold_size = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  size: number,
) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    bold: true,
    size,
    name: "微軟正黑體",
  });
};

/**
 * 加入粗體＆字大小＆顏色
 * @param worksheet
 * @param column 欄列
 * @param size 大小
 * @param color 顏色
 * @returns
 */
export const font_bold_size_color = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  size: number,
  color: string,
) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    bold: true,
    size,
    color: { argb: color },
    name: "微軟正黑體",
  });
};

/**
 * 加入背景色
 * @param worksheet
 * @param column 欄列
 * @param color 顏色
 * @returns
 */
export const bg_color = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  color: string,
) => {
  const cell = worksheet.getCell(column);
  return (cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: color },
  });
};

/**
 * 將字體加入大小
 * @param worksheet
 * @param column 欄列
 * @param size 大小
 * @returns
 */
export const font_size = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  size: number,
) => {
  const cell = worksheet.getCell(column);
  return (cell.font = {
    size,
    name: "微軟正黑體",
  });
};

/**
 * 欄位位置
 * @param worksheet
 * @param column 欄列
 * @param position 靠哪邊 "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed"
 * @returns
 */
export const alignment_horizontal = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  position: ExcelJS.Alignment["horizontal"],
) => {
  const cell = worksheet.getCell(column);
  return (cell.alignment = { horizontal: position, vertical: "middle" });
};

/**
 * 調整數字格式
 * @param worksheet
 * @param column 欄列
 * @param type 格式
 * @returns
 */
export const numFmt = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  type: string,
) => {
  const cell = worksheet.getCell(column);
  return (cell.numFmt = type);
};

/**
 * 合併儲存格
 * @param worksheet
 * @param startEndCell 開始跟結束的儲存格
 * @returns
 */
export const mergeCells = (
  worksheet: ExcelJS.Worksheet,
  startEndCell: string,
) => {
  return worksheet.mergeCells(startEndCell);
};

/**
 * 欄位加入框線(預設細線)
 * @param worksheet
 * @param column 欄列
 * @param changeStypePosition 需要更改樣式的地方
 * @param style 改成什麼樣式
 * @returns
 */
export const border = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  changeStypePosition?: string[],
  style?: string,
) => {
  const cell = worksheet.getCell(column);
  let border: any = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  if (changeStypePosition?.length) {
    // 根據 changeStypePosition 更新框線樣式
    changeStypePosition.forEach((position) => {
      if (border[position]) {
        border[position].style = style;
      }
    });
  }
  return (cell.border = border);
};

/**
 * 自訂框線
 * @param worksheet
 * @param column 欄列
 * @param border 框線樣式
 * @returns
 */
export const border_cust = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  border: any,
) => {
  const cell = worksheet.getCell(column);
  return (cell.border = border);
};

/**
 * 將文字分行
 * @param worksheet
 * @param column 欄列
 * @param value 值
 * @returns
 */
export const richText = (
  worksheet: ExcelJS.Worksheet,
  column: string,
  value: string[],
) => {
  const cell = worksheet.getCell(column);
  const richText = value?.map((x, i) => {
    return {
      ["text"]: `${x}${i !== value.length - 1 ? "\n" : ""}`,
    };
  });
  return (cell.value = { richText });
};
