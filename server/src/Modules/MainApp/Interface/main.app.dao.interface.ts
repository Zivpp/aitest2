import { RowDataPacket } from "mysql2";

export interface CxUser {
  user_key: number; // bigint(20), PK, AUTO_INCREMENT
  user_reg_date?: Date | string | null; // datetime, 可為 null
  user_id: string; // varchar(34)
  user_id_org: string; // varchar(30)
  user_name?: string | null; // varchar(24)
  user_nick?: string | null; // varchar(24)
  user_nick_org?: string | null; // varchar(20)
  op_id?: number | null; // int(11)
  cash?: number | null; // decimal(20,6)
  betskin?: number | null; // smallint(6)
  user_status?: number | null; // tinyint(4)
  version?: number | null;
  sign?: string | null; // /api/play used
  connect_ip?: string | null; // /api/play used
}

export interface TblOperator {
  idx: number; // PK, AUTO_INCREMENT
  operator_id: string; // 唯一
  parent_operator: string;
  role_idx: number;
  profit_rate: number; // double(4,2)
  b_rate: number; // double(4,2)
  email: string;
  domain: string;
  test_userid: string;
  test_password: string;
  passwd: string; // sha256
  nickname: string;
  cash: number; // double(16,4)
  cash_b: number; // double(16,4)
  point: number; // double(16,4)
  cash_update_cnt: number;
  parent_operator_tree: string;
  phone: string;
  join_ip: string;
  created: Date | string | null; // DEFAULT current_timestamp()
  last_login_date: Date | string | null;
  last_login_ip: string;
  state: number; // 0:待審,1:正常,4:中止
  table_created: number; // 0:未建,1:完成
  uuid: string;
  wallet_type: string; // enum
  payment_type: string; // enum
  memo: string | null;
  last_session_id: string | null;
  group_code: string | null;
  level: string | null;
  sleeped_at: Date | string | null;
  qt_level: number | null; // tinyint(4)
  use_splash: number | null; // tinyint(4) 0/1
  use_gap: number | null; // tinyint(4)
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
  pos: number; // 注意：你的 DB 是 0-based 還是 1-based？
}

export interface GameRow {
  game_code: string;
  game_id: string;
  game_name_eng: string;
  game_name_kor: string;
  game_type: string; // 'live' | 'slot' | ...
  table_type: string | null;
  is_lobby: number; // 0/1 (已在 SQL 用 +0 強轉)
  is_desktop: number; // 0/1
  is_mobile: number; // 0/1
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
  table: { type: string; is_lobby: boolean } | null;
}

export interface GameV2 {
  code: string;
  id: string;
  type: string;
  name: { eng: string; kor: string };
  is_lobby: boolean;
  is_desktop: boolean;
  is_mobile: boolean;
  thumbnail: { default: string };
  date: string | Date;
  table: { type: string; is_lobby: boolean } | null;
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
