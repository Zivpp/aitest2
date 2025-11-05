export interface ProcessRequest {
    trace_id: string;
    callback_type: number;
    obj_third_party: ObjThirdParty;
    obj_user: ObjUser;
    obj_data: ObjData;
    lang: string;
}
export interface ProcessReply {
    result: ProcessReply_result;
    error: ProcessReply_error;
}
export interface ProcessReply_result {
    result: number;
    balance: number;
    time: string;
    round_id: string;
    trans_id: string;
    error_msg: string;
}
export interface ProcessReply_error {
    statuscode: number;
    time: string;
    requset: ObjRequest;
    response: string;
    msg: string;
}
export interface ObjThirdParty {
    cp_key: number;
    name: string;
    degit: number;
    req_call_timeout: number;
    game_type: number;
    bet_limit_def: string;
    trans_stored: TransStored;
}
export interface TransStored {
    round: number;
    bet_trans: number;
    result_trans: number;
    tip_trans: number;
    withdraw_trans: number;
    deposit_trans: number;
}
export interface ObjUser {
    key: number;
    v: number;
    id: string;
    op: number;
    c: number;
    dt: number;
    sg: string;
    bl: string;
    tr: string;
}
export interface ObjData {
    round_id: string;
    trans_id: string;
    amount: number;
    game_code: string;
    table_code: string;
    game_type: string;
    event_type: string;
    is_end: boolean;
    is_cancel_round: boolean;
    is_end_check: boolean;
    cp_data: string;
    is_test: boolean;
}
export interface ObjResult {
    result: number;
    balance: number;
    time: string;
    round_id: string;
    trans_id: string;
    error_msg: string;
}
export interface ObjError {
    statuscode: number;
    time: string;
    requset: ObjRequest;
    response: string;
    msg: string;
}
export interface ObjRequest {
    t: number;
    u: string;
    p: string;
}
