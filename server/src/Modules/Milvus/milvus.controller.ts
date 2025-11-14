import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { MilvusService } from "./milvus.service";

@Controller('milvus')
export class MilvusController {
    constructor(
        private readonly milvusService: MilvusService
    ) { }

    @Post('getEmbedding')
    async getEmbedding(@Req() req, @Res() res, @Body() body) {
        const { target } = body;
        const result = await this.milvusService.getEmbedding(target);
        return res.send(result);
    }

    @Post('createCollection')
    async createCollection(@Req() req, @Res() res, @Body() body) {
        const { collectionName, fields } = body;
        const result = await this.milvusService.createCollection(collectionName, fields);
        return res.send(result);
    }

    @Post('dropCollection')
    async dropCollection(@Req() req, @Res() res, @Body() body) {
        const { collectionName } = body;
        const result = await this.milvusService.dropCollection(collectionName);
        return res.send(result);
    }

    @Post('dropPartition')
    async dropPartition(@Req() req, @Res() res, @Body() body) {
        const { collectionName, partitionName } = body;
        const result = await this.milvusService.dropPartition(collectionName, partitionName);
        return res.send(result);
    }

    @Post('createPartition')
    async createPartition(@Req() req, @Res() res, @Body() body) {
        const { collectionName, partitionName } = body;
        const result = await this.milvusService.createPartition(collectionName, partitionName);
        return res.send(result);
    }

    @Post('releasePartition')
    async releasePartition(@Req() req, @Res() res, @Body() body) {
        const { collectionName, partitionNames } = body;
        const result = await this.milvusService.releasePartition(collectionName, partitionNames);
        return res.send(result);
    }

    @Post('searchVectors')
    async searchVectors(@Req() req, @Res() res, @Body() body) {
        const { collection_name, partition_names, text } = body;
        const result = await this.milvusService.searchVectors(collection_name, partition_names, text);
        return res.send(result);
    }

}

