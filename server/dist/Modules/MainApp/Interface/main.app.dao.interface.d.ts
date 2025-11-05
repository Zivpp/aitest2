import { RowDataPacket } from "mysql2";
export interface CxUser {
    user_key: number;
    user_reg_date?: Date | string | null;
    user_id: string;
    user_id_org: string;
    user_name?: string | null;
    user_nick?: string | null;
    user_nick_org?: string | null;
    op_id?: number | null;
    cash?: number | null;
    betskin?: number | null;
    user_status?: number | null;
    version?: number | null;
    sign?: string | null;
    connect_ip?: string | null;
}
export interface TblOperator {
    idx: number;
    operator_id: string;
    parent_operator: string;
    role_idx: number;
    profit_rate: number;
    b_rate: number;
    email: string;
    domain: string;
    test_userid: string;
    test_password: string;
    passwd: string;
    nickname: string;
    cash: number;
    cash_b: number;
    point: number;
    cash_update_cnt: number;
    parent_operator_tree: string;
    phone: string;
    join_ip: string;
    created: Date | string | null;
    last_login_date: Date | string | null;
    last_login_ip: string;
    state: number;
    table_created: number;
    uuid: string;
    wallet_type: string;
    payment_type: string;
    memo: string | null;
    last_session_id: string | null;
    group_code: string | null;
    level: string | null;
    sleeped_at: Date | string | null;
    qt_level: number | null;
    use_splash: number | null;
    use_gap: number | null;
}
export interface ProcChkOperatorRow extends RowDataPacket {
    _RESULT: number;
    OPERATOR_ID?: number;
    OPERATOR_NAME?: string;
    WALLET_TYPE?: string;
    QT_LEVEL?: number;
    USE_SPLASH?: 0 | 1 | null;
    USE_BETSKIN?: number | null;
    DEFAULT_BETSKIN?: number | null;
}
export interface CxGameCp {
    code: number;
    name: string;
    type: string;
    view_url?: string;
    use_splash?: number;
}
export interface HotRow {
    game_code: string;
    pos: number;
}
export interface GameRow {
    game_code: string;
    game_id: string;
    game_name_eng: string;
    game_name_kor: string;
    game_type: string;
    table_type: string | null;
    is_lobby: number;
    is_desktop: number;
    is_mobile: number;
    img_1: string | null;
    game_reg_date: string | Date;
}
export interface GameV1 {
    code: string;
    id: string;
    type: string;
    name_eng: string;
    name_kor: string;
    is_lobby: boolean;
    is_desktop: boolean;
    is_mobile: boolean;
    img_1: string;
    date: string | Date;
    table: {
        type: string;
        is_lobby: boolean;
    } | null;
}
export interface GameV2 {
    code: string;
    id: string;
    type: string;
    name: {
        eng: string;
        kor: string;
    };
    is_lobby: boolean;
    is_desktop: boolean;
    is_mobile: boolean;
    thumbnail: {
        default: string;
    };
    date: string | Date;
    table: {
        type: string;
        is_lobby: boolean;
    } | null;
}
export interface TblOperatorRow {
    idx: number;
    uuid: string;
    wallet_type: string;
    qt_level: number;
    use_splash: number;
}
export interface ProcChkOperator {
    _RESULT: number;
    OPERATOR_ID?: number;
    OPERATOR_NAME?: string;
    WALLET_TYPE?: string;
    QT_LEVEL?: number;
    USE_SPLASH?: 0 | 1 | null;
    USE_BETSKIN?: number | null;
    DEFAULT_BETSKIN?: number | null;
}
export interface COperatorGameInfo {
    op_id: number;
    op_key: string;
    load_time: number;
    wallet: string;
    urls: {
        member_check: string;
        balance: string;
        bet: string;
        result: string;
        cancel: string;
        tip: string;
        etc: string;
    };
}
export interface BetLogRes {
    user_key: number;
    third_party_code: string;
    game_code: string;
    third_party_round_id: string;
    third_party_trans_id: string;
    times: number;
}
export interface GameNewRow {
    id: number;
    code: string;
    name_eng: string;
    name_kor: string;
    type: string;
    is_desktop: number;
    is_mobile: number;
    img_1: string | null;
    date: string | Date;
}
