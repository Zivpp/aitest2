"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const global_dto_validation_pipe_1 = require("./Global/Pipes/global.dto.validation.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        transport: microservices_1.Transport.GRPC,
        options: {
            package: "core_service",
            protoPath: (0, path_1.join)(__dirname, "../proto/core.proto"),
            url: "0.0.0.0:50051",
        },
    });
    app.useGlobalPipes(new global_dto_validation_pipe_1.GlobalDTOValidationPipe());
    process.env.APP_CONTEXT = "GRPC";
    await app.listen();
    console.log("[gRPC] service is running on port 50051");
}
bootstrap();
//# sourceMappingURL=grpc-bootstrap.js.map