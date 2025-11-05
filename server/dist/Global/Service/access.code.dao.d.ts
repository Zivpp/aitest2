import { MysqlBaseDao } from "src/Infrastructure/MySQL/mysql.base.dao";
import { GetDataGameListRes } from "./interface/access.code.service.interface";
import { CxUser } from "src/Modules/MainApp/Interface/main.app.dao.interface";
export declare class AccessCodeDao extends MysqlBaseDao {
    getDataGameList(a_bUseViewUrl?: boolean): Promise<GetDataGameListRes[] | null>;
    getDefSplashList(splashDefName: string): Promise<import("mysql2").RowDataPacket | null>;
    getUserInfoByUserId(userId: string): Promise<CxUser | null>;
    getUserIdByUserKey(userKey: number): Promise<any>;
}
