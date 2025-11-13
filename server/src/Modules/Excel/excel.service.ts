import { Injectable } from "@nestjs/common";
import sequelize from "src/Global/Database/db";
import Faq from "src/Global/Database/models/faq.model";


@Injectable()
export class ExcelService {
    constructor(
    ) { }


    /**
     * 將 Excel 資料批量插入到 FAQ 表
     * @param dataObjs
     * @returns 
     */
    async insertToFaq(dataObjs: any[]) {
        try {
            await sequelize.authenticate();
            console.log('✅ 連線成功！');

            await sequelize.sync({ alter: true }); // 同步資料表（自動建立或更新）
            console.log('✅ Table 已同步');

            const bulkInsertAry = await Promise.all(
                dataObjs.map(async (item) => ({
                    answer: item?.answer ?? "",
                    keywords: item?.keywords ?? "",
                    source: 'google_AI'
                }))
            );

            const result = await Faq.bulkCreate(bulkInsertAry);
            return result;
        } catch (err) {
            console.error('❌ 錯誤:', err);
            return err;
        }
    }

}