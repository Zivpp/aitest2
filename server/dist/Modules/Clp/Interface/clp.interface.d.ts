export interface GameResponse {
    code: number;
    data: {
        balance: number;
        [key: string]: any;
    };
    msg?: string;
}
