import { Inject, Injectable } from "@nestjs/common";
import {
  ProcessReply,
  ProcessRequest,
} from "./Interface/core.service.interface";

@Injectable()
export class CoreGrpcService {
  constructor(
    @Inject("CORE_GRPC_CLIENT")
    private readonly coreClient: any,
  ) {}

  // async say(data: ProcessRequest): Promise<ProcessReply> {
  //     return new Promise((resolve, reject) => {
  //         // console.info('[processCall] data:', data);
  //         this.coreClient.ProcessCall(data, (err, response) => {
  //             if (err) {
  //                 console.error('[say] gRPC Error:', err.message || err);
  //                 return reject(new Error(`gRPC error: ${err.message || err}`));
  //             }

  //             if (!response) {
  //                 return reject(new Error('gRPC response is empty'));
  //             }

  //             return resolve(response);
  //         });
  //     });
  // }

  /**
   * gRPC call
   * @param data ProcessRequest
   * @returns ProcessReply
   */
  async processCall(data: ProcessRequest): Promise<ProcessReply> {
    console.info("*[gRPC][processCall] Request = ");
    console.info(data);
    return new Promise((resolve, reject) => {
      // console.info('[processCall] data:', data);
      this.coreClient.ProcessCall(data, (err, response) => {
        if (err) {
          console.error("[gRPC][processCall] ERROR :", err.message || err);
          return reject(new Error(`${err.message || err}`));
        }

        if (!response) {
          return reject(new Error("[gRPC][processCall] Response is empty"));
        }

        console.info("*[gRPC][processCall] Response = ");
        console.info(response);

        return resolve(response);
      });
    });
  }
}
