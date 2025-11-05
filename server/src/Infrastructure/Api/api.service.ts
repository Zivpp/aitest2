import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosHeaders, AxiosRequestHeaders } from "axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ApiService {
  constructor(private readonly http: HttpService) {}

  async get(url: string, headersOptions: Record<string, string> = {}) {
    return this.api("get", url, headersOptions);
  }

  async post(
    url: string,
    body: any,
    headersOptions: Record<string, string> = {},
  ) {
    return this.api("post", url, headersOptions, body);
  }

  async put(
    url: string,
    body: any,
    headersOptions: Record<string, string> = {},
  ) {
    return this.api("put", url, headersOptions, body);
  }

  async delete(url: string, headersOptions: Record<string, string> = {}) {
    return this.api("delete", url, headersOptions);
  }

  /**
   * api call
   * @param method GET | POST | PUT | DELETE
   * @param url string
   * @param headersOptions application/json
   * @param body any
   * @returns any
   */
  async api(
    method: "get" | "post" | "put" | "delete",
    url: string,
    headersOptions: Record<string, string> = {},
    body: any = {},
  ): Promise<any> {
    try {
      // 預設 Content-Type 為 application/json
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...headersOptions, // 若外部有傳同樣 key，會覆蓋預設值
      };

      let response;

      switch (method) {
        case "get":
          response = await firstValueFrom(this.http.get(url, { headers }));
          break;
        case "post":
          response = await firstValueFrom(
            this.http.post(url, body, { headers }),
          );
          break;
        case "put":
          response = await firstValueFrom(
            this.http.put(url, body, { headers }),
          );
          break;
        case "delete":
          response = await firstValueFrom(this.http.delete(url, { headers }));
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // local env print response
      // if (process.env.APP_ENV === 'local') {
      //     console.info('[api response] :', response?.data)
      // }

      return response.data;
    } catch (error: any) {
      console.error(`[API ERROR] ${method.toUpperCase()} ${url}`);
      if (error?.response) {
        console.error("Response error:", error.response.data);
        throw new Error(JSON.stringify(error.response.data));
      }
      throw error;
    }
  }
}
