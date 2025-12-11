export interface IFaqsUserLog {
    id: string;                     // uuid
    user_id: string;                // 使用者 ID
    user_info_str: string;          // 使用者資訊字串
    original_question: string;      // 原始問題（使用者輸入）
    inferred_question: string;      // 推論後的實際問題
    inferred_keywords: string;
    vector_id_str: string;          // 向量搜尋命中的 FAQ id（字串）
    rdb_id_str: string;             // RDB 搜尋命中的 FAQ id（字串）
    answer: string;                 // 最終回答內容
    is_hit: number;                 // 是否成功命中（0/1）
    create_at: Date;                // 建立時間
    update_at: Date;                // 更新時間
}

export interface IHisUserQAInsert {
    trace_id?: string;
    user_id?: string;
    intend_type?: string;
    session_id?: string;

    original_question?: string;
    inferred_question?: string;

    inferred_keywords?: string;

    answer?: string;
    match_vector_ids?: string;
    match_rdb_ids?: string;

    user_info_str?: string;

    is_hit?: number;
    is_valid?: number;
    is_emergency?: number;
    isNeedHumanAgent?: number;
}
