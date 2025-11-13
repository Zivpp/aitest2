import { Module } from "@nestjs/common";
import { ApiModule } from "src/Infrastructure/Api/api.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { ExcelController } from "./excel.controller";
import { ExcelService } from "./excel.service";
import { GoogleGenerativeAIModule } from "../GoogleGenerativeAI/google.generative.ai.module";

@Module({
  imports: [ApiModule, AccessCodeModule, GoogleGenerativeAIModule],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule { }
