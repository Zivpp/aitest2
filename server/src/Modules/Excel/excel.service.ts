import { Injectable } from "@nestjs/common";
import { QueryTypes } from "sequelize";
import sequelize from "src/Global/Database/db";
import { IFaqsUserLog, IHisUserQAInsert } from "src/Global/Database/Interface/db.interface";
import Faq from "src/Global/Database/models/faqs.model";
import FqasUserLog from "src/Global/Database/models/faqs.user.log";
import ORM_HisUserQA from "src/Global/Database/models/his.user.qa";
import { IRelevantContext } from "../Line/line.interface";


@Injectable()
export class ExcelService {
    constructor(
    ) { }

    async searchRDBRatio(keywords: string[], ratioThreshold: number) {
        try {
            console.log('keywords >>>', keywords)
            // 1) 轉成 Postgres ARRAY 格式
            const pgKeywords = `{${keywords.map(k => `"${k}"`).join(",")}}`;

            const sql = `
            WITH faq_match AS (
              SELECT
                id,
                answer,
                keywords,
                (
                  SELECT COUNT(*)
                  FROM unnest(string_to_array(keywords, ',')) AS k
                  WHERE EXISTS (
                    SELECT 1
                    FROM unnest(:keywords::text[]) AS q
                    WHERE k LIKE '%' || trim(q) || '%'
                  )
                ) AS match_count,
                array_length(string_to_array(keywords, ','), 1) AS total_count
              FROM faqs
            )
            SELECT
              *,
              (match_count::float / total_count) AS match_ratio
            FROM faq_match
            WHERE (match_count::float / total_count) >= :ratio
            ORDER BY match_ratio DESC;
            `;

            const result = await sequelize.query(sql, {
                replacements: {
                    keywords: pgKeywords,   // 注意！是字串 "{...}"
                    ratio: ratioThreshold,
                },
                type: QueryTypes.SELECT,
            });

            return result;

        } catch (err) {
            console.error('❌ SQL 錯誤:', err);
            return err;
        }
    }


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
     * 根據使用者 ID，抓取最近 3 則相關訊息
     * @param userId 
     * @returns 
     */
    async getRelevantContext(userId: string): Promise<IRelevantContext[]> {
        try {
            await sequelize.authenticate();
            console.log('✅ 連線成功！');

            await sequelize.sync({ alter: true }); // 同步資料表（自動建立或更新
            console.log('✅ Table 已同步');

            const sql = `
                SELECT
                    id,
                    user_id,
                    session_id,
                    inferred_question,
                    answer,
                    created_at
                FROM his_user_qa
                WHERE user_id = :userId
                AND intend_type in ('PERSONAL_INFO_QUERY', 'ACTION_REQUEST')
                AND is_valid = 1
                ORDER BY created_at DESC
                LIMIT 3;
            `;

            const result = await sequelize.query<IRelevantContext>(sql, {
                replacements: { userId },
                type: QueryTypes.SELECT,
            });

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
    async insertOneFqasUserLog(dataObj: IFaqsUserLog) {
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

    async insertOneHisUserQA(dataObj: IHisUserQAInsert) {
        try {
            await sequelize.authenticate();
            console.log('✅ 連線成功！');

            await sequelize.sync({ alter: true }); // 同步資料表（自動建立或更新
            console.log('✅ Table 已同步');

            const result = await ORM_HisUserQA.create({ ...dataObj });

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