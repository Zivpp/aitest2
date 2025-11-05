import { CheckDto } from "../Dto/evolution.dto";

/**
 * session context
 * @param userId string
 * @param sid string
 * @param hasToken boolean
 * @param tokenObj any
 */
export interface SessionContext extends CheckDto {
  tokenObj: any;
  hasToken: boolean;
  isFallbackToken: boolean;
  newToken?: string;
}

/**
 * check user response
 * @param status string
 * @param sid string
 * @param uuid string
 */
export interface CheckUserResponse {
  status: string;
  sid: string;
  uuid: string;
}

export interface BalanceResponse {
  status: string;
  balance: number;
  bonus: number;
  uuid: string;
}

export interface BalanceTableSign {
  [key: string]: string;
}

export interface BalanceTable {
  name: string;
  type: string;
  sign: BalanceTableSign;
}

export interface DebitResponse {
  status: string;
  balance: number | null;
  bonus: number;
  uuid: string;
}

export interface CreditResponse {
  status: string; // e.g. "OK"
  balance: number | null; // e.g. 999.35
  bonus: number; // e.g. 1.00
  uuid: string; // UUID string
}

export interface CancelResponse {
  status: string; // e.g. "OK"
  balance: number | null; // e.g. 999.35
  bonus: number; // e.g. 1.00
  uuid: string; // UUID string
}

export interface PromoPayoutResponse {
  status: string; // e.g. "OK"
  balance: number; // e.g. 999.35
  bonus: number; // e.g. 1.00
  uuid: string; // UUID string
}

export interface EvolutionDebitCheck {
  isEnd: boolean;
}
