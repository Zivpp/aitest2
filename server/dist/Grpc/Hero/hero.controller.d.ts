import { HeroService } from "./hero.service";
export declare class HeroController {
    private readonly heroService;
    constructor(heroService: HeroService);
    findOne(data: {
        id: number;
    }): {
        id: number;
        name: string;
    };
}
