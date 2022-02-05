import { Database } from 'better-sqlite3';
export default class LocalSql {
    folder?: string;
    private logs;
    db: Database;
    constructor(folder?: string, logs?: boolean);
    load(): Promise<void>;
    loadSkipCheck(): void;
    private prepareSql;
    private buildQueryTemplate;
    insert(queryArray: string[], ...valuesArray: any[]): number | bigint;
    affected(queryArray: string[], ...valuesArray: any[]): number;
    select(queryArray: string[], ...valuesArray: any[]): any[];
    selectOne(queryArray: string[], ...valuesArray: any[]): any;
}
