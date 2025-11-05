import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { resolve } from "path";

interface GrpcClientOptions {
  protoPath: string; // 相對或絕對路徑
  packageName: string;
  serviceName: string;
  url: string;
  credentials?: grpc.ChannelCredentials;
}

export function createGrpcClient<T = any>({
  protoPath,
  packageName,
  serviceName,
  url,
  credentials,
}: GrpcClientOptions): T {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const grpcPackage = grpc.loadPackageDefinition(packageDefinition)[
    packageName
  ] as any;
  return new grpcPackage[serviceName](
    url,
    credentials || grpc.credentials.createInsecure(),
  );
}
