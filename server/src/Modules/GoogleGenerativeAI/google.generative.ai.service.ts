import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IIntentClassifier, IUserQIntentObj } from "./google.generative.ai.interface";
import { IRelevantContext } from "../Line/line.interface";

const key = "1234"
const model = new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' });

@Injectable()
export class GoogleGenerativeAIService {
    constructor(
    ) { }

    async IntegrationOfInferences(inferredQuestion: string, vectorTop3Objs: any[], rdbTop3Objs: any[]) {
        const vectorResultStr = this.formatVectorResults(vectorTop3Objs);
        const rdbResultStr = this.formatRDBResults(rdbTop3Objs);

        const prompt = `
        你是一位 FAQ 智能客服系統的 "答案融合評分器"。

        使用者的詢問意圖如下：
        【${inferredQuestion}】

        以下是系統從不同來源抓到的候選答案（可能包含不相關項目）
        ${vectorResultStr}
        ${rdbResultStr}

        請你逐條比對每個候選答案是否真正與「使用者意圖」高度相關：
        1. 若與詢問意圖有明確直接關聯 → 標示為 "RELEVANT"
        2. 若僅有文字上關鍵字重疊，但語意不符合 → 標示為 "IRRELEVANT"
        3. 請列出理由（簡短說明，不能隨便保留不相關資料）

        接著請你：
        - 只從 RELEVANT 項目中選擇 1~2 個最相關的答案  
        - 用簡潔、清楚、準確的語句撰寫最終回覆  
        - 絕對不可加入任何「不相關」或「推測」的內容

        若 **所有項目都不相關**，請回答：
        「此問題需要人工客服協助。」


        最後輸出字段：
        {
          "selected_answers": [...],
          "final_reply": "..."
        }
        `;

        const res = await model.generateContent(prompt);
        const result = this.extractJson(res.response.text())
        return result;
    };

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

    /**
     * 根據使用者詢問，推論其核心語意
     * @param text 
     * @returns <IUserQIntentObj>
     */
    async getUserQIntentObj(text: string): Promise<IUserQIntentObj> {
        // special process
        // 卷改成券, 使用者容易輸入卷
        text = text.replace('卷', '券');

        // main
        const prompt = `
        你現在進入 JSON ONLY MODE。

規則如下：
- 回覆時「只能」輸出 JSON。
- 不得加入任何敘述、說明文字、Markdown 格式、code block。

任務：找出使用者真正想問的目的。

請依以下格式輸出（結構必須完全一致）：
{
  "original": "<使用者原句>",
  "inferred_question": "<補齊語意後最可能的完整問句>",
  "keywords": ["詞1","詞2","詞3"]
}

限制：
1. keywords 必須 2~5 個，且是核心語意（不可太廣，如：相關、問題、查詢、介紹、服務）
2. 不可加入使用者沒提到的新主題
3. 不可臆測情境，只能補齊語意

使用者本次詢問內容：${text}
        `;

        const res = await model.generateContent(prompt);
        const result: IUserQIntentObj = this.extractJson(res.response.text())
        return result;
    }

