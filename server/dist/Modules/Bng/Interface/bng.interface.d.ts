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
export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
export interface BalanceInfo {
    value: string;
    version: number;
}
export interface GetBalanceResponse {
    uid: string;
    balance: BalanceInfo;
}
