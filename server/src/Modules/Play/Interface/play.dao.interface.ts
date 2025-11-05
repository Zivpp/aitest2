import { RowDataPacket } from "mysql2";

export interface CxUser {
  user_key: number; // bigint(20), PK, AUTO_INCREMENT
  user_reg_date?: Date | string | null; // datetime, 可為 null
  user_id?: string | null; // varchar(34)
  user_id_org?: string | null; // varchar(30)
  user_name?: string | null; // varchar(24)
  user_nick?: string | null; // varchar(24)
  user_nick_org?: string | null; // varchar(20)
  op_id?: number | null; // int(11)
  cash?: number | null; // decimal(20,6)
  betskin?: number | null; // smallint(6)
  user_status?: number | null; // tinyint(4)
  version?: number | null;
}

export interface OperatorRow {
  operator_uuid: string; // UUID
  wallet_type: string; // 錢包類型
  operator_id: string; // _o.operator_id
  callback_member: string | null;
  callback_balance: string | null;
  callback_bet: string | null;
  callback_result: string | null;
  callback_cancel: string | null;
  callback_tip: string | null;
}
