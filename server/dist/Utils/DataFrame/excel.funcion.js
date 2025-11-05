"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.richText = exports.border_cust = exports.border = exports.mergeCells = exports.numFmt = exports.alignment_horizontal = exports.font_size = exports.bg_color = exports.font_bold_size_color = exports.font_bold_size = exports.font_size_color = exports.font_bold_color = exports.font_color = exports.font_bold = exports.width = exports.getValue = exports.value = exports.floorToDecimal = void 0;
const floorToDecimal = (value, decimalPlaces) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(value * factor) / factor;
};
exports.floorToDecimal = floorToDecimal;
const value = (worksheet, column, value) => {
    const cell = worksheet.getCell(column);
    return (cell.value = value);
};
exports.value = value;
const getValue = (worksheet, column) => {
    const cell = worksheet.getCell(column);
    return cell.value;
};
exports.getValue = getValue;
const width = (worksheet, column, width) => {
    const cell = worksheet.getColumn(column);
    return (cell.width = width);
};
exports.width = width;
const font_bold = (worksheet, column) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        bold: true,
        name: "微軟正黑體",
    });
};
exports.font_bold = font_bold;
const font_color = (worksheet, column, color) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        color: { argb: color },
        name: "微軟正黑體",
    });
};
exports.font_color = font_color;
const font_bold_color = (worksheet, column, color) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        bold: true,
        color: { argb: color },
        name: "微軟正黑體",
    });
};
exports.font_bold_color = font_bold_color;
const font_size_color = (worksheet, column, size, color) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        size,
        color: { argb: color },
        name: "微軟正黑體",
    });
};
exports.font_size_color = font_size_color;
const font_bold_size = (worksheet, column, size) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        bold: true,
        size,
        name: "微軟正黑體",
    });
};
exports.font_bold_size = font_bold_size;
const font_bold_size_color = (worksheet, column, size, color) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        bold: true,
        size,
        color: { argb: color },
        name: "微軟正黑體",
    });
};
exports.font_bold_size_color = font_bold_size_color;
const bg_color = (worksheet, column, color) => {
    const cell = worksheet.getCell(column);
    return (cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color },
    });
};
exports.bg_color = bg_color;
const font_size = (worksheet, column, size) => {
    const cell = worksheet.getCell(column);
    return (cell.font = {
        size,
        name: "微軟正黑體",
    });
};
exports.font_size = font_size;
const alignment_horizontal = (worksheet, column, position) => {
    const cell = worksheet.getCell(column);
    return (cell.alignment = { horizontal: position, vertical: "middle" });
};
exports.alignment_horizontal = alignment_horizontal;
const numFmt = (worksheet, column, type) => {
    const cell = worksheet.getCell(column);
    return (cell.numFmt = type);
};
exports.numFmt = numFmt;
const mergeCells = (worksheet, startEndCell) => {
    return worksheet.mergeCells(startEndCell);
};
exports.mergeCells = mergeCells;
const border = (worksheet, column, changeStypePosition, style) => {
    const cell = worksheet.getCell(column);
    let border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
    };
    if (changeStypePosition?.length) {
        changeStypePosition.forEach((position) => {
            if (border[position]) {
                border[position].style = style;
            }
        });
    }
    return (cell.border = border);
};
exports.border = border;
const border_cust = (worksheet, column, border) => {
    const cell = worksheet.getCell(column);
    return (cell.border = border);
};
exports.border_cust = border_cust;
const richText = (worksheet, column, value) => {
    const cell = worksheet.getCell(column);
    const richText = value?.map((x, i) => {
        return {
            ["text"]: `${x}${i !== value.length - 1 ? "\n" : ""}`,
        };
    });
    return (cell.value = { richText });
};
exports.richText = richText;
//# sourceMappingURL=excel.funcion.js.map