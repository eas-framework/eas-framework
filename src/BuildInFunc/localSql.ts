import EasyFs from '../OutputInput/EasyFs';
import BetterSqlite3, { Database } from 'better-sqlite3';
import { print } from '../OutputInput/Console';
import { workingDirectory } from '../RunTimeBuild/SearchFileSystem';

export default class LocalSql {
    public db: Database;

    constructor(public folder?: string, private logs = false) {
        this.folder = folder ?? workingDirectory + "SystemSave/";
    }

    async load() {
        await EasyFs.mkdirIfNotExists(this.folder);

        this.loadSkipCheck();
    }

    loadSkipCheck(){
        this.db = BetterSqlite3(this.folder + 'DataBase.db', this.logs ? {
            verbose: print.log
        }: null);
    }

    private prepareSql(query: string): BetterSqlite3.Statement<any[]>{
        return this.db.prepare(query);
    }

    private buildQueryTemplate(arr: string[], params: any[]) {
        let query = '';
        for (const i in params) {
            query += arr[i] + '?';
        }

        query += arr.at(-1);

        return this.prepareSql(query);
    }

    insert(queryArray: string[], ...valuesArray: any[]){
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.run(valuesArray).lastInsertRowid
        } catch(err) {
            print.error(err);
        }
    }

    affected(queryArray: string[], ...valuesArray: any[]){
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.run(valuesArray).changes
        } catch(err) {
            print.error(err);
        }
    }

    select(queryArray: string[], ...valuesArray: any[]){
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.all(valuesArray)
        } catch(err) {
            print.error(err);
        }
    }

    selectOne(queryArray: string[], ...valuesArray: any[]){
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.get(valuesArray)
        } catch(err) {
            print.error(err);
        }
    }
}
