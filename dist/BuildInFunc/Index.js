import EasyFs from '../OutputInput/EasyFs.js';
import DBFastActions from './IndexActionsSQL.js';
import BetterSqlite3 from 'better-sqlite3';
import { print } from '../OutputInput/Console.js';
import fetch from 'node-fetch';
import { workingDirectory } from '../RunTimeBuild/SearchFileSystem.js';
function req_get(url, json) {
    return new Promise(res => {
        fetch(url).then(response => {
            if (json) {
                response.json().then(res);
            }
            else {
                response.text().then(res);
            }
        }).catch(() => res(null));
    });
}
global.req_get = req_get;
class FastSqlite extends DBFastActions {
    folder;
    logs;
    db;
    constructor(folder, logs = false) {
        super();
        this.folder = folder;
        this.logs = logs;
        this.folder = folder ?? workingDirectory + "SystemSave/";
    }
    async load() {
        await EasyFs.mkdirIfNotExists(this.folder);
        this.db = BetterSqlite3(this.folder + 'DataBase.db', this.logs ? {
            verbose: print.log
        } : null);
    }
    fixTextQuery(text) {
        return text.replace(/\$([0-9]+)/gi, '?');
    }
    prepareSqlCache(query) {
        return this.db.prepare(this.fixTextQuery(query));
    }
    runDB(text = "", ...values) {
        try {
            return this.prepareSqlCache(text).run(values);
        }
        catch (err) {
            print.error(err);
            return {};
        }
    }
    queryDB(text = "", ...values) {
        try {
            return this.prepareSqlCache(text).all(values);
        }
        catch (err) {
            print.error(err);
            return [];
        }
    }
}
global.FastSqlite = FastSqlite;
export { FastSqlite, req_get };
