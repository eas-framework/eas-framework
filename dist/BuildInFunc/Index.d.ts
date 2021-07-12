import DBFastActions from './IndexActionsSQL';
import BetterSqlite3, { Database } from 'better-sqlite3';
import { RequestInfo } from 'node-fetch';
declare function req_get(url: RequestInfo, json?: boolean): Promise<unknown>;
declare class FastSqlite extends DBFastActions {
    folder?: string;
    private logs;
    db: Database;
    constructor(folder?: string, logs?: boolean);
    load(): Promise<void>;
    fixTextQuery(text: string): string;
    prepareSqlCache(query: string): BetterSqlite3.Statement<any[]>;
    runDB(text?: string, ...values: any): {};
    queryDB(text?: string, ...values: any): any[];
}
export { FastSqlite, req_get };
