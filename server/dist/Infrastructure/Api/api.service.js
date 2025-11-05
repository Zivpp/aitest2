"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ApiService = class ApiService {
    http;
    constructor(http) {
        this.http = http;
    }
    async get(url, headersOptions = {}) {
        return this.api("get", url, headersOptions);
    }
    async post(url, body, headersOptions = {}) {
        return this.api("post", url, headersOptions, body);
    }
    async put(url, body, headersOptions = {}) {
        return this.api("put", url, headersOptions, body);
    }
    async delete(url, headersOptions = {}) {
        return this.api("delete", url, headersOptions);
    }
    async api(method, url, headersOptions = {}, body = {}) {
        try {
            const headers = {
                "Content-Type": "application/json",
                ...headersOptions,
            };
            let response;
            switch (method) {
                case "get":
                    response = await (0, rxjs_1.firstValueFrom)(this.http.get(url, { headers }));
                    break;
                case "post":
                    response = await (0, rxjs_1.firstValueFrom)(this.http.post(url, body, { headers }));
                    break;
                case "put":
                    response = await (0, rxjs_1.firstValueFrom)(this.http.put(url, body, { headers }));
                    break;
                case "delete":
                    response = await (0, rxjs_1.firstValueFrom)(this.http.delete(url, { headers }));
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
            return response.data;
        }
        catch (error) {
            console.error(`[API ERROR] ${method.toUpperCase()} ${url}`);
            if (error?.response) {
                console.error("Response error:", error.response.data);
                throw new Error(JSON.stringify(error.response.data));
            }
            throw error;
        }
    }
};
exports.ApiService = ApiService;
exports.ApiService = ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ApiService);
//# sourceMappingURL=api.service.js.map