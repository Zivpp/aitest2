import { IHisUserQAInsert } from "../Interface/db.interface";

/**
 * 
 * @param data 
 * @returns 
 */
export function createHisUserQAPayload(data: IHisUserQAInsert): IHisUserQAInsert {
    return {
        trace_id: data.trace_id ?? "",
        user_id: data.user_id ?? "",
        intend_type: data.intend_type ?? "",
        session_id: data.session_id ?? "",

        original_question: data.original_question ?? "",
        inferred_question: data.inferred_question ?? "",
        inferred_keywords: data.inferred_keywords ?? "",

        answer: data.answer ?? "",
        match_vector_ids: data.match_vector_ids ?? "",
        match_rdb_ids: data.match_rdb_ids ?? "",

        user_info_str: data.user_info_str ?? "",

        is_hit: data.is_hit ?? 0,
        is_emergency: data.is_emergency ?? 0,
        is_valid: data.is_valid ?? 0,
        isNeedHumanAgent: data.isNeedHumanAgent ?? 0,
    };
}