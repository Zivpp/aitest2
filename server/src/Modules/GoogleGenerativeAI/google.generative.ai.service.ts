import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";

const key = "AIzaSyCvBYSJwk4Q-ug5RWPA9d9ml7x63z_yXN0"

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
        const model = new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt =
            `請根據以下客服解答去推論，生成3個能代表主要內容的關鍵字，
以「逗號」隔開，不要加多餘說明文字．

文字內容：
${answer}
`;
        const res = await model.generateContent(prompt);
        return res.response.text();
    };
} 