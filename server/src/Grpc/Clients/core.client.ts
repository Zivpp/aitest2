import path, { join, resolve } from "path";
import { createGrpcClient } from "./grpc.client.factory";
import * as grpc from "@grpc/grpc-js";
import * as fs from "fs";
import { Config } from "src/Config/config";

// 不同 proto 就註冊不同 proto client
// 프로토가 다르면 각각 다른 프로토 클라이언트를 등록합니다.

// core proto client
// const caCert = fs.readFileSync(join(process.cwd(), `assets/ca.${Config.CONFIG_NAME}.crt`));
const caCert = Buffer.from(Config.CA_CERT_PEM);
// 建立 gRPC channel credentials（單向 TLS）
const credentials = grpc.credentials.createSsl(caCert);

// console.info('[old] `assets/ca.${Config.CONFIG_NAME}.crt` path >>>>>>>>', `assets/ca.${Config.CONFIG_NAME}.crt`)
// console.info('[old] host >>>>>>>>> ', Config.GRPC_SERVER_HOST);

export const coreServiceClient = createGrpcClient({
  protoPath: resolve(__dirname, "../../../proto/core.proto"),
  packageName: "core_service",
  serviceName: "CoreService",
  url: Config.GRPC_SERVER_HOST || "localhost:50051",
  credentials,
});
