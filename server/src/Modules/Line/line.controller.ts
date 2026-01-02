// line.controller.ts
import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { LineService } from './line.service';
import { MilvusService } from '../Milvus/milvus.service';
import { GoogleGenerativeAIService } from '../GoogleGenerativeAI/google.generative.ai.service';
import { ExcelService } from '../Excel/excel.service';
import { RedisService } from 'src/Infrastructure/Redis/redis.service';
import { IMultifunctionalQAObj, LineUserProfile, LineWebhookEvent } from './line.interface';
import { IFaqsUserLog } from 'src/Global/Database/Interface/db.interface';
import { v4 as uuidv4 } from 'uuid';
import { INTENT_CLASSIFIER } from './line.enum';

@Controller('line')
export class LineController {
    constructor(
        private readonly lineService: LineService,
        private readonly excelService: ExcelService,
        private readonly milvusService: MilvusService,
        private readonly redisService: RedisService,
        private readonly googleGenerativeAI: GoogleGenerativeAIService
    ) { }

    @Post('webhook_old_2')
    async handleWebhookV2(@Req() req, @Res() res, @Body() body: any) {
        const event: LineWebhookEvent = body.events?.[0];
        if (!event) return { status: 'no event' };

        const userText = event.message?.text; // 使用者文字
        const replyToken = event.replyToken; // 此次詢問的回應 tokne ; 一次性
        const userId = event.source?.userId; // 使用者資訊

        const userProfile: LineUserProfile = await this.lineService.getUserProfile(userId);
        // console.log('userProfile >>>>', userProfile)

        // step 1. LLM 根據詢問意圖與補強語句、語句分類與關鍵字抓取
        const intentRes = await this.googleGenerativeAI.getUserTextInferred(userText);
        console.log('intentRes >>>', intentRes)
        // step 2. Vector search, get top 3
        const resultVectorTop3Objs = await this.milvusService.searchVectorsTop3(intentRes?.inferred_question, 'db_20251201', ['p1'])
        console.log('resultVectorTop3Objs >>>', resultVectorTop3Objs)
        // step 3. RDB search with keywords, get top 3
        const resultRDBTop3Objs = await this.excelService.searchRDBRatio(intentRes?.keywords, 0.5)
        console.log('resultRDBTop3Objs >>>', resultRDBTop3Objs)

        // step 4. 整合答案給 llm 推論
        const answerResult = await this.googleGenerativeAI.IntegrationOfInferences(intentRes?.inferred_question, resultVectorTop3Objs, resultRDBTop3Objs)
        console.log('answerResult >>>', answerResult)

        // save FAQ log.
        const logObj = <IFaqsUserLog>{}
        logObj.id = uuidv4();
        logObj.user_id = userId;
        logObj.user_info_str = JSON.stringify(userProfile, null, 2);
        logObj.original_question = userText;
        logObj.inferred_question = intentRes?.inferred_question;
        logObj.inferred_keywords = intentRes?.keywords.toString();
        logObj.vector_id_str = resultVectorTop3Objs?.map((item) => item.id).join(',');
        logObj.rdb_id_str = resultRDBTop3Objs?.map((item) => item.id).join(',');
        logObj.answer = answerResult?.final_reply;
        logObj.is_hit = 99; // 99 = unknown
        await this.excelService.insertOneFqasUserLog(logObj);

        // step 5. 回覆使用者
        await this.lineService.replyMessageText(replyToken, answerResult?.final_reply);

        return res.send({ statusbar: 'OK' });

    };


