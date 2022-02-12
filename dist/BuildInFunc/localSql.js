import EasyFs from '../OutputInput/EasyFs.js';
import initSqlJs from 'sql.js';
import { print } from '../OutputInput/Console.js';
import { workingDirectory } from '../RunTimeBuild/SearchFileSystem.js';
import path from 'path';
export default class LocalSql {
    constructor(savePath, checkIntervalMinutes = 10) {
        this.hadChange = false;
        this.savePath = savePath ?? workingDirectory + "SystemSave/DataBase.db";
        setInterval(() => this.updateLocalFile(), 1000 * 60 * checkIntervalMinutes);
    }
    async load() {
        const notExits = await EasyFs.mkdirIfNotExists(path.dirname(this.savePath));
        const SQL = await initSqlJs();
        let readData;
        if (!notExits && await EasyFs.existsFile(this.savePath))
            readData = await EasyFs.readFile(this.savePath, 'binary');
        this.db = new SQL.Database(readData);
    }
    updateLocalFile() {
        if (!this.hadChange)
            return;
        this.hadChange = false;
        EasyFs.writeFile(this.savePath, this.db.export());
    }
    buildQueryTemplate(arr, params) {
        let query = '';
        for (const i in params) {
            query += arr[i] + '?';
        }
        query += arr.at(-1);
        return query;
    }
    insert(queryArray, ...valuesArray) {
        const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
        try {
            const id = query.get(valuesArray)[0];
            this.hadChange = true;
            query.free();
            return id;
        }
        catch (err) {
            print.error(err);
        }
    }
    affected(queryArray, ...valuesArray) {
        const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
        try {
            query.run(valuesArray);
            const effected = this.db.getRowsModified();
            this.hadChange || (this.hadChange = effected > 0);
            query.free();
            return effected;
        }
        catch (err) {
            print.error(err);
        }
    }
    select(queryArray, ...valuesArray) {
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return this.db.exec(query);
        }
        catch (err) {
            print.error(err);
        }
    }
    selectOne(queryArray, ...valuesArray) {
        const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
        try {
            query.step();
            const one = query.getAsObject();
            query.free();
            return one;
        }
        catch (err) {
            print.error(err);
        }
    }
}
//# sourceMappingURL=localSql.js.map