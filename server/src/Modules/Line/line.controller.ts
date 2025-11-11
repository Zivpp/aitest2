// line.controller.ts
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AccessCodeService } from 'src/Global/Service/access.code.service';
import { LineService } from './line.service';

@Controller('line')
export class LineController {
    constructor(private readonly lineService: LineService,
        private readonly accessCodeService: AccessCodeService
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


        // 呼叫 LLM
        // const aiResponse = await this.lineService.handleMessage(userText, contect, userProfile?.displayName);

        // 回覆給 LINE
        await this.lineService.replyMessage(replyToken, '123');

        return res.send({ status: 'ok' });
    }
}
