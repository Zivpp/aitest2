export interface BalanceResponse {
    currency: string;
    cash: number;
    bonus: number;
    error: number;
    description: string;
}
export interface BetResponse {
    transactionId: number;
    currency: string;
    cash: number;
    bonus: number;
    usedPromo: number;
    error: number;
    description: string;
}
export interface ResultResponse {
    transactionId: number;
    currency: string;
    cash: number;
    bonus: number;
    error: number;
    description: string;
}
export interface RefundResponse {
    transactionId: string;
    error: number;
    description: string;
}
export interface BonusWinResponse {
    transactionId: number;
    currency: string;
    cash: number;
    bonus: number;
    error: number;
    description: string;
}
export interface JackpotWinResponse {
    transactionId: number;
    currency: string;
    cash: number;
    bonus: number;
    error: number;
    description: string;
}
export interface PromoWinResponse {
    transactionId: number;
    currency: string;
    cash: number;
    bonus: number;
    error: number;
    description: string;
}
export interface EndRoundResponse {
    cash: number;
    bonus: number;
    error: number;
    description: string;
}
