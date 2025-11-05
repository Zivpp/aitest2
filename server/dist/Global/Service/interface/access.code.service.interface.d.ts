export interface UserObj {
    key: number;
    v: number;
    id: string;
    op: number;
    c: number;
    dt: number;
    sg: string;
    bl: string;
    tr: string;
    update_time: number;
}
export interface objThirdParty {
    cp_key: number;
    name: string;
    degit: number;
    req_call_timeout: number;
    game_type: string;
    bet_limit_def: string;
    trans_stored: transStored;
}
export interface transStored {
    round: number;
    bet_trans: number;
    result_trans: number;
    tip_trans: number;
    withdraw_trans: number;
    deposit_trans: number;
}
export interface GSlotItem {
    game_cp_key: number;
    game_code: string;
    game_name_eng: string;
}
export interface TokenContent {
    sign: string;
    sg: string;
    key: number;
    v: number;
    id: string;
    op: string;
    c: number;
    dt: number;
    bl: any;
    tr: string;
    update_time?: number;
}
export interface TokenWrapper {
    token: TokenContent;
    update_time?: number;
}
export interface GetDataGameListRes {
    code: string;
    name: string;
    type: string;
    view_url: string;
    use_splash: string;
}
export interface CxUser {
    user_key: number;
    user_reg_date?: Date | string | null;
    user_id?: string | null;
    user_id_org?: string | null;
    user_name?: string | null;
    user_nick?: string | null;
    user_nick_org?: string | null;
    op_id?: number | null;
    cash?: number | null;
    betskin?: number | null;
    user_status?: number | null;
    version?: number | null;
}
export type Provider = "EVOLUTION" | "BNG" | "PP";
