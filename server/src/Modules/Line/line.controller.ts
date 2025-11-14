// line.controller.ts
import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { LineService } from './line.service';
import { MilvusService } from '../Milvus/milvus.service';
import { GoogleGenerativeAIService } from '../GoogleGenerativeAI/google.generative.ai.service';

@Controller('line')
export class LineController {
    constructor(
        private readonly lineService: LineService,
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

        // console.log('body >>>', body)
        // console.log('body.events.message >>>', body?.events[0]?.message)
        // console.log('body.events.source >>>', body?.events[0]?.source)

        const userProfile = await this.lineService.getUserProfile(userId)
        // console.log('userProfile >>>', userProfile)


        // call llm get keywords > search vector > build response
        const searchPrompt = '請根據以下提問，生成3個能代表主要內容的關鍵字，以「逗號」隔開，不要加多餘說明文字。';
        const searchKeyWords = await this.googleGenerativeAI.talk(userText, searchPrompt);
        const vectorResult = await this.milvusService.searchVectors('db_20251114', ['20251114_1'], searchKeyWords);
        const responsePromt = `
        以下是搜尋到的客戶提問結果, 請幫我根據最高 score 分數，回覆客戶，同時美化句子的描述或排版。
        如果 score 都小於 0.9，則回覆「抱歉，我無法回答您的問題，請聯繫真人客服。」
        最後在換行告知使用者這次搜尋分析出的 key words : ${searchKeyWords}`;
        const fqaRes = await this.googleGenerativeAI.talk(JSON.stringify(vectorResult?.results, null, 2), responsePromt);


        console.log('fqaRes >>>', fqaRes);
        //todo 存起來 userInfo 提問 keywords 解答

        // 回覆給 LINE
        await this.lineService.replyMessage(replyToken, fqaRes);

        return res.send({ status: 'ok' });
    }
}
