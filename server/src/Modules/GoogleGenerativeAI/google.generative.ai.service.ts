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
        const prompt = `
請根據以下客服解答內容推論其核心語意，生成 3~10 個最具代表性的關鍵字。
每個關鍵字需高度語意相關，不要產生無關字、更不要為湊滿數量而生成。
每個關鍵字 2~4 個字，以逗號隔開，不要多餘文字。
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
        const query = `${prompt}\n${text}`;
        const res = await model.generateContent(query);
        return res.response.text();
    }

} 