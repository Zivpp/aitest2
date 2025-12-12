export interface LineWebhookEvent {
    type: 'message';
    message: {
        type: 'text';
        id: string;
        quoteToken: string;
        markAsReadToken: string;
        text: string;
    };
    webhookEventId: string;
    deliveryContext: {
        isRedelivery: boolean;
    };
    timestamp: number;
    source: {
        type: 'user' | 'group' | 'room';
        userId: string;
        groupId?: string;
        roomId?: string;
    };
    replyToken: string;
    mode: 'active' | 'standby';
}

export interface LineUserProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
    language?: string;
}

export interface IMultifunctionalQAObj {
    ruudId: string; // 本次對話的 id = line token, 因為使用 line 當入口
    sessionId: string; // 多對話同一組 id.
    previousMessages: string[]; // 上下文
    userInfo: LineUserProfile;
    originalQuestion: string;
    inferredQuestion: string;
    keywords: string[];
    intent: string; // 意圖分類
    isValid: boolean; // 是否為有效對話, 如果是則儲存
    isNeedHumanAgent: boolean; // 是否需要人工介入
    isRelated: boolean; // 是否為相關對話? (需要上文)
    isEmergencyLevel: boolean; // 是否為緊急程度
    isTaskCompleted: boolean; // 是否為任務完成
    vectorSource: vectorObj[]; // vector search result
    rdbSource: rdbObj[]; // rdb search result
    finalReply: string;
}

interface vectorObj {
    id: string;
    score: number;
}

interface rdbObj {
    id: string;
    keywords: string[];
    ratio: number;
}

export interface IRelevantContext {
    id: string;
    user_id: string;
    session_id: string;
    inferred_question: string,
    answer: string,
    created_at: Date;
}
