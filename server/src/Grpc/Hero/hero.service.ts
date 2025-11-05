import { Injectable } from "@nestjs/common";

@Injectable()
export class HeroService {
  findOne(data: { id: number }) {
    return { id: data.id, name: `Hero #${data.id}` };
  }
}
