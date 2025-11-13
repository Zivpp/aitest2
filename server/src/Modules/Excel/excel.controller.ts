import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from 'xlsx';
import { ExcelService } from "./excel.service";
import { GoogleGenerativeAIService } from "../GoogleGenerativeAI/google.generative.ai.service";

@Controller('excel')
export class ExcelController {
    constructor(
        private readonly excelService: ExcelService,
        private readonly googleGenerativeAI: GoogleGenerativeAIService,
    ) { }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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
            // const keys = Object.keys(jsonData[0]);

            interface InsertData {
                index: number;
                on: string;
                answer: string;
                keywords: string;
            }
            const insertData: InsertData[] = [];
            for (const [index, row] of jsonData.entries()) {
                const keywords = (await this.googleGenerativeAI.getkeyWord(row['ans'])).replace(/\n/g, '').trim();
                console.log(index, " : ", keywords)
                insertData.push({
                    index,
                    on: row['on'],
                    answer: row['ans'],
                    keywords
                });
                await this.sleep(4200); // 每次間隔約 4 秒
            }

            console.info(insertData)

            const result = await this.excelService.insertToFaq(insertData);

            return result;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

}