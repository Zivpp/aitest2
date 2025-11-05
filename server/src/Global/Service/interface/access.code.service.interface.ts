export interface UserObj {
  key: number; // 유저 키 | 使用者金鑰
  v: number; // 사용버전 | 使用版本
  id: string; // 유저ID | 使用者ID
  op: number; // 오퍼레이터ID( 번호 ) | 操作員 ID
  c: number; // 실행 게임사키 | 執行遊戲公司的代碼
  dt: number; // 게임 실행 시간 | 遊戲執行時間
  sg: string; // 게임시작시 발행한 토큰 | 遊戲開始時發行的令牌
  bl: string; // 벳리밋 | 賭率限制, A range, B range
  tr: string; // 로그 추적코드( trace ) | 記錄追蹤代碼( trace )
  update_time: number; // Date.now(); etc. 1721098425233
}

export interface objThirdParty {
  cp_key: number; // 게임사 번호 | 游戲公司代碼
  name: string; // 게임사 이름 | 游戲公司名稱
  degit: number; // 게임사 소수점 | 可以顯示多少小數位
  req_call_timeout: number; // 게임사 타임아웃( ms ) | 游戲公司超時( ms )
  game_type: string; // 게임타입 | 遊戲類型
  bet_limit_def: string; // 게임사 기본 벳리밋 설정값 | 預設賭率限制
  trans_stored: transStored; // 게임사 거래 정보 저장 시간 | 遊戲公司交易信息保存時間
}

export interface transStored {
  round: number; // 라운드 정보 저장 시간 | 保存時間
  bet_trans: number; // 베팅 거래 정보 저장 시간 | 賭注交易信息保存時間
  result_trans: number; // 결과 거래 정보 저장 시간 | 結果交易信息保存時間
  tip_trans: number; // 팁 거래 정보 저장 시간 | 賭注交易信息保存時間
  withdraw_trans: number; // 출금 거래 정보 저장 시간 | 提款交易信息保存時間
  deposit_trans: number; // 입금 거래 정보 저장 시간 | 存款交易信息保存時間
}

export interface GSlotItem {
  game_cp_key: number;
  game_code: string;
  game_name_eng: string;
}

export interface TokenContent {
  sign: string; // 唯一識別用，作為 g_tokenList key
  sg: string; // session key or session group key
  key: number; // 使用者主鍵（user_key）
  v: number; // version 或是格式版本
  id: string; // 使用者 id
  op: string; // operator id
  c: number; // cp (遊戲供應商代碼)
  dt: number; // 建立時間（timestamp）
  bl: any; // bet limit，可能是 null 或 object，視實作定義
  tr: string; // trace id
  update_time?: number; // 可選，代表更新時間，通常會由系統補上
}

export interface TokenWrapper {
  token: TokenContent;
  update_time?: number; // 為了相容 g_tokenList 的儲存格式，也在外層保留
}

export interface GetDataGameListRes {
  code: string;
  name: string;
  type: string;
  view_url: string;
  use_splash: string;
}
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

export type Provider = "EVOLUTION" | "BNG" | "PP";
