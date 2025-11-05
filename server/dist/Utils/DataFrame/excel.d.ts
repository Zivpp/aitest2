export declare class ConvertExcel {
    orderListToExcel(rows: any, fileName: string, folderPath: string, filesPath: string): Promise<void>;
    memberListToExcel(rows: any, fileName: string, folderPath: string, filesPath: string): Promise<void>;
    couponDetailListToExcel(rows: any, fileName: string, couponTypeStr: string, folderPath: string, filesPath: string): Promise<void>;
    rewardDetailToExcel(rows: any, fileName: string, folderPath: string, filesPath: string): Promise<void>;
    motSendLogToExcel(rows: any, fileName: string, folderPath: string, filesPath: string): Promise<void>;
}
