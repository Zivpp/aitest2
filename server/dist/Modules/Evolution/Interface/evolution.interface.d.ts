import { CheckDto } from "../Dto/evolution.dto";
export interface SessionContext extends CheckDto {
    tokenObj: any;
    hasToken: boolean;
    isFallbackToken: boolean;
    newToken?: string;
}
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
    status: string;
    balance: number | null;
    bonus: number;
    uuid: string;
}
export interface CancelResponse {
    status: string;
    balance: number | null;
    bonus: number;
    uuid: string;
}
export interface PromoPayoutResponse {
    status: string;
    balance: number;
    bonus: number;
    uuid: string;
}
export interface EvolutionDebitCheck {
    isEnd: boolean;
}
