import { Injectable } from "@nestjs/common";
import { coreServiceClient } from "../../Grpc/Clients/core.client";

@Injectable()
export class GameService {
  getHello(): string {
    return "Hello World!";
  }

  async callGrpcProcessCall(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      coreServiceClient.ProcessCall(data, (err, response) => {
        if (err) {
          console.error("gRPC Error:", err);
          return reject(err);
        }
        return resolve(response);
      });
    });
  }
}
