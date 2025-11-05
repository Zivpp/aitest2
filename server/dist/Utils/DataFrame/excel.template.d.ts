import * as ExcelJS from "exceljs";
export declare class Excel {
    sheetHeader: any;
    sheetName: any;
    sheetFill: any;
    sheetData: any;
    savePath: string;
    workbook: ExcelJS.Workbook;
    constructor(sheetData: any, savePath: any, sheetHeader: any, sheetName: any, sheetFill: any);
    initSheet(): Promise<void>;
    writeFile(): Promise<void>;
    generateSheet(): Promise<void>;
    execute(): Promise<any>;
}