    /**
     * 根據使用者詢問，意圖分類
     * @param text 
     * @returns 
     */
    async analyzeUserQuery(userQuery: string, previousMessages: IRelevantContext[]): Promise<IIntentClassifier> {
        // special process
        // 卷改成券, 使用者容易輸入卷
        userQuery = userQuery.replace('卷', '券');

        // 判斷是否有前文
        let preText = this.formatRelevantContexts(previousMessages);

        const prompt = `
${preText}

使用者本次詢問內容：${userQuery}

規則如下：
- 回覆時「只能」輸出 JSON。
- 不得加入任何敘述、說明文字、Markdown 格式、code block。
- 不得包含額外說明。

任務：解析使用者真正想問的目的，並輸出以下內容：
1) 使用者原句
2) 補齊語意後最可能的完整問句
3) 核心關鍵字
4) 問句的意圖分類（intent）
5) 當前詢問是否為有效詢問 ; 不提供閒聊功能
6) 判斷當前作業與前文是否相關
7) 請判斷當前詢問是否表示任務已完成

請依以下格式輸出（結構必須完全一致）：
{
  "original": "<使用者原句>",
  "inferred_question": "<補齊語意後最可能的完整問句>",
  "keywords": ["詞1","詞2","詞3"],
  "intent": "<FAQ | PERSONAL_INFO_QUERY | ACTION_REQUEST | COMPLAINT | UNKNOWN>",
  "isValid": "<true | false>",
  "isRelated": "<true | false>",
  "isTaskCompleted": "<true | false>"
}

【Intent 類別定義】
1. FAQ
   - 詢問一般資訊、規則、活動、優惠、制度
   - 不需查個人資料即可回答
2. PERSONAL_INFO_QUERY
   - 需查使用者本人帳號資料才能回答
   - 如個人優惠券、點數、生日禮、訂位紀錄
3. ACTION_REQUEST
   - 希望系統執行某動作（取消訂位、修改資料等）
4. COMPLAINT
   - 抱怨、負面評論、服務問題
5. UNKNOWN
   - 意圖不明、無法分類、無有效語意

【keywords 規則】
1. keywords 必須 2~5 個
2. 必須是核心語意，不可太廣（如：問題、服務、查詢）
3. 不可加入使用者未提及的新主題
4. 不可臆測不在句子中的情境

【任務已完成 規則】
1. 當使用者確認「是」、「可以」、「好」、「OK」、「沒問題」、「麻煩你」、「請幫我處理」等語句時，視為對前一步操作的同意。
2. 當任務已完成（例如票券已重新發送、資料已更新等），請回傳 isTaskCompleted = true
3. 若仍需收集資訊（例如票券名稱、數量、日期），則 isTaskCompleted = false
        `

        const res = await model.generateContent(prompt);
        const result: IIntentClassifier = this.extractJson(res.response.text())
        return result;
    };

    /**
     * 格式化前文內容
     * @param contexts 
     * @returns 
     */
    private formatRelevantContexts(contexts: IRelevantContext[]): string {
        if (!contexts || contexts.length === 0) {
            return "使用者近期詢問內容：無, isRelated = false";
        }

        const lines = contexts.map(ctx => {
            const time = ctx.created_at instanceof Date
                ? ctx.created_at.toISOString()
                : ctx.created_at;

            return `${time} 使用者詢問: ${ctx.inferred_question}\n${time} 回答: ${ctx.answer}`;
        });

        return `使用者近期詢問內容：\n${lines.join("\n")}\n[注意]如果與此次詢問意圖無關，則無視「使用者近期詢問內容」, isRelated = false`;
    }

    /**
     * 提取 JSON 字串
     * @param text 
     * @returns 
     */
    private extractJson(text: string) {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');

        if (start === -1 || end === -1 || end <= start) {
            throw new Error('No JSON object found in LLM response');
        }

        const jsonString = text.slice(start, end + 1);
        return JSON.parse(jsonString);
    }

    /**
     * 格式化向量搜索結果
     * @param results 
     * @returns 
     */
    formatVectorResults(results: any[]): string {
        return results
            .map((item, index) => {
                return (
                    `解答 ${index + 1} : '${item.answer}',\n` +
                    `編號 : '${item.id}',\n` +
                    `分數 : '${item.score}'\n`
                );
            })
            .join('\n');
    }

    /**
     * 格式化 RDB 搜索結果
     * @param results 
     * @returns 
     */
    formatRDBResults(results: any[]): string {
        return results
            .map((item, index) => {
                return (
                    `解答 ${index + 1} : '${item.answer}',\n` +
                    `編號 : '${item.id}',\n` +
                    `分數 : '${item.match_ratio}'\n`
                );
            })
            .join('\n');
    }
} 