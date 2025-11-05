export declare class AuthDto {
    providerId: string;
    hash: string;
    token: string;
    trace?: string;
}
export declare class BalanceDto {
    providerId: string;
    userId: string;
    hash: string;
}
export declare class BetDto {
    roundDetails: string;
    reference: string;
    gameId: string;
    amount: number;
    providerId: string;
    userId: string;
    roundId: string;
    hash: string;
    timestamp: string;
}
export declare class ResultDto {
    roundDetails: string;
    reference: string;
    gameId: string;
    amount: number;
    providerId: string;
    userId: string;
    roundId: string;
    platform: string;
    hash: string;
    timestamp: number;
    promoWinAmount: string;
    promoWinReference: string;
    bonusCode: string;
}
export declare class RefundDto {
    reference: string;
    providerId: string;
    userId: string;
    platform: string;
    hash: string;
    gameId: string;
    roundId: string;
    amount: number;
}
export declare class BonusWinDto {
    reference: string;
    bonusCode: string;
    amount: number;
    providerId: string;
    userId: string;
    hash: string;
    timestamp: number;
}
export declare class JackpotWinDto {
    reference: string;
    bonusCode: string;
    amount: number;
    providerId: string;
    userId: string;
    hash: string;
    timestamp: number;
    roundId: string;
    gameId: string;
}
export declare class PromoWinDto {
    reference: string;
    campaignId: string;
    amount: number;
    providerId: string;
    campaignType: string;
    userId: string;
    timestamp: number;
    currency: string;
    hash: string;
}
export declare class EndRoundDto {
    gameId: string;
    providerId: string;
    userId: string;
    roundId: string;
    platform: string;
    hash: string;
}
