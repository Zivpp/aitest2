import { Module } from "@nestjs/common";
import { ApiModule } from "src/Infrastructure/Api/api.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { ExcelController } from "./excel.controller";
import { ExcelService } from "./excel.service";
import { GoogleGenerativeAIModule } from "../GoogleGenerativeAI/google.generative.ai.module";
import { MilvusModule } from "../Milvus/milvus.module";

@Module({
  imports: [ApiModule, AccessCodeModule, GoogleGenerativeAIModule, MilvusModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule { }
