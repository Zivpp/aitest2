import { Module } from "@nestjs/common";
import { LineController } from "./line.controller";
import { LineService } from "./line.service";
import { ApiModule } from "src/Infrastructure/Api/api.module";
import { AccessCodeModule } from "src/Global/Service/access.code.module";


@Module({
  imports: [ApiModule, AccessCodeModule],
  controllers: [LineController],
  providers: [LineService],
})
export class LineModule { }
