import { Module } from "@nestjs/common";
import { ApiModule } from "src/Infrastructure/Api/api.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { GoogleGenerativeAIController } from "./google.generative.ai.controller";
import { GoogleGenerativeAIService } from "./google.generative.ai.service";


@Module({
  imports: [ApiModule, AccessCodeModule],
  controllers: [GoogleGenerativeAIController],
  providers: [GoogleGenerativeAIService],
  exports: [GoogleGenerativeAIService],
})
export class GoogleGenerativeAIModule { }
