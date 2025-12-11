// line.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ApiService } from 'src/Infrastructure/Api/api.service';

@Injectable()
export class LineService {
    constructor(
        private readonly apiService: ApiService,
    ) { }

    private readonly LINE_API = 'https://api.line.me/v2/bot/message/reply';
    private readonly TOKEN = "YzslmbUYbTt8nvhIuCI0zxq+j+kxxcoH4p9wki1yOtlfw6sXC0JJbuOqs/iPBd2wQmRE/6PpyQ3PZUuFxUkd9uJeEHdsTD7N7rvNirQjJmHD4ZUVZiLFU3YaQUGYJgrFppgwY9LF4FCnDMWHfE3koAdB04t89/1O/w1cDnyilFU=";

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
