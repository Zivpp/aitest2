"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreGrpcClientProvider = void 0;
const grpc_client_factory_1 = require("./grpc.client.factory");
const grpc = require("@grpc/grpc-js");
const path_1 = require("path");
const config_1 = require("../../Config/config");
exports.CoreGrpcClientProvider = {
    provide: "CORE_GRPC_CLIENT",
    useFactory: () => {
        const caCert = Buffer.from(config_1.Config.CA_CERT_PEM);
        const credentials = grpc.credentials.createSsl(caCert);
        const host = config_1.Config.GRPC_SERVER_HOST || "localhost:50051";
        return (0, grpc_client_factory_1.createGrpcClient)({
            protoPath: (0, path_1.resolve)(__dirname, "../../../proto/core.proto"),
            packageName: "core_service",
            serviceName: "CoreService",
            url: host,
            credentials,
        });
    },
};
//# sourceMappingURL=core.grpc.client.provider.js.map