import * as grpc from "@grpc/grpc-js";
interface GrpcClientOptions {
    protoPath: string;
    packageName: string;
    serviceName: string;
    url: string;
    credentials?: grpc.ChannelCredentials;
}
export declare function createGrpcClient<T = any>({ protoPath, packageName, serviceName, url, credentials, }: GrpcClientOptions): T;
export {};
