import { GameService } from "./game.service";
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    grpcClientCallingTest(body: any): Promise<any>;
    processCall(data: any, metadata: any): any;
}
