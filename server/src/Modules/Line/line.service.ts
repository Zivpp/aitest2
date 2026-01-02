// line.service.ts
import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/Infrastructure/Api/api.service';
import { IMultifunctionalQAObj } from './line.interface';
import { GoogleGenerativeAIService } from '../GoogleGenerativeAI/google.generative.ai.service';
import { MilvusService } from '../Milvus/milvus.service';
import { ExcelService } from '../Excel/excel.service';

@Injectable()
export class LineService {
    constructor(
        private readonly apiService: ApiService,
        private readonly googleGenerativeAI: GoogleGenerativeAIService,
        private readonly milvusService: MilvusService,
        private readonly excelService: ExcelService,
    ) { }

    private readonly LINE_API = 'https://api.line.me/v2/bot/message/reply';
    private readonly TOKEN = "YzslmbUYbTt8nvhIuCI0zxq+j+kxxcoH4p9wki1yOtlfw6sXC0JJbuOqs/iPBd2wQmRE/6PpyQ3PZUuFxUkd9uJeEHdsTD7N7rvNirQjJmHD4ZUVZiLFU3YaQUGYJgrFppgwY9LF4FCnDMWHfE3koAdB04t89/1O/w1cDnyilFU=";


    async faqProcess(mfQAObj: IMultifunctionalQAObj) {
        // 補足語句, 抓出關鍵字
        const inferredRes = await this.googleGenerativeAI.getUserTextInferred(mfQAObj?.originalQuestion);
        mfQAObj!.inferredQuestion = inferredRes?.inferred_question;
        mfQAObj!.keywords = inferredRes?.keywords;
        console.log(`[${mfQAObj.sessionId}][${mfQAObj?.userInfo?.displayName}] inferred question : ${inferredRes?.inferred_question}`);
        console.log(`[${mfQAObj.sessionId}][${mfQAObj?.userInfo?.displayName}] keywords : ${inferredRes?.keywords}`);
        // step 2. Vector search, get top 3
        const resultVectorTop3Objs = await this.milvusService.searchVectorsTop3(mfQAObj?.inferredQuestion, 'db_20251201', ['p1'])
        console.log(`[${mfQAObj.sessionId}][${mfQAObj?.userInfo?.displayName}] Vector search result : ${resultVectorTop3Objs
            .map((item) => `[id=${item.id}, score=${item.score.toFixed(4)}]`)
            .join(' ')}`);
        // step 3. RDB search with keywords, get top 3
        const resultRDBTop3Objs = await this.excelService.searchRDBRatio(mfQAObj?.keywords, 0.5)
        console.log(`[${mfQAObj.sessionId}][${mfQAObj?.userInfo?.displayName}] RDB search result : ${resultRDBTop3Objs
            .map((item) => `[id=${item.id}, score=${item.match_ratio.toFixed(4)}]`)
            .join(' ')}`);
        // step 4. 整合答案給 llm 推論
        const answerResult = await this.googleGenerativeAI.IntegrationOfInferences(mfQAObj?.inferredQuestion, resultVectorTop3Objs, resultRDBTop3Objs)
        console.log(`[${mfQAObj.sessionId}][${mfQAObj?.userInfo?.displayName}] Integration of inferences result : ${answerResult?.final_reply}`);

        // step 5. 回覆使用者
        mfQAObj!.finalReply = answerResult?.final_reply;

        return;
    }

    async handleMessage(text: string, ieatConetxt: string, displayName: string) {
        // // 🔹 這裡呼叫你自己的 LLM
        // // const reqText = `人格設定;變態貓咪, 會講人話, 回答要很傲嬌, 都要有喵喵喵等字樣, 這是使用者詢問的文字: ${text} ; 回答翻譯成英文回答`
        // const reqText = text;
        // const result = await this.milvusService.geminitext(reqText, ieatConetxt);
        // return result;
    }

    /**
     * 回覆多個訊息
     * @param replyToken 
     * @param messageObjs 
     */
    async replyMessages(replyToken: string, messageObjs: any[]) {
        await this.apiService.post(
            this.LINE_API,
            {
                replyToken,
                messages: messageObjs,
            },
            { Authorization: `Bearer ${this.TOKEN}` },
        );
    }

    /**
     * 回覆純文字
     * @param replyToken 
     * @param text 
     */
    async replyMessageText(replyToken: string, text: string) {
        await this.apiService.post(
            this.LINE_API,
            {
                replyToken,
                messages: [{ type: 'text', text }],
            },
            { Authorization: `Bearer ${this.TOKEN}` },
        );
    }

    /**
     * 回覆模板
     * @param replyToken 
     * @param template 
     */
    async readonlyMessageTemplate(replyToken: string, template: any) {
        await this.apiService.post(
            this.LINE_API,
            {
                replyToken,
                messages: template,
            },
            { Authorization: `Bearer ${this.TOKEN}` },
        );
    }

    /**
     * 取得使用者 profile
     * @param userId 
     * @returns 
     */
    async getUserProfile(userId: string) {
        const headersOptions = { Authorization: `Bearer ${this.TOKEN} ` };
        const path = `https://api.line.me/v2/bot/profile/${userId}`
        // console.log('path   >>>', path)
        const res = await this.apiService.get(path, headersOptions);
        return res;
    }
}
