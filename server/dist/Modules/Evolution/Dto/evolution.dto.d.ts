export declare class sessionTokenDto {
    key: number;
    v: number;
    id: string;
    op: number;
    c: number;
    dt: number;
    sg: string;
    bl: string | null;
    tr: string;
    update_time: number;
}
export declare class sessionDto {
    user_id: string;
    cp_key: number;
    token: sessionTokenDto;
}
export declare class CheckDto {
    userId: string;
    sid: string;
    channel: {
        type: {
            type: string;
        };
    };
    uuid: string;
}
export declare class BalanceDto {
    sid: string;
    userId: string;
    game: BalanceGame | null;
    currency: string;
    uuid: string;
}
export interface BalanceGame {
    id: string | null;
    type: string;
    details: {
        table: {
            id: string;
            vid: string;
        };
    };
}
declare class DebitTableDetailsDto {
    id: string;
    vid: string | null;
}
declare class DebitGameDetailsDto {
    table: DebitTableDetailsDto;
}
declare class DebitBetDto {
    code: string;
    amount: number;
}
declare class DebitTransactionDto {
    id: string;
    refId: string;
    amount: number;
    bets?: DebitBetDto[];
}
declare class DebitGameDto {
    id: string;
    type: string;
    details: DebitGameDetailsDto;
}
export declare class DebitDto {
    sid: string;
    userId: string;
    currency: string;
    transaction: DebitTransactionDto;
    uuid: string;
    game: DebitGameDto;
}
declare class TableDetailsDto {
    id: string;
    vid: string | null;
}
declare class GameDetailsDto {
    table: TableDetailsDto;
}
declare class GameDto {
    id: string;
    type: string;
    details: GameDetailsDto;
}
declare class BetDto {
    code: string;
    payoff: number;
}
declare class TransactionDto {
    id: string;
    refId: string;
    amount: number;
    bets?: BetDto[];
}
export declare class CreditDto {
    sid: string;
    userId: string;
    currency: string;
    game: GameDto;
    transaction: TransactionDto;
    uuid: string;
}
declare class CancelGameDetailsDto {
    table: TableDetailsDto;
}
declare class CancelGameDto {
    id: string;
    type: string;
    details: CancelGameDetailsDto;
}
declare class CancelBetDto {
    code: string;
    amount: number;
}
declare class CancelTransactionDto {
    id: string;
    refId: string;
    amount: number;
    bets?: CancelBetDto[];
}
export declare class CancelDto {
    sid: string;
    userId: string;
    currency: string;
    game: CancelGameDto;
    transaction: CancelTransactionDto;
    uuid: string;
}
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
export {};
