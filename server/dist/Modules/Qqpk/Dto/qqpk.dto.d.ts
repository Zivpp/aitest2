declare class ChannelDto {
    type: string;
}
export declare class SidDto {
    channel: ChannelDto;
    sid: string;
    userId: string;
    uuid: string;
    someFakeField?: string;
}
export declare class SessionTokenDto {
    sign: string;
    key: number;
    v: number;
    id: string;
    op: string;
    c: number;
    dt: number;
    sg: string;
    bl: string | null;
    tr: string;
    update_time: number;
}
export declare class SessionDto {
    user_id: string;
    cp_key: number;
    token: SessionTokenDto;
}
export declare class GetBalanceDto {
    acctId: string;
    merchantCode?: string;
    serialNo?: string;
    gameCode?: string;
}
export declare class GetAcctInfoDto {
    acctId: string;
    pageIndex: number;
    merchantCode: string;
    serialNo: string;
}
export declare class DepositDto {
    acctId: string;
    amount: number;
    currency: string;
    merchantCode: string;
    serialNo: string;
}
export {};
