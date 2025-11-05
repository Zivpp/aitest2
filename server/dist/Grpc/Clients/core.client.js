"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreServiceClient = void 0;
const path_1 = require("path");
const grpc_client_factory_1 = require("./grpc.client.factory");
const grpc = require("@grpc/grpc-js");
const config_1 = require("../../Config/config");
const caCert = Buffer.from(config_1.Config.CA_CERT_PEM);
const credentials = grpc.credentials.createSsl(caCert);
exports.coreServiceClient = (0, grpc_client_factory_1.createGrpcClient)({
    protoPath: (0, path_1.resolve)(__dirname, "../../../proto/core.proto"),
    packageName: "core_service",
    serviceName: "CoreService",
    url: config_1.Config.GRPC_SERVER_HOST || "localhost:50051",
    credentials,
});
//# sourceMappingURL=core.client.js.map