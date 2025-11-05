import { Body, Controller, Get, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import apiPath from "../../Config/api.path";
import { GrpcMethod } from "@nestjs/microservices";

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post(apiPath.grpc.game.clientCallingTest)
  async grpcClientCallingTest(@Body() body: any): Promise<any> {
    // do anything you want here

    return this.gameService.callGrpcProcessCall(body);
  }

  @GrpcMethod("CoreService", "ProcessCall") // Service 名 + Method 名，與 proto 對應
  processCall(data: any, metadata: any): any {
    console.info("***** [gRPC] response *****：");
    console.info(data);

    // do anything you want here

    // 回傳格式需符合 proto 的 ProcessReply
    return {
      result: {
        result: 1,
        balance: 100.5,
        time: new Date().toISOString(),
        round_id: "round123",
        trans_id: "tx123",
        error_msg: "",
      },
      error: null,
    };
  }
}
