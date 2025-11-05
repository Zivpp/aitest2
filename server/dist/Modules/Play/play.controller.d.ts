import { AccessCodeService } from "../../Global/Service/access.code.service";
import { PlayService } from "./play.service";
export declare class PlayController {
    private readonly accessCodeService;
    private readonly playService;
    constructor(accessCodeService: AccessCodeService, playService: PlayService);
    play(req: any, res: any, body: any): Promise<any>;
}
