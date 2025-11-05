export declare class AccountDto {
    opkey: string;
    userid: string;
    hash: string;
}
export declare class HashDto {
    opkey: string;
    hash: string;
}
export declare class CreateAccountDto {
    opkey: string;
    userid: string;
    nick: string;
    bet_skin_group: string;
    hash: string;
}
export declare class ProvlistDto {
    opkey: string;
    hash: string;
}
export declare class GamelistDto {
    opkey: string;
    thirdpartycode: string;
    hash: string;
    use_tabletype?: number;
}
export declare class TablelistDto {
    opkey: string;
    thirdpartycode: string;
    hash: string;
}
export declare class PlayDto {
    opkey: string;
    userid: string;
    thirdpartycode: string;
    gamecode: string;
    platform: string;
    ip: string;
    bet_skin_group?: string;
    lang?: string;
    hash: string;
    gameid?: string;
    currency?: string;
    bet_limit?: number;
}
