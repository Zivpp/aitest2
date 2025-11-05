// provider-auth.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { Transform } from "class-transformer";

export class AuthDto {
  @ApiProperty({
    description: "供應商 ID（大小寫不敏感）",
    example: "pragmaticplay",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value,
  )
  providerId!: string;

  @ApiProperty({
    description: "驗證雜湊（32字元 16 進位 MD5 等格式）",
    example: "e1467eb30743fb0a180ed141a26c58f7",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-fA-F0-9]{32}$/, {
    message: "hash must be a 32-char hex string",
  })
  hash!: string;

  @ApiProperty({
    description: "玩家/會話 Token",
    example: "5v93mto7jr",
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  token!: string;

  @ApiProperty({
    description: "Trace ID",
    example: "1234567890",
  })
  @IsString()
  @IsOptional()
  trace?: string;
}

export class BalanceDto {
  @ApiProperty({ example: "pragmaticplay" })
  @IsString()
  providerId: string;

  @ApiProperty({ example: "421" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "b4672931ee1d78e4022faaadf58e37db" })
  @IsString()
  hash: string;
}

export class BetDto {
  @ApiProperty({ example: "spin" })
  @IsString()
  roundDetails: string;

  @ApiProperty({ example: "585c1306f89c56f5ecfc2f5d" })
  @IsString()
  reference: string;

  @ApiProperty({ example: "vs50aladdin" })
  @IsString()
  gameId: string;

  @ApiProperty({ example: 100.0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: "pragmaticplay" })
  @IsString()
  providerId: string;

  @ApiProperty({ example: "421" })
  @IsString()
  userId: string;

  @ApiProperty({ example: "5103188801" })
  @IsString()
  roundId: string;

  @ApiProperty({ example: "4a5d375ac1311b04fba2ea66d067b8e5" })
  @IsString()
  hash: string;

  @ApiProperty({ example: "1482429190374" })
  @IsString()
  timestamp: string;
}

export class ResultDto {
  @ApiProperty()
  @IsString()
  roundDetails: string;

  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  gameId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  roundId: string;

  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsInt()
  timestamp: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  promoWinAmount: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  promoWinReference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bonusCode: string;
}

export class RefundDto {
  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gameId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  roundId: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  amount: number;
}

export class BonusWinDto {
  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  bonusCode: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsInt()
  timestamp: number;
}

export class JackpotWinDto {
  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  bonusCode: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  hash: string;

  @ApiProperty()
  @IsInt()
  timestamp: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  roundId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gameId: string;
}

export class PromoWinDto {
  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  providerId: string;

  @ApiProperty()
  @IsString()
  campaignType: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsInt()
  timestamp: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  hash: string;
}

export class EndRoundDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  roundId: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
