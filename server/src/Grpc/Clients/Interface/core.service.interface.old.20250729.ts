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
  result: number; // 結果代碼，例如 1 成功, 0 失敗
  balance: number; // 使用者餘額
  time: string; // 回傳時間戳
  round_id: string; // 系統處理後的 round_id
  trans_id: string; // 系統處理後的 trans_id
  error_msg: string; // 錯誤訊息（通常僅在失敗時才會出現）
}

export interface ProcessReply_error {
  statuscode: number; // 錯誤 HTTP 狀態碼或自定義代碼
  time: string; // 發生錯誤的時間
  requset: ObjRequest; // 當時嘗試呼叫的請求內容
  response: string; // 從對方回傳的原始錯誤資訊
  msg: string; // 友善錯誤訊息
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
