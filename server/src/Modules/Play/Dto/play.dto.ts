import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

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
