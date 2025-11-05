import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  isNotEmpty,
  IsBoolean,
  IsInt,
  IsDateString,
  ValidateNested,
  IsNumberString,
} from "class-validator";

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

// Session Token Dto
export class SessionTokenDto {
  @ApiProperty({ description: "sign", example: "xxxxx" })
  @IsString()
  sign: string;

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
  op: string;

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
export class SessionDto {
  @ApiProperty({ description: "使用者帳號", example: "bl2_kim9999" })
  @IsString()
  user_id: string;

  @ApiProperty({ description: "遊戲公司代碼", example: 101 })
  @IsNumber()
  cp_key: number;

  @ApiProperty({ description: "使用者 token 物件", type: SessionTokenDto })
  @IsNotEmpty()
  token: SessionTokenDto;
}

export class PlayerDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currency: string;

  @ApiProperty({ enum: ["FUN", "REAL"] })
  @IsOptional()
  @IsString()
  mode: "FUN" | "REAL";

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_test: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  brand: string;
}

export class BonusDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  campaign: string;

  @ApiProperty({ enum: ["OPERATOR", "PROVIDER"] })
  @IsOptional()
  @IsString()
  source: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  bonus_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ext_bonus_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bonus_type: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  event: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  start_date: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  end_date: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  total_bet: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  total_win: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  played_bet: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  played_win: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status: string;
}

export class ArgsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: "decimal string or null",
  })
  @IsOptional()
  @IsString()
  bet?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: "decimal string or null",
  })
  @IsOptional()
  @IsString()
  win?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  round_started?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  round_finished?: boolean;

  // 用字串承載 biginteger；傳 1 也會被 class-validator 當成 "1" 檢查
  @ApiProperty({ required: false, description: "biginteger as string" })
  @IsOptional()
  @IsNumberString()
  round_id?: string;

  // rollback 會使用
  @ApiProperty({
    required: false,
    description: "ID of the transaction to be rolled back",
  })
  @IsOptional()
  @IsString()
  transaction_uid?: string;

  @ApiProperty({ type: BonusDto, required: false, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => BonusDto)
  bonus?: BonusDto | null;

  @ApiProperty({ type: PlayerDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PlayerDto)
  player?: PlayerDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tag?: string;
}

export class HandleRawDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  token: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  session: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  game_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  game_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  provider_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  provider_name: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  c_at: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  sent_at: string;

  @ApiProperty({ type: ArgsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArgsDto)
  args: ArgsDto;
}
