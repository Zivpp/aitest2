import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
export declare class EvolutionDao extends MysqlBaseDao {
    getGameCodeListByCpkey(cpKey: number): Promise<import("mysql2").RowDataPacket[]>;
}
