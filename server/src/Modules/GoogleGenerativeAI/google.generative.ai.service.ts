import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

const key = "AIzaSyCxJvqU1aVKrwASM2MQ11wMp0ScodYWcCM"
const model = new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' });

@Injectable()
export class GoogleGenerativeAIService {
    constructor(
    ) { }

    /**
     * 根據文字內容，生成3個能代表主要內容的關鍵字
     * @param answer 
     * @returns 
     */
    async getkeyWord(answer: string) {
        const prompt =
            `請根據以下客服解答內容進行語意推論，生成 10 個能代表主要內容的關鍵字。
        每個關鍵字 2～4 個字，不要固定長度。
        以「逗號」隔開，不要加任何多餘說明文字。
        文字內容：${answer}
        `;
        const res = await model.generateContent(prompt);
        return res.response.text();
    };


    /**
     * 自定義詢問內容與 prompt
     * @param text 
     * @param prompt 
     * @returns 
     */
    async talk(text: string, prompt: string) {
        const query = `${prompt}\n\n文字內容：${text}`;
        const res = await model.generateContent(query);
        return res.response.text();
    }

} 