export interface PlayReqContext {
  /** 業者/供應商代號，例如 'Evolution' */
  op: string;

  /** 內容商(cp)鍵值，例如 'EVOL' */
  cp: string;

  /** 遊戲代碼（如桌號/機台代號/內部 gameCode） */
  gamcode: string;

  /** 事件時間（Unix ms） */
  times: number;

  /** 下注上限/區間：單一上限，或 {min,max} 區間 */
  betlimit: number | { min: number; max: number };

  /** trace / transaction / request id */
  tr: string;

  /** 裝置類型 */
  device: "ios" | "android" | "web" | "desktop" | "tablet" | string;

  /** 原始 User-Agent */
  useragent: string;

  /** 來源站點 URL */
  siteurl: string;

  /** 語系（如 'zh-TW', 'en', 'ko'） */
  lang: string;

  /** ISO 4217 貨幣（如 'KRW'） */
  currency: string;

  /** 使用者識別（user id / account） */
  user: string;

  /** 版本字串（如 'v1'、'1.0.0'） */
  ver: string;

  /** 原始請求 payload */
  req: Record<string, unknown>;
}

// 推論
export interface PlayReqOperator {
  id: number;
  key: string | null;
  name: string | null;
  wallet_type: string;
  qt_level: number;
  use_splash: 0 | 1;
  result: number;
}

interface COperatorGameInfoUrls {
  member_check: string | null;
  balance: string | null;
  bet: string | null;
  result: string | null;
  cancel: string | null;
  tip: string | null;
  etc: string | null;
}

export interface COperatorGameInfo {
  op_id: number;
  op_key: string | null;
  op_name: string | null;
  load_time: number;
  wallet: string | null;
  urls: COperatorGameInfoUrls;
}

export interface StartUrl {
  funcStartUrl: string;
  strSendDataToCallbackServerUrl: string;
}

export interface GetAccount {
  account: string;
  password: string;
}

export interface PlayReqUser {
  user_key: number;
  user_id: string;
  user_id_org: string;
  user_name: string;
  user_nick: string;
  user_nick_org: string;
  op_id: number;

  /** 十進位金額字串（例如 "0.000000"） */
  cash: string;

  betskin: number;

  /** IPv4/IPv6（可能含 ::ffff: 前綴） */
  connect_ip: string;

  /** 可能為 null（尚未發放或失效） */
  token: string | null;

  /** 簽章（通常為 32 位 hex） */
  sign: string;

  version: number;
}
