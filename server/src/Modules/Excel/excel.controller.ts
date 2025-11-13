import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from 'xlsx';

@Controller('excel')
export class ExcelController {
    constructor(
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        try {
            // 1. 讀取 Excel Buffer
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });

            // 2. 取得第一個工作表名稱
            const sheetName = workbook?.SheetNames[0];

            // 3. 轉為 JSON
            const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(workbook?.Sheets[sheetName]);
            // 先取欄位 key
            const keys = Object.keys(jsonData[0]);

            // console.log('keys >>>', keys);

            // only get '回答-IEAT APP'
            interface InsertData {
                index: number;
                on: string;
                ans: string;
            }
            const insertData: InsertData[] = [];
            jsonData.forEach((row, index) => {
                // console.log('row >>>', row)
                insertData.push({
                    index,
                    on: row['on'],
                    ans: row['ans']
                })
            })



            return jsonData;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

}