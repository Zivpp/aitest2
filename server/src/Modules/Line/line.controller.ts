// line.controller.ts
import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { LineService } from './line.service';
import { MilvusService } from '../Milvus/milvus.service';
import { GoogleGenerativeAIService } from '../GoogleGenerativeAI/google.generative.ai.service';
import { ExcelService } from '../Excel/excel.service';
import { RedisService } from 'src/Infrastructure/Redis/redis.service';
import { HOT_REARCH_PROMPT, HOT_RESPONSE_PROMPT } from './line.config';
import { IMultifunctionalQAObj, LineUserProfile, LineWebhookEvent } from './line.interface';
import { IFaqsUserLog } from 'src/Global/Database/Interface/db.interface';
import { v4 as uuidv4 } from 'uuid';
import { INTENT_CLASSIFIER } from './line.enum';
import { createHisUserQAPayload } from 'src/Global/Database/function/db.obj.functions';

@Controller('line')
export class LineController {
    constructor(
        private readonly lineService: LineService,
        private readonly excelService: ExcelService,
        private readonly milvusService: MilvusService,
        private readonly redisService: RedisService,
        private readonly googleGenerativeAI: GoogleGenerativeAIService
    ) { }

    @Post('webhook_old_1')
    async handleWebhook(@Req() req, @Res() res, @Body() body: any) {
        const event = body.events?.[0];
        if (!event) return { status: 'no event' };

        const userText = event.message?.text;
        const replyToken = event.replyToken;
        const userId = event.source?.userId;

        const userProfile = await this.lineService.getUserProfile(userId)

        // call llm get keywords > search vector > build response
        const searchPrompt = HOT_REARCH_PROMPT();
        const searchKeyWords = await this.googleGenerativeAI.talk(userText, searchPrompt);
        const vectorResult = await this.milvusService.searchVectors('db_20251114', ['20251114_1'], searchKeyWords);
        const responsePromt = HOT_RESPONSE_PROMPT({
            vectorResult: vectorResult,
            searchKeyWords: searchKeyWords
        })
        const fqaRes = await this.googleGenerativeAI.talk("", responsePromt);


        // // console.log('fqaRes >>>', fqaRes);
        // //todo 存起來 userInfo 提問 keywords 解答
        // const logObj = <IFqasUserLog>{}
        // logObj.event_type = event?.type;
        // logObj.event_message_text = event?.message?.text;
        // logObj.event_json_str = JSON.stringify(event, null, 2);
        // logObj.user_id = userId;
        // logObj.user_displayname = userProfile?.displayName;
        // logObj.user_picture_url = userProfile?.pictureUrl;
        // logObj.user_json_str = JSON.stringify(userProfile, null, 2);
        // logObj.gpt_user_q_keywords_prompt = searchPrompt;
        // logObj.gpt_user_q_keywords_str = searchKeyWords;
        // logObj.gpt_vector_search_result_json_str = JSON.stringify(vectorResult?.results, null, 2);
        // logObj.gpt_answer_prompt = responsePromt;
        // logObj.gpt_answer = fqaRes;
        // await this.excelService.insertOneFqasUserLog(logObj);

        // 回覆給 LINE
        if (!searchKeyWords?.includes('生日')) await this.lineService.replyMessageText(replyToken, fqaRes);

        // if searchKeyWords have "生日"，then reply "是否幫您查詢是否有資格獲取生日相關卷禮？"
        if (searchKeyWords?.includes('生日')) {
            // 怕訊息轟炸 先查看看有沒有短期內有查詢過生日資格
            const key = `birthday_check_${userId}`;
            const isBirthdayCheck = await this.redisService.get(key);
            if (isBirthdayCheck) {
                await this.lineService.replyMessageText(replyToken, fqaRes);
                return;
            }
            await this.redisService.set(key, true, 60 * 5); // 5 分鐘內不會再詢問
            await this.lineService.replyMessages(replyToken, [
                {
                    type: 'text',
                    text: fqaRes
                },
                {
                    "type": "flex",
                    "altText": "birthday gift query",
                    "contents": {
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "md",
                            "paddingAll": "20px",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "🎉birthday gift query🎊",
                                    "weight": "bold",
                                    "size": "lg",
                                    "align": "center",
                                    "color": "#333333"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "uri",
                                        "label": "SEARCH",
                                        "uri": "https://www.ieatogether.com.tw/foreignBooking"
                                    },
                                    "style": "primary",
                                    "color": "#1DB446"
                                }
                            ]
                        }
                    }
                }
            ]);
        }

        return res.send({ status: 'ok' });
    }

    @Post('webhook_old2')
    async handleWebhookV2(@Req() req, @Res() res, @Body() body: any) {
        const event: LineWebhookEvent = body.events?.[0];
        if (!event) return { status: 'no event' };

        const userText = event.message?.text; // 使用者文字
        const replyToken = event.replyToken; // 此次詢問的回應 tokne ; 一次性
        const userId = event.source?.userId; // 使用者資訊

        const userProfile: LineUserProfile = await this.lineService.getUserProfile(userId);
        // console.log('userProfile >>>>', userProfile)

        // step 1. LLM 根據詢問意圖與補強語句、語句分類與關鍵字抓取
        const intentRes = await this.googleGenerativeAI.getUserQIntentObj(userText);
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
    async handleWebhookV3(@Req() req, @Res() res, @Body() body: any) {

        // todo is hit process.

        // line info get.
        const event: LineWebhookEvent = body.events?.[0];
        if (!event) return { status: 'no event' };

        const userText = event.message?.text; // 使用者文字
        const replyToken = event.replyToken; // 此次詢問的回應 tokne ; 一次性
        const userId = event.source?.userId; // 使用者資訊

        const userProfile: LineUserProfile = await this.lineService.getUserProfile(userId);
        // console.log('userProfile >>>>', userProfile)

        // init config obj.
        const mfQAObj = <IMultifunctionalQAObj>{};
        mfQAObj.isEmergencyLevel = false;
        mfQAObj.isRelated = false;
        mfQAObj.isNeedHumanAgent = false;
        mfQAObj.isValid = false;
        mfQAObj.ruudId = replyToken; // line reply token 每一次都是唯一值
        mfQAObj.sessionId = uuidv4();
        mfQAObj.previousMessages = [];
        mfQAObj.userInfo = userProfile;
        mfQAObj.originalQuestion = userText;
        mfQAObj.inferredQuestion = '';
        mfQAObj.keywords = [];
        mfQAObj.intent = '';
        mfQAObj.vectorSource = [];
        mfQAObj.rdbSource = [];
        mfQAObj.finalReply = '';
        // console.log('mfQAObj >>>', mfQAObj)

        // 抓取關聯性前文 <先不限制時間>
        const previousMessages = await this.excelService.getRelevantContext(userId);

        // AI : 前後文補強 / 語意是否有效評估 / 詢問句補強 / keyword 抓取 / 意圖分類
        const intentClassifierRes = await this.googleGenerativeAI.analyzeUserQuery(userText, previousMessages);
        console.log('intentClassifierRes >>>', intentClassifierRes)
        mfQAObj.originalQuestion = intentClassifierRes?.original;
        mfQAObj.inferredQuestion = intentClassifierRes?.inferred_question;
        mfQAObj.keywords = intentClassifierRes?.keywords;
        mfQAObj.intent = intentClassifierRes?.intent;
        mfQAObj.isValid = intentClassifierRes?.isValid;
        mfQAObj.isRelated = intentClassifierRes?.isRelated;

        // 是否為同一組對話 ; 此對話與前文是否相關, 相關則 sessionId 相同
        if (String(mfQAObj.isRelated).toLowerCase() === 'true')
            mfQAObj.sessionId = previousMessages?.[0]?.session_id;

        // 根據語意派發相關作業流程
        const tmpStr = `服務正在建置中, 期待不久後能為您服務。`
        switch (intentClassifierRes?.intent) {
            case INTENT_CLASSIFIER.FAQ:
                break;
            case INTENT_CLASSIFIER.PERSONAL_INFO_QUERY:
                mfQAObj.finalReply = tmpStr;
                break;
            case INTENT_CLASSIFIER.ACTION_REQUEST:
                mfQAObj.finalReply = tmpStr;
                break;
            case INTENT_CLASSIFIER.COMPLAINT:
                mfQAObj.finalReply = tmpStr;
                break;
            case INTENT_CLASSIFIER.CHITCHAT:
                mfQAObj.finalReply = tmpStr;
                break;
            case INTENT_CLASSIFIER.UNKNOWN:
                // todo 
                if (String(mfQAObj.isValid).toLowerCase() === 'true') {
                    mfQAObj.isNeedHumanAgent = true; // 需要人工協助
                    mfQAObj.finalReply = `很抱歉，目前系統無法提供此問題的回覆。我們將為您轉接真人客服，由專人協助處理。`
                } else {
                    mfQAObj.finalReply = `我未能解析您的訊息內容。請重新提問或提供更多資訊。`
                }
                break;
        }

        // *QA Log Save.
        const insertObj = await createHisUserQAPayload({
            user_id: userId,
            user_info_str: JSON.stringify(userProfile),
            trace_id: mfQAObj.ruudId,
            session_id: mfQAObj.sessionId,
            original_question: mfQAObj.originalQuestion,
            inferred_question: mfQAObj.inferredQuestion,
            inferred_keywords: mfQAObj.keywords.join(','),
            answer: mfQAObj.finalReply,
            intend_type: mfQAObj.intent,
            match_vector_ids: mfQAObj.vectorSource?.map((item) => item.id).join(','),
            match_rdb_ids: mfQAObj.rdbSource?.map((item) => item.id).join(','),
            is_emergency: (String(mfQAObj.isEmergencyLevel).toLowerCase() === 'true' ? 1 : 0),
            is_valid: (String(mfQAObj.isValid).toLowerCase() === 'true' ? 1 : 0),
            isNeedHumanAgent: (mfQAObj.isNeedHumanAgent ? 1 : 0),
        })
        await this.excelService.insertOneHisUserQA(insertObj);
        // console.log('insertObj >>>', insertObj)

        // 回覆使用者
        // todo 如果無法回答則包裝起來s
        await this.lineService.replyMessageText(replyToken, mfQAObj.finalReply);


        return res.send({ status: 'ok' });
    }



}
