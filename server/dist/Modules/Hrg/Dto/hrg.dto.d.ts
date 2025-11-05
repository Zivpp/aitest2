export declare class PlaceBetDto {
    ts: string;
    gameType: string;
    gameCode: string;
    userId: string;
    roundId: string;
    txId: string;
    tableId: string;
    betTime: string;
    betAmount: string;
    category: string;
}
export declare class CancelBetDto {
    ts: string;
    reason: string;
    userId: string;
    txId: string;
    gameType: string;
    gameCode: string;
}
export declare class SettleDto {
    ts: string;
    gameType: string;
    gameCode: string;
    userId: string;
    txId: string;
    roundId: string;
    betTime: string;
    betAmount: string;
    validBetAmount: string;
    winAmount: string;
    roundStartTime: string;
    odds: string;
    status: string;
    result: string[];
    commission: string;
}
export declare class EventSettleItem {
    settleId: string;
    eventId: string;
    userId: string;
    amount: string;
    createTime: string;
}
export declare class EventSettleDto {
    ts: string;
    settles: EventSettleItem[];
}
