declare class PromoOriginDto {
    type: string;
}
declare class JackpotDto {
    id: string;
    winAmount: number;
}
declare class PromoTransactionDto {
    type: string;
    id: string;
    amount: number;
    voucherId?: string;
    remainingRounds?: number;
    playableBalance?: number;
    bonusConfigId?: string;
    rewardId?: string;
    jackpots?: JackpotDto[];
    origin?: PromoOriginDto;
    instanceCode?: string;
    instanceId?: number;
    campaignCode?: string;
    campaignId?: number;
    reason?: string;
}
declare class TableDto {
    id: string;
    vid: string | null;
}
declare class GameDetailsDto {
    table: TableDto;
}
declare class GameDto {
    id: string;
    type: string;
    details: GameDetailsDto;
}
export declare class PromoPayoutDto {
    sid: string;
    userId: string;
    currency: string;
    uuid: string;
    game?: GameDto | null;
    promoTransaction: PromoTransactionDto;
}
export {};
