"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const global_guard_1 = require("./Global/Guards/global.guard");
const global_dto_validation_pipe_1 = require("./Global/Pipes/global.dto.validation.pipe");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new global_dto_validation_pipe_1.GlobalDTOValidationPipe());
    app.useGlobalGuards(app.get(global_guard_1.AuthGuard));
    app.use(helmet_1.default.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "https://fonts.googleapis.com"],
        },
    }));
    app.use(cookieParser());
    app.enableCors({
        origin: ["http://localhost:3000"],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("API 文件")
        .setDescription("這是自動生成的 Swagger API 文件")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("swagger", app, document);
    app.use((0, express_1.json)({
        verify: (req, _res, buf) => {
            req.rawBody = Buffer.from(buf);
        },
    }));
    app.use((0, express_1.urlencoded)({
        extended: true,
        verify: (req, _res, buf) => {
            req.rawBody = Buffer.from(buf);
        },
    }));
    process.env.APP_CONTEXT = "HTTP";
    const server = await app.listen(process.env.APP_PORT ?? 3000);
    server.keepAliveTimeout = 60 * 1000;
    server.headersTimeout = 65 * 1000;
}
bootstrap();
//# sourceMappingURL=main.js.map