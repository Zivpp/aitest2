import { Injectable } from "@nestjs/common";
import sequelize from "src/Global/Database/db";
import { IFqasUserLog } from "src/Global/Database/Interface/db.interface";
import Faq from "src/Global/Database/models/faqs.model";
import FqasUserLog from "src/Global/Database/models/faqs.user.log";


@Injectable()
export class ExcelService {
    constructor(
    ) { }


    /**
     * 將 Excel 資料批量插入到 FAQ 表
     * // todo 移走
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

    /**
     * 將 Excel 資料批量插入到 FAQS_USER_LOG 表
     * // todo 移走
     * @returns 
     */
    async insertOneFqasUserLog(dataObj: IFqasUserLog) {
        try {
            await sequelize.authenticate();
            console.log('✅ 連線成功！');

            await sequelize.sync({ alter: true }); // 同步資料表（自動建立或更新
            console.log('✅ Table 已同步');

            const result = await FqasUserLog.create({ ...dataObj });

            return result;
        } catch (err) {
            console.error('❌ 錯誤:', err);
            return err;
        }
    }

    /**
     * find all 
     * // todo 移走
     * @returns 
     */
    async getFaqAll() {
        try {
            await sequelize.authenticate();
            console.log('✅ 連線成功！');

            await sequelize.sync({ alter: true }); // 同步資料表（自動建立或更新）
            console.log('✅ Table 已同步');


            const result = await Faq.findAll();
            return result;
        } catch (err) {
            console.error('❌ 錯誤:', err);
            return err;
        }
    }

}