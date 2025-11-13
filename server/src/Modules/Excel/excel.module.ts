import { Module } from "@nestjs/common";
import { ApiModule } from "src/Infrastructure/Api/api.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";
import { ExcelController } from "./excel.controller";
import { ExcelService } from "./excel.service";


@Module({
  imports: [ApiModule, AccessCodeModule],
  controllers: [ExcelController],
  providers: [ExcelService],
})
export class ExcelModule { }
