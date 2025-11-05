import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { IsString, IsOptional, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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

export class GetBalanceDto {
  @IsString()
  @IsNotEmpty()
  acctId: string;

  @IsString()
  @IsOptional()
  merchantCode?: string;

  @IsString()
  @IsOptional()
  serialNo?: string;

  @IsString()
  @IsOptional()
  gameCode?: string;
}

export class GetAcctInfoDto {
  @IsString()
  acctId: string;

  @IsNumber()
  pageIndex: number;

  @IsString()
  merchantCode: string;

  @IsString()
  serialNo: string;
}

export class DepositDto {
  @IsString()
  acctId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  merchantCode: string;

  @IsString()
  serialNo: string;
}
