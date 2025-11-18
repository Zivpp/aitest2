import { Module } from "@nestjs/common";
import { LineController } from "./line.controller";
import { LineService } from "./line.service";
import { ApiModule } from "src/Infrastructure/Api/api.module";
import { MilvusModule } from "../Milvus/milvus.module";
import { GoogleGenerativeAIModule } from "../GoogleGenerativeAI/google.generative.ai.module";
import { ExcelModule } from "../Excel/excel.module";
import { RedisModule } from "src/Infrastructure/Redis/redis.module";

@Module({
  imports: [ApiModule, MilvusModule, GoogleGenerativeAIModule, ExcelModule, RedisModule],
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule { }
