import { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
export declare abstract class MysqlBaseDao {
    protected readonly pool: Pool;
    constructor(pool: Pool);
    protected query<T = RowDataPacket>(sql: string, params?: any[]): Promise<T[]>;
    protected exec(sql: string, params?: any[]): Promise<ResultSetHeader>;
    protected inTx<T>(work: (conn: PoolConnection) => Promise<T>): Promise<T>;
    protected updateByObject(table: string, data: Record<string, unknown>, whereSql: string, whereParams: Record<string, unknown>, opts?: {
        conn?: PoolConnection;
        allowEmptyWhere?: boolean;
    }): Promise<ResultSetHeader>;
}
