import { Injectable } from "@nestjs/common";
import { Config } from "./Config/config";

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    console.log("**********   ", process.env.MAX_USER_ID_BODY_LEN);
    const maxUserIdBodyLen = Config.MAX_USER_ID_BODY_LEN;
    console.info("**********   ", maxUserIdBodyLen);
    return "Hello World!";
  }
}
