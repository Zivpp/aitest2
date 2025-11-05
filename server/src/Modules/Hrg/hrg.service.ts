import { Injectable } from "@nestjs/common";
import { AccessCodeService } from "../../Global/Service/access.code.service";
import { CoreGrpcService } from "../../Grpc/Clients/core.grpc.service";
import { RedisService } from "../../Infrastructure/Redis/redis.service";

@Injectable()
export class HrgService {
  constructor(
    private readonly accessCodeService: AccessCodeService,
    private readonly coreGrpcService: CoreGrpcService,
    private readonly redisService: RedisService,
  ) { }
}
