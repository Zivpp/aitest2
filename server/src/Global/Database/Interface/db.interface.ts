export interface IFqasUserLog {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    event_type: string;
    event_message_text: string;
    event_json_str: string;
    user_id: string;
    user_displayname: string;
    user_picture_url: string;
    user_json_str: string;
    gpt_user_q_keywords_prompt: string;
    gpt_user_q_keywords_str: string;
    gpt_vector_search_result_json_str: string;
    gpt_answer_prompt: string;
    gpt_answer: string;
}
