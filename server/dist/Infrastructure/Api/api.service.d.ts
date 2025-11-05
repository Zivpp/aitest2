import { HttpService } from "@nestjs/axios";
export declare class ApiService {
    private readonly http;
    constructor(http: HttpService);
    get(url: string, headersOptions?: Record<string, string>): Promise<any>;
    post(url: string, body: any, headersOptions?: Record<string, string>): Promise<any>;
    put(url: string, body: any, headersOptions?: Record<string, string>): Promise<any>;
    delete(url: string, headersOptions?: Record<string, string>): Promise<any>;
    api(method: "get" | "post" | "put" | "delete", url: string, headersOptions?: Record<string, string>, body?: any): Promise<any>;
}
