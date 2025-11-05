export interface LoginPlayer {
  id: string;
  brand: string;
  currency?: string;
  mode: "FUN" | "REAL";
  is_test: boolean;
}

export interface GetBalanceAcctInfo {
  userName: string;
  currency: string;
  acctId: string;
  balance: number;
}

export interface GetBalanceResponse {
  acctInfo: GetBalanceAcctInfo;
  merchantCode: string;
  msg: string;
  code: number;
  serialNo: string;
}

export interface SpecialGame {
  type: string;
  count: number;
  sequence: number;
}

export interface TransferRequest {
  acctId: string;
  transferId: string;
  currency: string;
  amount: number;
  type: number;
  ticketId: string;
  channel: string;
  gameCode: string;
  merchantCode: string;
  serialNo: string;
  referenceId: string;
  playerId: string;
  gameFeature: string;
  transferTime: string;
  specialGame: SpecialGame;
  refTicketIds: string[]; // 注意：原本 JSON 裡是 ["120001, 120002, 120003"]，這其實是一個字串而不是 array of number
}

export interface Transfer7 {
  transferId: string; // Unique transfer Id
  acctId: string; // Player id
  currency: string; // Currency code (ISO 4217, e.g., USD, KRW, TWD)
  amount: number; // Transfer amount (>=0)
  type: number; // 7 = Bonus
  channel: string; // Web / Mobile / APP-i / APP-A / PC
  gameCode: string; // Game Code (e.g., B-FS02)
  ticketId: string; // Ticket Id
  referenceId?: string; // Optional, if no placeBet then no referenceId
  roundId?: string; // Optional, Promotion’s Id
  siteId?: string; // Optional, Client’s site Id
}

export interface TransferResponse {
  transferId: string;
  merchantCode: string;
  merchantTxId: string;
  acctId: string;
  balance: number;
  msg: string;
  code: number;
  serialNo: string;
}

export interface AccountInfo {
  userName: string;
  currency: string;
  acctId: string;
  balance: number;
}

export interface GetAcctInfoResponse {
  list: AccountInfo[];
  resultCount: number;
  pageCount: number;
  merchantCode: string;
  msg: string;
  code: number;
  serialNo: string;
}

export interface DepositResponse {
  transactionId: string;
  merchantCode: string;
  afterBalance: number;
  msg: string;
  code: number;
  serialNo: string;
}
