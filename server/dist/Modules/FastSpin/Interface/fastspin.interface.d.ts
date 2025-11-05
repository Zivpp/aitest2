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
    refTicketIds: string[];
}
export interface Transfer7 {
    transferId: string;
    acctId: string;
    currency: string;
    amount: number;
    type: number;
    channel: string;
    gameCode: string;
    ticketId: string;
    referenceId?: string;
    roundId?: string;
    siteId?: string;
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
