import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { MilvusService } from "./milvus.service";
import { GoogleGenerativeAIService } from "../GoogleGenerativeAI/google.generative.ai.service";

@Controller('milvus')
export class MilvusController {
    constructor(
        private readonly milvusService: MilvusService,
        private readonly googleGenerativeAI: GoogleGenerativeAIService,
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
        const { collectionName, partitionName, text } = body;
        const result = await this.milvusService.searchVectors(collectionName, [partitionName], text);
        return res.send(result);
    }

    @Post('insertDataFaq')
    async insertDataFaq(@Req() req, @Res() res, @Body() body) {
        const { collectionName, partitionName, data } = body;
        const result = await this.milvusService.insertDataFaq(collectionName, partitionName, data);
        return res.send(result);
    }

    @Post('talk')
    async talk(@Req() req, @Res() res, @Body() body) {
        const { collectionName, partitionName, text, prompt } = body;
        const searchText = await this.googleGenerativeAI.talk(text, prompt);
        const result = await this.milvusService.searchVectors(collectionName, [partitionName], searchText);
        return res.send({
            talkResult: searchText,
            searchResult: result
        });
    }

}

