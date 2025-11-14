import { Module } from "@nestjs/common";
import { MilvusController } from "./milvus.controller";
import { MilvusService } from "./milvus.service";

@Module({
    imports: [],
    controllers: [MilvusController],
    providers: [MilvusService],
    exports: [MilvusService],
})
export class MilvusModule { }