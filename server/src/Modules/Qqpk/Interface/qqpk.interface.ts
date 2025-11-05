export interface QqpkRequest {
  account: string;
  time: number;
  sign: string;
}

export interface BalanceResponse {
  status_code: number;
  message: string;
  data?: {
    account: string;
    currency: string;
    balance: number;
  };
}

export interface DebitRequest {
  account: string;
  etransgroup: string;
  etransid: string;
  kindid: number;
  currency: string;
  money: string;
  opcode: number;
  time: number;
  sign: string;
}

export interface DebitResponse {
  status_code: number;
  message: string;
  data?: {
    account: string;
    money: string;
    currency: string;
    balance: number;
  };
}

export interface CreditRequest {
  account: string;
  etransgroup: string;
  etransid: string;
  kindid: number;
  currency: string;
  money: string;
  opcode: number;
  time: number;
  sign: string;
}

export interface CreditResponse {
  status_code: number;
  message: string;
  data?: {
    account: string;
    money: string;
    currency: string;
    balance: number;
  };
}
