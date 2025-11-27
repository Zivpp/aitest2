// line.controller.ts
import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { LineService } from './line.service';
import { MilvusService } from '../Milvus/milvus.service';
import { GoogleGenerativeAIService } from '../GoogleGenerativeAI/google.generative.ai.service';
import { IFqasUserLog } from 'src/Global/Database/Interface/db.interface';
import { ExcelService } from '../Excel/excel.service';
import { RedisService } from 'src/Infrastructure/Redis/redis.service';
import { HOT_REARCH_PROMPT, HOT_RESPONSE_PROMPT } from './line.config';

@Controller('line')
export class LineController {
    constructor(
        private readonly lineService: LineService,
        private readonly excelService: ExcelService,
        private readonly milvusService: MilvusService,
        private readonly redisService: RedisService,
        private readonly googleGenerativeAI: GoogleGenerativeAIService
    ) { }

    @Post('webhook')
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


        // console.log('fqaRes >>>', fqaRes);
        //todo 存起來 userInfo 提問 keywords 解答
        const logObj = <IFqasUserLog>{}
        logObj.event_type = event?.type;
        logObj.event_message_text = event?.message?.text;
        logObj.event_json_str = JSON.stringify(event, null, 2);
        logObj.user_id = userId;
        logObj.user_displayname = userProfile?.displayName;
        logObj.user_picture_url = userProfile?.pictureUrl;
        logObj.user_json_str = JSON.stringify(userProfile, null, 2);
        logObj.gpt_user_q_keywords_prompt = searchPrompt;
        logObj.gpt_user_q_keywords_str = searchKeyWords;
        logObj.gpt_vector_search_result_json_str = JSON.stringify(vectorResult?.results, null, 2);
        logObj.gpt_answer_prompt = responsePromt;
        logObj.gpt_answer = fqaRes;
        await this.excelService.insertOneFqasUserLog(logObj);

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
}
