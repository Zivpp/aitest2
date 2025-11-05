export interface LoginPlayer {
  id: string;
  brand: string;
  currency?: string;
  mode: "FUN" | "REAL";
  is_test: boolean;
}

export interface LoginBalance {
  value: string;
  version: number;
}

export interface LoginSuccessResponse {
  uid: string;
  player: LoginPlayer;
  balance: LoginBalance;
  tag: string;
  user?: any;
}

export interface LoginErrorResponse {
  uid: string;
  error: {
    code: string;
    message?: string;
  };
}

// 最終型別
export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export interface BalanceInfo {
  value: string; // decimal string, >= 0
  version: number; // biginteger
}

export interface GetBalanceResponse {
  uid: string;
  balance: BalanceInfo;
}
