"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrpcClient = createGrpcClient;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
function createGrpcClient({ protoPath, packageName, serviceName, url, credentials, }) {
    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const grpcPackage = grpc.loadPackageDefinition(packageDefinition)[packageName];
    return new grpcPackage[serviceName](url, credentials || grpc.credentials.createInsecure());
}
//# sourceMappingURL=grpc.client.factory.js.map