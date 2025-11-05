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
export interface OperatorRow {
    operator_uuid: string;
    wallet_type: string;
    operator_id: string;
    callback_member: string | null;
    callback_balance: string | null;
    callback_bet: string | null;
    callback_result: string | null;
    callback_cancel: string | null;
    callback_tip: string | null;
}
