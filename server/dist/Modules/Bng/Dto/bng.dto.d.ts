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
export declare class PlayerDto {
    id: string;
    currency: string;
    mode: "FUN" | "REAL";
    is_test: boolean;
    brand: string;
}
export declare class BonusDto {
    campaign: string;
    source: string;
    bonus_id: number;
    ext_bonus_id: string;
    bonus_type: string;
    event: string;
    start_date: string;
    end_date: string;
    total_bet: string;
    total_win: string;
    played_bet: string;
    played_win: string;
    status: string;
}
export declare class ArgsDto {
    action?: string;
    bet?: string | null;
    win?: string | null;
    round_started?: boolean;
    round_finished?: boolean;
    round_id?: string;
    transaction_uid?: string;
    bonus?: BonusDto | null;
    player?: PlayerDto;
    tag?: string;
}
export declare class HandleRawDto {
    name: string;
    uid: string;
    token: string;
    session: string;
    game_id: string;
    game_name: string;
    provider_id: string;
    provider_name: string;
    c_at: string;
    sent_at: string;
    args: ArgsDto;
}
export {};
