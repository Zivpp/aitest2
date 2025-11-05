export interface PlayReqContext {
    op: string;
    cp: string;
    gamcode: string;
    times: number;
    betlimit: number | {
        min: number;
        max: number;
    };
    tr: string;
    device: "ios" | "android" | "web" | "desktop" | "tablet" | string;
    useragent: string;
    siteurl: string;
    lang: string;
    currency: string;
    user: string;
    ver: string;
    req: Record<string, unknown>;
}
export interface PlayReqOperator {
    id: number;
    key: string | null;
    name: string | null;
    wallet_type: string;
    qt_level: number;
    use_splash: 0 | 1;
    result: number;
}
interface COperatorGameInfoUrls {
    member_check: string | null;
    balance: string | null;
    bet: string | null;
    result: string | null;
    cancel: string | null;
    tip: string | null;
    etc: string | null;
}
export interface COperatorGameInfo {
    op_id: number;
    op_key: string | null;
    op_name: string | null;
    load_time: number;
    wallet: string | null;
    urls: COperatorGameInfoUrls;
}
export interface StartUrl {
    funcStartUrl: string;
    strSendDataToCallbackServerUrl: string;
}
export interface GetAccount {
    account: string;
    password: string;
}
export interface PlayReqUser {
    user_key: number;
    user_id: string;
    user_id_org: string;
    user_name: string;
    user_nick: string;
    user_nick_org: string;
    op_id: number;
    cash: string;
    betskin: number;
    connect_ip: string;
    token: string | null;
    sign: string;
    version: number;
}
export {};
