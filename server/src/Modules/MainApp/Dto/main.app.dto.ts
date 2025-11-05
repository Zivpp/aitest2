import { Optional } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsIn, IsIP, IsNumber, IsOptional, IsString } from "class-validator";

export class AccountDto {
  @IsString()
  opkey: string; // operator key

  @IsString()
  userid: string; // user id

  @IsString()
  hash: string; // hash
}

export class HashDto {
  @IsString()
  opkey: string; // 오퍼레이터 키

  @IsString()
  hash: string; // hash
}

export class CreateAccountDto {
  @IsString()
  opkey: string; // 오퍼레이터 키

  @IsString()
  userid: string; // 회원 아이디

  @IsString()
  nick: string; // 회원 닉네임

  @IsString()
  bet_skin_group: string; // 백오피스에서 설정한 유저의 벳 스킨 그룹 값

  @IsString()
  hash: string; // HASH
}

export class ProvlistDto {
  @IsString()
  opkey: string; // 오퍼레이터 키

  @IsString()
  hash: string; // HASH
}

export class GamelistDto {
  @IsString()
  opkey: string; // 오퍼레이터 키

  @IsString()
  thirdpartycode: string; // 게임사 코드

  @IsString()
  hash: string; // HASH

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  use_tabletype?: number; // use table type
}

export class TablelistDto {
  @IsString()
  opkey: string; // 오퍼레이터 키

  @IsString()
  thirdpartycode: string; // 게임사 코드

  @IsString()
  hash: string; // HASH
}

export class PlayDto {
  @IsString()
  opkey: string; // 오퍼레이터 키

  @IsString()
  userid: string; // 회원 ID

  @IsString()
  thirdpartycode: string; // 게임사 코드

  @IsString()
  gamecode: string; // 게임 코드

  @IsString()
  @IsIn(["PC", "MOBILE"])
  platform: string; // 실행 플랫폼

  @IsString()
  @IsIP()
  ip: string; // 회원 디바이스 IP

  @IsOptional()
  @IsString()
  bet_skin_group?: string; // 벳스킨 그룹 값

  @IsOptional()
  @IsIn(["ko", "en"])
  lang?: string; // 언어설정 (기본 ko)

  @IsString()
  hash: string; // HASH

  @IsString()
  @Optional()
  gameid?: string; // 게임 ID

  @IsString()
  @Optional()
  currency?: string; // 화폐

  @IsNumber()
  @Optional()
  bet_limit?: number; // 베팅 제한
}
