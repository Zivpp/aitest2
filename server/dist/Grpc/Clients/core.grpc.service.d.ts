import { ProcessReply, ProcessRequest } from "./Interface/core.service.interface";
export declare class CoreGrpcService {
    private readonly coreClient;
    constructor(coreClient: any);
    processCall(data: ProcessRequest): Promise<ProcessReply>;
}
