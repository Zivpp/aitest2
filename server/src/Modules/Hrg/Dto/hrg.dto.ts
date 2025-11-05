import { IsString, Length, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceBetDto {
    @IsString()
    ts!: string;

    @IsString()
    @Length(0, 10)
    gameType!: string;

    @IsString()
    @Length(0, 20)
    gameCode!: string;

    @IsString()
    @Length(0, 50)
    userId!: string;

    @IsString()
    @Length(0, 20)
    roundId!: string;

    @IsString()
    @Length(0, 20)
    txId!: string;

    @IsString()
    tableId!: string;

    @IsString()
    betTime!: string;

    @IsString()
    betAmount!: string;

    @IsString()
    @Length(0, 20)
    category!: string;
}


export class CancelBetDto {

    /** 当前系统时间 fixed 28 chars, yyyy-MM-dd'T'HH:mm:ss.SSSZ GMT+8 */
    @IsString()
    @Length(28, 28)
    ts!: string;

    /** Reason <= 30 characters */
    @IsString()
    @Length(0, 30)
    reason!: string;

    /** User ID <= 50 characters */
    @IsString()
    @Length(0, 50)
    userId!: string;

    /** Transaction ID <= 20 characters */
    @IsString()
    @Length(0, 20)
    txId!: string;

    /** Game Type <= 10 characters */
    @IsString()
    @Length(0, 10)
    gameType!: string;

    /** Game Code <= 20 characters */
    @IsString()
    @Length(0, 20)
    gameCode!: string;
}

export class SettleDto {
    /** Current system time fixed 28 chars, yyyy-MM-dd'T'HH:mm:ss.SSSZ GMT+8 */
    @IsString()
    @Length(28, 28)
    ts!: string;

    /** Game Type <= 10 characters */
    @IsString()
    @Length(0, 10)
    gameType!: string;

    /** Game Code <= 20 characters */
    @IsString()
    @Length(0, 20)
    gameCode!: string;

    /** User ID <= 50 characters */
    @IsString()
    @Length(0, 50)
    userId!: string;

    /** Transaction ID <= 20 characters */
    @IsString()
    @Length(0, 20)
    txId!: string;

    /** Round ID <= 20 characters */
    @IsString()
    @Length(0, 20)
    roundId!: string;

    /** Bet time fixed 28 chars, yyyy-MM-dd'T'HH:mm:ss.SSSZ GMT+8 */
    @IsString()
    @Length(28, 28)
    betTime!: string;

    /** How much did user bet, decimal <= 4 (fee included if fee-type) */
    @IsString()
    betAmount!: string;

    /** Valid bet decimal <= 4 (fee included if fee-type) */
    @IsString()
    validBetAmount!: string;

    /** Payout (including betAmount) decimal <= 4 */
    @IsString()
    winAmount!: string;

    /** Round start time fixed 28 chars, yyyy-MM-dd'T'HH:mm:ss.SSSZ GMT+8 */
    @IsString()
    @Length(28, 28)
    roundStartTime!: string;

    /** Odds decimal <= 4 */
    @IsString()
    odds!: string;

    /** Game result status <= 10 characters */
    @IsString()
    @Length(0, 10)
    status!: string;

    /** Card results */
    @IsArray()
    @IsString({ each: true })
    result!: string[];

    /** Rebate decimal <= 4 (if rebate function not enabled then ignore) */
    @IsString()
    commission!: string;
}

export class EventSettleItem {
    /** Every settle's unique id <= 20 characters */
    @IsString()
    settleId!: string;

    /** Event ID <= 60 characters */
    @IsString()
    eventId!: string;

    /** User ID <= 50 characters */
    @IsString()
    userId!: string;

    /** How much did user win decimal places <= 4 */
    @IsString()
    amount!: string;

    /** create time fixed 28 characters yyyy-MM-dd'T'HH:mm:ss.SSSZ GMT+8 */
    @IsString()
    createTime!: string;
}

export class EventSettleDto {
    /** Current system time fixed 28 chars yyyy-MM-dd'T'HH:mm:ss.SSSZ GMT+8 */
    @IsString()
    ts!: string;

    /** settles array of objects */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EventSettleItem)
    settles!: EventSettleItem[];
}


