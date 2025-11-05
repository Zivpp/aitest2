"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvDownloadExample = void 0;
const ExcelJS = require("exceljs");
class CsvDownloadExample {
    async mobileCsvExample(sheetName) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);
        const rows = [
            [
                "*手機國碼",
                "*手機號碼",
                '請輸入會員手機國碼及手機號碼(不含符號)，如手機號碼開頭有"0"請去除。',
            ],
            ["886", "912123123"],
        ];
        worksheet.addRows(rows);
        const buffer = await workbook.csv.writeBuffer();
        return buffer;
    }
    async memberCardIdCsvExample(sheetName) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);
        const rows = [["會員卡號"], ["i220123123"]];
        worksheet.addRows(rows);
        const buffer = await workbook.csv.writeBuffer();
        return buffer;
    }
    async holidayCsvExample() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("假日設定");
        const rows = [
            [
                "*西元日期",
                "星期",
                "備註",
                '可設定例假日及特殊節慶日/ "西元日期"為 YYYYMMDD 8碼 /   "星期"限一個字、"備註" 限6個字，星期&備註→ 如超過字數，匯入後會截斷。',
            ],
            ["20240101", "一", "元旦"],
        ];
        worksheet.addRows(rows);
        const buffer = await workbook.csv.writeBuffer();
        return buffer;
    }
    async addNotifyMemberExample() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("新增通知人員名單");
        const rows = [
            [
                "*人員暱稱",
                "*手機國碼",
                "*手機號碼",
                "*Email",
                "*通知分類",
                "請先建立通知分類，並輸入對應分類名稱，如有多組分類-請以半形分號間隔。",
            ],
        ];
        worksheet.addRows(rows);
        const buffer = await workbook.csv.writeBuffer();
        return buffer;
    }
    async rewardSendExcelExample() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("集點調整");
        const rows = [
            [
                "*手機國碼",
                "*手機號碼",
                "*調整集點",
                '請輸入會員手機國碼及手機號碼(不含符號)，如手機號碼開頭有"0"請去除。',
            ],
        ];
        worksheet.addRows(rows);
        const buffer = await workbook.csv.writeBuffer();
        return buffer;
    }
    async pointMobileExcelExample() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("會員積點調整");
        const rows = [
            [
                "*手機國碼",
                "*手機號碼",
                "*調整積點",
                '欄位皆必填，"調整積點"請輸入正整數',
            ],
            ["886", "912123123", "10"],
        ];
        worksheet.addRows(rows);
        const buffer = await workbook.csv.writeBuffer();
        return buffer;
    }
}
exports.CsvDownloadExample = CsvDownloadExample;
//# sourceMappingURL=csv.download.example.js.map