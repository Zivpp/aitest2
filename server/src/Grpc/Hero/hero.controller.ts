import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { HeroService } from "./hero.service";

@Controller()
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @GrpcMethod("HeroService", "FindOne") // 對應 proto 裡的 service 和 rpc 名稱
  findOne(data: { id: number }) {
    return this.heroService.findOne(data);
  }
}
