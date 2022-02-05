import EasyFs from '../OutputInput/EasyFs.js';
import BetterSqlite3 from 'better-sqlite3';
import { print } from '../OutputInput/Console.js';
import { workingDirectory } from '../RunTimeBuild/SearchFileSystem.js';
export default class LocalSql {
    constructor(folder, logs = false) {
        this.folder = folder;
        this.logs = logs;
        this.folder = folder ?? workingDirectory + "SystemSave/";
    }
    async load() {
        await EasyFs.mkdirIfNotExists(this.folder);
        this.loadSkipCheck();
    }
    loadSkipCheck() {
        this.db = BetterSqlite3(this.folder + 'DataBase.db', this.logs ? {
            verbose: print.log
        } : null);
    }
    prepareSql(query) {
        return this.db.prepare(query);
    }
    buildQueryTemplate(arr, params) {
        let query = '';
        for (const i in params) {
            query += arr[i] + '?';
        }
        query += arr.at(-1);
        return this.prepareSql(query);
    }
    insert(queryArray, ...valuesArray) {
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.run(valuesArray).lastInsertRowid;
        }
        catch (err) {
            print.error(err);
        }
    }
    affected(queryArray, ...valuesArray) {
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.run(valuesArray).changes;
        }
        catch (err) {
            print.error(err);
        }
    }
    select(queryArray, ...valuesArray) {
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.all(valuesArray);
        }
        catch (err) {
            print.error(err);
        }
    }
    selectOne(queryArray, ...valuesArray) {
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return query.get(valuesArray);
        }
        catch (err) {
            print.error(err);
        }
    }
}
//# sourceMappingURL=localSql.js.map