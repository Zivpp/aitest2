// line.controller.ts
import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { LineService } from './line.service';
import { MilvusService } from '../Milvus/milvus.service';
import { GoogleGenerativeAIService } from '../GoogleGenerativeAI/google.generative.ai.service';
import { IFqasUserLog } from 'src/Global/Database/Interface/db.interface';
import { ExcelService } from '../Excel/excel.service';

@Controller('line')
export class LineController {
    constructor(
        private readonly lineService: LineService,
        private readonly excelService: ExcelService,
        private readonly milvusService: MilvusService,
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
        const searchPrompt = '請根據以下提問，生成3個能代表主要內容的關鍵字，以「逗號」隔開，不要加多餘說明文字。';
        const searchKeyWords = await this.googleGenerativeAI.talk(userText, searchPrompt);
        const vectorResult = await this.milvusService.searchVectors('db_20251114', ['20251114_1'], searchKeyWords);
        const responsePromt = `
        [角色設定]
        你是一個客服 AI，了解饗賓集團的餐飲活動與會員制度。

        [任務指令]
        請根據提供的搜尋結果，挑選最相關答案回覆顧客。

        [規則]
        1. 若無關聯，請回答「抱歉，我無法回答您的問題，請聯繫真人客服。」
        2. 若多個答案相關，請整合成一段自然的回覆。
        3. 回覆後加上本次關鍵字：${searchKeyWords}，幫我隔一行。
        `
        const fqaRes = await this.googleGenerativeAI.talk(JSON.stringify(vectorResult?.results, null, 2), responsePromt);


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
            await this.lineService.replyMessages(replyToken, [
                {
                    type: 'text',
                    text: fqaRes
                },
                {
                    "type": "flex",
                    "altText": "生日禮資格查詢",
                    "contents": {
                        "type": "bubble",
                        "size": "mega",
                        "hero": {
                            "type": "image",
                            "url": "https://www.ieatogether.com.tw/img/booking/booking_ajoy_img.webp",
                            "size": "full",
                            "aspectRatio": "20:9",
                            "aspectMode": "cover"
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "md",
                            "paddingAll": "20px",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "🎂 生日禮資格查詢",
                                    "weight": "bold",
                                    "size": "xl",
                                    "color": "#333333",
                                    "align": "center"
                                },
                                {
                                    "type": "text",
                                    "text": "立即確認您是否符合生日專屬優惠資格！",
                                    "wrap": true,
                                    "size": "sm",
                                    "color": "#666666",
                                    "align": "center"
                                },
                                {
                                    "type": "separator",
                                    "margin": "md"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "uri",
                                        "label": "立即查詢",
                                        "uri": "https://www.ieatogether.com.tw/foreignBooking"
                                    },
                                    "style": "primary",
                                    "height": "sm",
                                    "color": "#1DB446",
                                    "margin": "lg"
                                }
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "提醒：需登入會員後查詢生日禮資格",
                                    "wrap": true,
                                    "color": "#999999",
                                    "size": "xs",
                                    "align": "center"
                                }
                            ]
                        },
                        "styles": {
                            "body": { "backgroundColor": "#FFFFFF" },
                            "footer": { "backgroundColor": "#FAFAFA" }
                        }
                    }
                }
            ]);
        }

        return res.send({ status: 'ok' });
    }
}
