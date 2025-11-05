export interface AccountResponse<T = any> {
  result: number | null; // 執行結果代碼
  msg: string; // 結果訊息
  data: T; // 實際回傳資料（泛型）
}

export interface CreateAccountResponse {
  result: number; // 1 表示成功，其它值可依你的錯誤碼定義
  msg: string; // 訊息，例如 "success"
  data: CreateAccountData;
}

export interface CreateAccountData {
  id: string;
  nick: string;
  betskin: string;
}

export interface ProvListResponse {
  /**
   * 게임사요청 결과를 반환합니다.
   * 성공하면 1을 반환합니다.
   */
  result: number;

  /** 메세지를 반환합니다. */
  msg: string;

  /** 결과 데이터 (json으로 반환). */
  data: ProvListData;

  /** 버전을 반환합니다. */
  ver: number;
}

export interface ProvListData {
  /** 리스트를 반환합니다. */
  list: ProvListItem[];
}

export interface ProvListItem {
  /** 게임사 코드를 반환합니다. */
  code: number;

  /** 게임사 이름을 반환합니다. */
  name: string;

  /**
   * 게임타입.
   * 허용값: "slot", "live"
   */
  type: "slot" | "live";
}

export interface GameListResponse {
  /**
   * 게임리스트 요청 결과
   * 성공하면 1 반환
   */
  result: number;

  /** 메세지 */
  msg: string;

  /** 버전을 반환합니다. */
  ver: number;

  /** 回傳的資料物件 */
  data: {
    /** 遊戲列表 */
    list: GameListItem[];
  };
}

export interface GameListItem {
  id?: number;
  date?: string;

  /** 遊戲商代碼 */
  code: number;

  /** 英文名稱 */
  name_eng: string;

  /** 韓文名稱 */
  name_kor: string;

  /**
   * 遊戲類型
   * 允許值: "slot", "live"
   */
  type: string;

  /** 桌台相關資訊 */
  table: {
    /** 桌台類型 */
    type: string;
    /** 是否為大廳 */
    is_lobby: boolean;
  };

  /** 是否支援桌機 */
  is_desktop: boolean;

  /** 是否支援手機 */
  is_mobile: boolean;

  /** 遊戲圖片 URL */
  img_1: string;
}

export interface TablelistResponse {
  /** 결과 코드. 성공하면 1 */
  result: number;

  /** 메세지 */
  msg: string;

  /** 결과 데이터 */
  data: {
    /** 테이블 리스트 */
    list: TableItem[];
  } | null;
}

/**
 * 단일 테이블 항목.
 * key 는 동적으로 변할 수 있다.
 */
export interface TableItem {
  [key: string]: string;
}

export interface PlayResponse {
  /** 게임 시작 URL 요청 결과 (성공: 1) */
  result: number;

  /** 메세지를 반환합니다 */
  msg: string;

  /** 결과 데이터 */
  data: {
    /** 게임 시작 URL */
    link: string;
  };
}

export interface Operator {
  _RESULT: number;
  id: number;
  name: string;
  key: string;
  wallet_type: string;
  qt_level: number;
  use_splash: number;
}

export interface CurrentRResponse {
  result: number;
  msg: string;
  ver: number;
  data: {
    r: number;
  };
}

/** 單一遊戲項目 */
export interface Top30Item {
  /** 순위 */
  rank: number;
  /** 게임사 코드 */
  thirdpartycode: string;
  /** 게임사 이름 */
  thirdpartyname: string;
  /** 게임 코드 */
  code: string;
  /** 게임 이름 */
  name: string;
  /** 썸네일 이미지 URL */
  img: string;
}

/** 資料區塊：清單最多 30 筆 */
export interface Top30Data {
  /** 리스트 */
  list: Top30Item[];
}

/** Top30 API 回應 */
export interface Top30Response {
  /**
   * 게임 시작 URL 요청 결과
   * 성공하면 1 반환 (失敗可為 0)
   */
  result: number;
  /** 메세지 */
  msg: string;
  /** 결과 데이터 */
  data: Top30Data;
}

/** 게임 시작 URL 요청 응답 */
export interface LogGetData {
  /** 상세보기/이동용 URL */
  link: string;
}

export interface LogGetResponse {
  result: number;
  /** 메세지 */
  msg: string;
  /** 결과 데이터 */
  data: LogGetData;
}

export interface LogGetDto {
  opkey: number;
  roundid: string;
  hash: string;
}
