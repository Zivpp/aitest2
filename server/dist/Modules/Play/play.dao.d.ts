import { OperatorRow } from "./Interface/play.dao.interface";
import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
import { GetAccount } from "./Interface/play.interface";
export declare class PlayDao extends MysqlBaseDao {
    getOperatorGameInfo(opId: number): Promise<OperatorRow>;
    getCPAccount(opId: number, cpKey: number): Promise<GetAccount | null>;
}
