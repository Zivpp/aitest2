"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Excel = void 0;
const ExcelJS = require("exceljs");
const BorderStyle = {
    top: {
        style: "thin",
    },
    left: {
        style: "thin",
    },
    bottom: {
        style: "thin",
    },
    right: {
        style: "thin",
    },
    diagonal: {
        up: false,
        down: false,
        style: "thick",
        color: { argb: "FFFF0000" },
    },
};
class Excel {
    sheetHeader;
    sheetName;
    sheetFill;
    sheetData;
    savePath;
    workbook;
    constructor(sheetData, savePath, sheetHeader, sheetName, sheetFill) {
        this.sheetData = sheetData;
        this.savePath = savePath;
        this.sheetHeader = sheetHeader;
        this.sheetName = sheetName;
        this.sheetFill = sheetFill;
    }
    async initSheet() {
        this.workbook = new ExcelJS.Workbook();
    }
    async writeFile() {
        await this.workbook.xlsx.writeFile(this.savePath);
    }
    async generateSheet() {
        const sheet = this.workbook.addWorksheet("Vendor Part List", {
            views: [{ state: "frozen", ySplit: 1 }],
        });
        const header = [];
        this.sheetHeader.forEach((item, index) => {
            header.push({
                header: item,
                key: this.sheetName[index],
                style: { border: BorderStyle },
            });
        });
        sheet.columns = header;
        this.sheetData.forEach((item) => {
            sheet.addRow(item, "n");
        });
        const ascii_start = 65;
        const rowCount = sheet.rowCount;
        const columnCount = sheet.columnCount;
        const columnStart = String.fromCharCode(ascii_start);
        const columnEnd = String.fromCharCode(ascii_start + columnCount - 1);
        const fixColumnArr = [];
        const fillColumnArr = [];
        this.sheetName.forEach((item, index) => {
            if (this.sheetFill.indexOf(item) > -1) {
                fillColumnArr.push(index);
            }
            else {
                fixColumnArr.push(index);
            }
        });
        const vendorFixedStyle = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "d8e4bc" },
        };
        const vendorFillStyle = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "fffecc" },
        };
        const systemFillStyle = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "d9d9d9" },
        };
        const font = { name: "Arial", bold: true };
        const vendorFixedArray = [];
        const vendorFillArray = [];
        const vendorFillBody = [];
        fixColumnArr.forEach((fc) => {
            vendorFixedArray.push(String.fromCharCode(ascii_start + fc).concat("1"));
        });
        fillColumnArr.forEach((fc) => {
            vendorFillArray.push(String.fromCharCode(ascii_start + fc).concat("1"));
            for (let i = 2; i < rowCount + 1; i++) {
                vendorFillBody.push(String.fromCharCode(ascii_start + fc).concat(`${i}`));
            }
        });
        vendorFixedArray.forEach((x) => {
            if (sheet.getCell(x).value == "ID") {
                sheet.getCell(x).fill = systemFillStyle;
            }
            else if (sheet.getCell(x).value == "Update Time") {
                sheet.getCell(x).fill = systemFillStyle;
            }
            else {
                sheet.getCell(x).fill = vendorFixedStyle;
            }
            sheet.getCell(x).font = font;
            sheet.getCell(x).alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            };
        });
        vendorFillArray.forEach((x) => {
            sheet.getCell(x).fill = vendorFillStyle;
            sheet.getCell(x).font = font;
            sheet.getCell(x).alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true,
            };
        });
        vendorFillBody.forEach((x) => {
            sheet.getCell(x).protection = { locked: false };
        });
        sheet.columns.forEach(function (column) {
            column.width = 18;
        });
        sheet.autoFilter = columnStart.concat("1", ":", columnEnd, "1");
        const idCol = sheet.getColumn("id");
        idCol.hidden = true;
    }
    async execute() {
        await this.initSheet();
        await this.generateSheet();
        await this.writeFile();
        return this.savePath;
    }
}
exports.Excel = Excel;
//# sourceMappingURL=excel.template.js.map