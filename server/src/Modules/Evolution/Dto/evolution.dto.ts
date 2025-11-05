import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

// Session Token Dto
export class sessionTokenDto {
  @ApiProperty({ description: "使用者金鑰", example: 3399999 })
  @IsNumber()
  key: number;

  @ApiProperty({ description: "使用版本", example: 1 })
  @IsNumber()
  v: number;

  @ApiProperty({ description: "使用者 ID", example: "kim9999" })
  @IsString()
  id: string;

  @ApiProperty({ description: "操作員 ID", example: 3333 })
  @IsNumber()
  op: number;

  @ApiProperty({ description: "遊戲公司代碼", example: 101 })
  @IsNumber()
  c: number;

  @ApiProperty({
    description: "遊戲執行時間 (timestamp)",
    example: 1753109748788,
  })
  @IsNumber()
  dt: number;

  @ApiProperty({
    description: "遊戲啟動令牌",
    example: "b472d1484f2146e2846ebe9b8da011e2",
  })
  @IsString()
  sg: string;

  @ApiProperty({
    description: "賭率限制，可為 null",
    example: null,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  bl: string | null;

  @ApiProperty({ description: "記錄追蹤代碼 (trace)", example: "abc123xyz" })
  @IsString()
  tr: string;

  @ApiProperty({ description: "更新時間 (timestamp)", example: 1753109748788 })
  @IsNumber()
  update_time: number;
}

// Session Dto
export class sessionDto {
  @ApiProperty({ description: "使用者帳號", example: "bl2_kim9999" })
  @IsString()
  user_id: string;

  @ApiProperty({ description: "遊戲公司代碼", example: 101 })
  @IsNumber()
  cp_key: number;

  @ApiProperty({ description: "使用者 token 物件", type: sessionTokenDto })
  @IsNotEmpty()
  token: sessionTokenDto;
}

// Check Dto
export class CheckDto {
  @ApiProperty({
    title: "player id",
    example: "todo",
    description:
      "Player’s ID which is sent by Licensee in UserAuthentication call(player.id)",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    title: "session ID",
    example: "todo",
    description: "Player’s session ID",
    required: true,
  })
  @IsString()
  sid: string;

  @ApiProperty({
    title: "channel",
    example: "todo",
    description: "Object containing channel details",
    required: true,
  })
  @IsObject()
  @IsNotEmpty()
  channel: {
    type: {
      type: string; // Player’s device type a.k.a.channel type.Can be either M(mobile) or P(anything else).
    };
  };

  @ApiProperty({
    title: "uuid",
    example: "todo",
    description: "Unique request Id, that identifies CheckUserRequest",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

// Balance Dto
export class BalanceDto {
  @ApiProperty({
    title: "session ID",
    example: "sid-parameter-from-UserAuthentication-call",
    description: "Player’s session ID",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  sid: string;

  @ApiProperty({
    title: "player id",
    example: "euID-parameter-from-UserAuthentication-call",
    description:
      "Player’s ID which is sent by Licensee in UserAuthentication call(player.id)",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    title: "game",
    example:
      'null or {"id":null,"type":"blackjack","details":{"table":{"id":"aaabbbcccdddeee111","vid":"aaabbbcccdddeee111"}}}',
    description: "Player’s game",
    required: true,
  })
  @IsObject()
  @IsOptional()
  game: BalanceGame | null;

  @ApiProperty({
    title: "currency",
    example: "EUR",
    description: "Player’s currency",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    title: "uuid",
    example: "ce186440-ed92-11e3-ac10-0800200c9a66",
    description: "Unique request Id, that identifies CheckUserRequest",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
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

// Debit Dto
class DebitTableDetailsDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  vid: string | null;
}

class DebitGameDetailsDto {
  @ValidateNested()
  @Type(() => DebitTableDetailsDto)
  table: DebitTableDetailsDto;
}

class DebitBetDto {
  @IsString()
  code: string;

  @IsNumber()
  amount: number;
}

class DebitTransactionDto {
  @IsString()
  id: string;

  @IsString()
  refId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DebitBetDto)
  bets?: DebitBetDto[];
}

class DebitGameDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => DebitGameDetailsDto)
  details: DebitGameDetailsDto;
}

export class DebitDto {
  @IsString()
  sid: string;

  @IsString()
  userId: string;

  @IsString()
  currency: string;

  @ValidateNested()
  @Type(() => DebitTransactionDto)
  transaction: DebitTransactionDto;

  @IsString()
  uuid: string;

  @ValidateNested()
  @Type(() => DebitGameDto)
  game: DebitGameDto;
}

class TableDetailsDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  vid: string | null;
}

class GameDetailsDto {
  @ValidateNested()
  @Type(() => TableDetailsDto)
  table: TableDetailsDto;
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

class BetDto {
  @IsString()
  code: string;

  @IsNumber()
  payoff: number;
}

class TransactionDto {
  @IsString()
  id: string;

  @IsString()
  refId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @Transform(({ value }) => value || [])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BetDto)
  bets?: BetDto[];
}

export class CreditDto {
  @IsString()
  sid: string;

  @IsString()
  userId: string;

  @IsString()
  currency: string;

  @ValidateNested()
  @Type(() => GameDto)
  game: GameDto;

  @ValidateNested()
  @Type(() => TransactionDto)
  transaction: TransactionDto;

  @IsUUID()
  uuid: string;
}

class CancelTableDetailsDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  vid: string | null;
}

class CancelGameDetailsDto {
  @ValidateNested()
  @Type(() => TableDetailsDto)
  table: TableDetailsDto;
}

class CancelGameDto {
  @IsString()
  id: string;

  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => CancelGameDetailsDto)
  details: CancelGameDetailsDto;
}

class CancelBetDto {
  @IsString()
  code: string;

  @IsNumber()
  amount: number;
}

class CancelTransactionDto {
  @IsString()
  id: string;

  @IsString()
  refId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @Transform(({ value }) => value || [])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CancelBetDto)
  bets?: CancelBetDto[];
}

export class CancelDto {
  @IsString()
  sid: string;

  @IsString()
  userId: string;

  @IsString()
  currency: string;

  @ValidateNested()
  @Type(() => CancelGameDto)
  game: CancelGameDto;

  @ValidateNested()
  @Type(() => CancelTransactionDto)
  transaction: CancelTransactionDto;

  @IsUUID()
  uuid: string;
}

class ChannelDto {
  @IsString()
  type: string;
}

export class SidDto {
  @ValidateNested()
  @Type(() => ChannelDto)
  channel: ChannelDto;

  @IsString()
  sid: string;

  @IsString()
  userId: string;

  @IsString()
  uuid: string;

  @IsOptional()
  @IsString()
  someFakeField?: string; // 這個是額外欄位，可以不傳
}
