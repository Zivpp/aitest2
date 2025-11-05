import { createGrpcClient } from "./grpc.client.factory";
import * as grpc from "@grpc/grpc-js";
import * as fs from "fs";
import { join, resolve } from "path";
import { Config } from "src/Config/config";

export const CoreGrpcClientProvider = {
  provide: "CORE_GRPC_CLIENT",
  useFactory: () => {
    // const caCert = fs.readFileSync(join(process.cwd(), `assets/ca.${Config.CONFIG_NAME}.crt`));
    const caCert = Buffer.from(Config.CA_CERT_PEM);
    const credentials = grpc.credentials.createSsl(caCert);
    // const credentials = grpc.credentials.createInsecure();
    const host = Config.GRPC_SERVER_HOST || "localhost:50051";

    // console.info(' `assets/ca.${Config.CONFIG_NAME}.crt` path >>>>>>>>', `assets/ca.${Config.CONFIG_NAME}.crt`)
    // console.info('host >>>>>>>>> ', host);

    return createGrpcClient({
      protoPath: resolve(__dirname, "../../../proto/core.proto"),
      packageName: "core_service",
      serviceName: "CoreService",
      url: host,
      credentials,
    });
  },
};
