export interface AccountResponse<T = any> {
    result: number | null;
    msg: string;
    data: T;
}
export interface CreateAccountResponse {
    result: number;
    msg: string;
    data: CreateAccountData;
}
export interface CreateAccountData {
    id: string;
    nick: string;
    betskin: string;
}
export interface ProvListResponse {
    result: number;
    msg: string;
    data: ProvListData;
    ver: number;
}
export interface ProvListData {
    list: ProvListItem[];
}
export interface ProvListItem {
    code: number;
    name: string;
    type: "slot" | "live";
}
export interface GameListResponse {
    result: number;
    msg: string;
    ver: number;
    data: {
        list: GameListItem[];
    };
}
export interface GameListItem {
    id?: number;
    date?: string;
    code: number;
    name_eng: string;
    name_kor: string;
    type: string;
    table: {
        type: string;
        is_lobby: boolean;
    };
    is_desktop: boolean;
    is_mobile: boolean;
    img_1: string;
}
export interface TablelistResponse {
    result: number;
    msg: string;
    data: {
        list: TableItem[];
    } | null;
}
export interface TableItem {
    [key: string]: string;
}
export interface PlayResponse {
    result: number;
    msg: string;
    data: {
        link: string;
    };
}
export interface Operator {
    _RESULT: number;
    id: number;
    name: string;
    key: string;
    wallet_type: string;
    qt_level: number;
    use_splash: number;
}
export interface CurrentRResponse {
    result: number;
    msg: string;
    ver: number;
    data: {
        r: number;
    };
}
export interface Top30Item {
    rank: number;
    thirdpartycode: string;
    thirdpartyname: string;
    code: string;
    name: string;
    img: string;
}
export interface Top30Data {
    list: Top30Item[];
}
export interface Top30Response {
    result: number;
    msg: string;
    data: Top30Data;
}
export interface LogGetData {
    link: string;
}
export interface LogGetResponse {
    result: number;
    msg: string;
    data: LogGetData;
}
export interface LogGetDto {
    opkey: number;
    roundid: string;
    hash: string;
}
