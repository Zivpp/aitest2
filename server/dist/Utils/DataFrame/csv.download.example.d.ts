import * as ExcelJS from "exceljs";
export declare class CsvDownloadExample {
    mobileCsvExample(sheetName: string): Promise<ExcelJS.Buffer>;
    memberCardIdCsvExample(sheetName: string): Promise<ExcelJS.Buffer>;
    holidayCsvExample(): Promise<ExcelJS.Buffer>;
    addNotifyMemberExample(): Promise<ExcelJS.Buffer>;
    rewardSendExcelExample(): Promise<ExcelJS.Buffer>;
    pointMobileExcelExample(): Promise<ExcelJS.Buffer>;
}