    @Post('webhook')
    async demo(@Req() req, @Res() res, @Body() body: any) {

        // User line info get.
        const event: LineWebhookEvent = body.events?.[0];
        if (!event) return { status: 'no event' };
        const userText = event.message?.text; // 使用者文字
        const replyToken = event.replyToken; // 此次詢問的回應 tokne ; 一次性
        const userId = event.source?.userId; // 使用者資訊
        const userProfile: LineUserProfile = await this.lineService.getUserProfile(userId);

        // init
        const mfQAObj = this.createInitialMfQAObj(replyToken, userText, userProfile);
        mfQAObj.originalQuestion = userText;
        mfQAObj.userInfo = userProfile;
        mfQAObj.ruudId = replyToken;
        mfQAObj.sessionId = uuidv4();

        // get Intent
        console.info(`[${mfQAObj.sessionId}][${userProfile?.displayName}] 的詢問內容：${userText}`);
        const _Intent = await this.googleGenerativeAI.analyzeUserIntent(userText);
        console.log(`[${mfQAObj.sessionId}][${userProfile?.displayName}] 分析出意圖為 : ${_Intent}`);
        mfQAObj.intent = _Intent;

        switch (_Intent) {
            case INTENT_CLASSIFIER.FAQ:
                await this.lineService.faqProcess(mfQAObj);
                break;
            case INTENT_CLASSIFIER.PERSONAL_INFO_QUERY:
                mfQAObj.finalReply = '「個人資訊查詢服務」尚未開放，後續將提供更完整的個人化查詢功能，敬請期待。';
                break;
            case INTENT_CLASSIFIER.ACTION_REQUEST:
                mfQAObj.finalReply = '「智能操作協助服務」尚未開放，相關功能正在規劃中，感謝您的理解。';
                break;
            case INTENT_CLASSIFIER.COMPLAINT:
                mfQAObj.finalReply = '很抱歉讓您有不好的體驗，我們非常重視您的回饋與需求。目前此管道尚未提供即時處理服務，相關意見將協助轉交，感謝您的提醒。';
                break;
            case INTENT_CLASSIFIER.EMERGENCY_INCIDENT:
                mfQAObj.finalReply = '我們已收到您的緊急回報，將立即協助通知相關人員。若涉及人身安全，請優先聯繫當地緊急單位！';
                break;
            case INTENT_CLASSIFIER.UNKNOWN:
                mfQAObj.finalReply = '抱歉，目前無法判斷您的需求，請您提供更多說明，或以其他方式描述您的問題。';
                break;
        }

        // 回覆使用者
        // todo 如果無法回答則包裝起來s
        const _replyText = this.packageReplyText(mfQAObj);
        await this.lineService.replyMessageText(replyToken, _replyText);
        return res.send({ status: 'ok' });
    };

    private packageReplyText(mfQAObj: IMultifunctionalQAObj) {
        let intentMsg = '';
        switch (mfQAObj.intent) {
            case INTENT_CLASSIFIER.FAQ:
                intentMsg = '客服諮詢';
                break;
            case INTENT_CLASSIFIER.PERSONAL_INFO_QUERY:
                intentMsg = '個人資料查詢';
                break;
            case INTENT_CLASSIFIER.ACTION_REQUEST:
                intentMsg = '動作請求';
                break;
            case INTENT_CLASSIFIER.COMPLAINT:
                intentMsg = '投訴';
                break;
            case INTENT_CLASSIFIER.EMERGENCY_INCIDENT:
                intentMsg = '緊急事件';
                break;
            case INTENT_CLASSIFIER.UNKNOWN:
                intentMsg = '無法辨識';
                break;
        }
        return `${mfQAObj?.finalReply}

意圖類型 : ${intentMsg}
${mfQAObj.intent === INTENT_CLASSIFIER.FAQ ? `補強詢問句 : ${mfQAObj?.inferredQuestion}` : ''}
${mfQAObj.intent === INTENT_CLASSIFIER.FAQ ? `關鍵字 : ${mfQAObj?.keywords.join(',')}` : ''}`;
    }

    private createInitialMfQAObj(
        replyToken: string,
        userText: string,
        userProfile: any
    ): IMultifunctionalQAObj {
        return {
            isEmergencyLevel: false,
            isRelated: false,
            isNeedHumanAgent: false,
            isValid: false,
            isTaskCompleted: false,

            ruudId: replyToken, // LINE reply token（一次性）
            sessionId: uuidv4(),

            previousMessages: [],
            userInfo: userProfile,

            originalQuestion: userText,
            inferredQuestion: '',
            keywords: [],
            intent: '',

            vectorSource: [],
            rdbSource: [],
            finalReply: '',
        };
    }

}
