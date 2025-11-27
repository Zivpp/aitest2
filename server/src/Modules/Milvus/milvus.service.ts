import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import { pipeline } from '@xenova/transformers';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MilvusService implements OnModuleInit, OnModuleDestroy {
    private client: MilvusClient;
    private extractor: any;
    constructor(
    ) { }

    async onModuleInit() {
        // Milvus db connection.
        this.client = new MilvusClient({
            address: "127.0.0.1:19530", // 如果是 docker，改成容器對外的 host:port
            username: "root",
            password: "Milvus",
        });

        // 測試連線
        const res = await this.client.checkHealth();
        console.log("Milvus health:", res);
        // 宣告 vector 工具
        this.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    async onModuleDestroy() {
        await this.client.closeConnection();
    }

    /**
     * get embedding
     * @param text 
     * @returns 
     */
    async getEmbedding(text: string) {
        const out: any = await this.extractor(text, { pooling: 'mean', normalize: true });
        // 有的版本 dims 可能是 [384] 或 [1, 384]，用 data 取值最穩
        const vec = Array.from(out.data as Float32Array);
        // 防呆：確認長度
        if (vec.length !== 384) throw new Error(`embedding 維度不符：${vec.length}`);
        return vec;
    }

    /**
     * drop partition
     * @param collectionName 
     * @param partitionName 
     * @returns 
     */
    async dropPartition(collectionName: string, partitionName: string) {
        try {
            const conditions = {
                collection_name: collectionName,
                partition_name: partitionName
            }
            const res = await this.client.dropPartition({ ...conditions });
            return res;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

    /**
     * create partition
     * @param collectionName 
     * @param partitionName 
     * @returns 
     */
    async createPartition(collectionName: string, partitionName: string) {
        try {
            const res = await this.client.createPartition({
                collection_name: collectionName,
                partition_name: partitionName,
            });
            return res;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

    /**
     * release partition
     * @param collectionName 
     * @param partitionNames 
     * @returns 
     */
    async releasePartition(collectionName: string, partitionNames: string[]) {
        try {
            const res = await this.client.releasePartitions({
                collection_name: collectionName,
                partition_names: partitionNames,
            });
            return res;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

    /**
     * create collection
     * @param collectionName 
     * @param fields 
     * @returns 
     */
    async createCollection(collectionName: string, fields: any[]) {
        try {
            const body = {
                collection_name: collectionName,
                fields: fields
            }
            const res = await this.client.createCollection({ ...body });
            await this.client.createIndex({
                collection_name: collectionName,
                field_name: 'vector',
                index_name: 'idx_vector_hnsw',
                index_type: 'HNSW',
                metric_type: 'COSINE',
                params: { M: '16', efConstruction: '200' },
            });
            return res;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

    /**
     * drop collection
     * @param collectionName 
     * @returns 
     */
    async dropCollection(collectionName: string) {
        try {
            await this.client.releaseCollection({ collection_name: collectionName });
            const res = await this.client.dropCollection({ collection_name: collectionName });
            return res;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

    /**
     * search vectors
     * @param collectionName 
     * @param partitionNames 
     * @param text 
     * @returns 
     */
    async searchVectors(collectionName: string, partitionNames: string[], text: string) {
        try {
            const queryVector = await this.getEmbedding(text)
            const res = await this.client.search({
                collection_name: collectionName,
                partition_names: partitionNames,
                anns_field: 'vector',
                data: [queryVector],
                topk: 3, // ✅ 放在這裡
                metric_type: 'COSINE',
                params: { nprobe: 10 }, // ✅ params 裡只放搜尋演算法參數
                output_fields: ['keywords', 'answer'],
            });
            return res;
        } catch (error) {
            console.error(error)
            return error;
        }
    }

    /**
     * insert data faq
     * @param collectionName 
     * @param partitionName 
     * @param data 
     * @returns 
     */
    async insertDataFaq(collectionName: string, partitionName: string, data: { id: number; keywords: string; answer: string }[]) {
        // v1. 直接整串 keywords insert
        const vectorData = await Promise.all(data.map(async d => ({
            id: uuidv4(),
            keywords: d.keywords,
            answer: d.answer,
            vector: await this.getEmbedding(d.keywords),
        })));
        const res = await this.client.insert({
            collection_name: collectionName,
            partition_name: partitionName,
            fields_data: vectorData,
        });

        // Flush 讓資料寫入後能被查詢
        await this.client.flushSync({ collection_names: [collectionName] });

        return { status: 'success' };
    }

}