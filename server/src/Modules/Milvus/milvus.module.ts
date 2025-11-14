import { Module } from "@nestjs/common";
import { MilvusController } from "./milvus.controller";
import { MilvusService } from "./milvus.service";
import { GoogleGenerativeAIModule } from "../GoogleGenerativeAI/google.generative.ai.module";

@Module({
    imports: [GoogleGenerativeAIModule],
    controllers: [MilvusController],
    providers: [MilvusService],
    exports: [MilvusService],
})
export class MilvusModule { }