import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IIntentClassifier, IUserQIntentObj } from "./google.generative.ai.interface";
import { IRelevantContext } from "../Line/line.interface";


const key = "123-RlVNO_g"
const model = new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' });

@Injectable()
export class GoogleGenerativeAIService {
    constructor(
    ) { }

    async IntegrationOfInferences(inferredQuestion: string, vectorTop3Objs: any[], rdbTop3Objs: any[]) {
        const vectorResultStr = this.formatVectorResults(vectorTop3Objs);
        const rdbResultStr = this.formatRDBResults(rdbTop3Objs);

        const prompt = `
你是一個「FAQ 答案選擇與評分模組（Answer Selector）」。

你不是客服、不是說明者、不是自由生成回答的助理。
你不負責改寫、濃縮或美化內容。

你的任務只有兩件事：
1. 判斷哪些候選答案「真正符合使用者詢問」
2. 從中選出最適合用來回覆的 1~3 個答案

【使用者詢問（已補齊語意）】
${inferredQuestion}

【候選答案來源】

[VectorDB]
${vectorResultStr}

[RDB]
${rdbResultStr}

【判斷規則】
- 僅當內容「直接回答使用者問題」才視為 RELEVANT
- 僅有關鍵字重疊、但語意不符者，一律視為 IRRELEVANT
- 不得因資訊完整或描述較長而加分
- 不得補充候選答案中不存在的資訊

【輸出規則】
- 僅輸出 JSON
- 不得輸出任何說明文字
- 結構必須完全一致

請依下列格式輸出：

{
  "selected_answers": [
    {
      "source": "VectorDB | RDB",
      "id": "<答案ID>",
      "reason": "<為何此答案與詢問直接相關（一句話）>"
    }
  ],
  "final_reply_type": "FAQ | NEED_HUMAN",
  "final_reply": "<僅允許直接使用 selected_answers 中的內容，不得改寫或補充>"
}

【特別限制】
- final_reply 必須是「原答案內容的原文拼接或完整引用」
- 不得自行摘要、合併、改寫句子
- 若所有答案皆為 IRRELEVANT，final_reply_type 設為 NEED_HUMAN，final_reply 固定為：
  「此問題需要人工客服協助。」
- 在「有句點的地方換行」，不改內容、不重寫語句。
- 每一句結尾如果沒有句點，請補上句點。
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
    async getUserTextInferred(text: string): Promise<IUserQIntentObj> {
        // special process
        // 卷改成券, 使用者容易輸入卷
        text = text.replace('卷', '券');

        // main
        const prompt = `
            你現在是「語意解析器（Semantic Parser）」。

你不是客服、不是回答者、不是說明者。
你「不負責解釋內容、不負責補充知識、不負責回答問題」。

你的唯一任務：
將使用者的原始問句，整理成「最保守、最直接的詢問目的」。

【JSON ONLY MODE】
- 只能輸出 JSON
- 不得輸出任何說明、描述、Markdown、code block

輸出格式（結構必須完全一致）：
{
  "original": "<使用者原句>",
  "inferred_question": "<僅補齊語意、不新增主題的完整問句>",
  "keywords": ["詞1","詞2"]
}

inferred_question 規則：
- 若原句已清楚，直接等於 original
- 只能補齊主詞或受詞
- 不得加入使用者未提及的概念
- 不得加入背景、規則、說明、條件

keywords 規則：
- 必須從 inferred_question 中「直接抽取」
- 只能是名詞或名詞片語
- 數量 2~4 個
- 禁止使用抽象或泛用詞（如：介紹、資訊、相關、服務、查詢）
- 禁止與信用卡相關概念（星卡、銀卡、金卡、黑卡為集團自定義會員等級）

使用者輸入：
${text}
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
     * 
     * @param text 
     * @returns 
     */
    async analyzeUserIntent(text: string): Promise<string> {
        const prompt = `使用者詢問內容：${text}

規則如下：
- 回覆時「只能」輸出 JSON。
- 不得加入任何敘述、說明文字、Markdown 格式、code block。
- 不得包含額外說明。

任務：解析使用者真正想問的目的，並輸出以下內容：
1)問句的意圖分類（intent） 

【Intent 類別定義】
1. FAQ
- 詢問一般資訊、規則、活動、優惠、制度
- 不需查個人資料即可回答
2. PERSONAL_INFO_QUERY
- 需查使用者本人帳號資料才能回答
- 如個人優惠券、點數、生日禮、訂位紀錄
3. ACTION_REQUEST
- 使用者希望系統執行某個可被定義的操作
- 例如 : 取消訂位、修改聯絡資料、查詢訂單狀態、券轉贈
4. COMPLAINT
- 抱怨、負面評論、服務問題
5. EMERGENCY_INCIDENT
- 涉及人身安全、公共安全、重大風險，需要立即人工介入的事件、食安相關、餐後不適
6. UNKNOWN
- 意圖不明、無法分類、無有效語意

請依以下格式輸出（結構必須完全一致）：
{
"intent": "<FAQ | PERSONAL_INFO_QUERY | ACTION_REQUEST | COMPLAINT | EMERGENCY_INCIDENT | UNKNOWN>",
}
`
        const res = await model.generateContent(prompt);
        const result = this.extractJson(res.response.text())
        return result?.intent;
    }

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