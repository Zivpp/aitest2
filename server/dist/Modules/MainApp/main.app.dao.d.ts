import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
import { BetLogRes, COperatorGameInfo, CxGameCp, CxUser, TblOperator } from "./Interface/main.app.dao.interface";
import { Operator } from "./Interface/main.app.interface";
export declare class MainAppDao extends MysqlBaseDao {
    getUserByOpIdAndUserIdOrg(opId: string, userIdOrg: string): Promise<CxUser | null>;
    insertUser(dataObj: CxUser): Promise<any>;
    getOperatorInfo(opkey: string, ip: string): Promise<TblOperator | null>;
    updateUserIdByKey(tableName: string, updateObj: any, conditionStr: string, whereObj: any): Promise<import("mysql2").ResultSetHeader>;
    getCPList(a_bUseViewUrl?: boolean): Promise<CxGameCp[]>;
    getGameList(cpkey: number, version: number): Promise<any>;
    getTblOperatorByUuid(uuid: string): Promise<Operator | null>;
    procChkOperator(opkey: string, ip: string): Promise<Operator | null>;
    callProcChkOperator(opkey: string, ip: string): Promise<Operator | null>;
    getGameMTCode(strThirdPartyCode: string, strGameCode: string): Promise<any>;
    checkGamePermit(a_nOPID: number, a_nGameCPKey: number, a_strGameCode: string): Promise<number>;
    getOperatorTree(oId: string): Promise<any>;
    getOperatorSplashInfo(aTree: string[]): Promise<import("mysql2").RowDataPacket[]>;
    getOperatorSplashList_name(name: string): Promise<import("mysql2").RowDataPacket | null>;
    getOpratorGameInfo(oId: number): Promise<COperatorGameInfo | null>;
    getR(opId: number): Promise<any>;
    getBetLog(opkey: number, roundId: string): Promise<BetLogRes | null>;
    getNewGameList(): Promise<import("mysql2").RowDataPacket[] | null>;
}
