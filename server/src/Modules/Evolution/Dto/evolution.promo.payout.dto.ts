import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsInt,
  IsDefined,
} from "class-validator";
import { Type } from "class-transformer";

enum PromoType {
  FreeRoundPlayableSpent = "FreeRoundPlayableSpent",
  JackpotWin = "JackpotWin",
  RewardGamePlayableSpent = "RewardGamePlayableSpent",
  RewardGameWinCapReached = "RewardGameWinCapReached",
  RewardGameMinBetLimitReached = "RewardGameMinBetLimitReached",
  RtrMonetaryReward = "RtrMonetaryReward",
  SmartTournamentMonetaryReward = "SmartTournamentMonetaryReward",
  SmartSpinsMonetaryReward = "SmartSpinsMonetaryReward",
  CashReward = "CashReward",
}

class PromoOriginDto {
  @IsString()
  type: string;
}

class JackpotDto {
  @IsString()
  id: string;

  @IsNumber()
  winAmount: number;
}

class PromoTransactionDto {
  @IsString()
  type: string;

  @IsString()
  id: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  voucherId?: string;

  @IsOptional()
  @IsInt()
  remainingRounds?: number;

  @IsOptional()
  @IsNumber()
  playableBalance?: number;

  @IsOptional()
  @IsString()
  bonusConfigId?: string;

  @IsOptional()
  @IsString()
  rewardId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JackpotDto)
  jackpots?: JackpotDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PromoOriginDto)
  origin?: PromoOriginDto;

  @IsOptional()
  @IsString()
  instanceCode?: string;

  @IsOptional()
  @IsInt()
  instanceId?: number;

  @IsOptional()
  @IsString()
  campaignCode?: string;

  @IsOptional()
  @IsInt()
  campaignId?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}

class TableDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  vid: string | null;
}

class GameDetailsDto {
  @ValidateNested()
  @Type(() => TableDto)
  table: TableDto;
}

class GameDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => GameDetailsDto)
  details: GameDetailsDto;
}

export class PromoPayoutDto {
  @IsString()
  sid: string;

  @IsString()
  userId: string;

  @IsString()
  currency: string;

  @IsUUID()
  uuid: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GameDto)
  game?: GameDto | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => PromoTransactionDto)
  promoTransaction: PromoTransactionDto;
}
