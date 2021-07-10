import EasyFs from '../OutputInput/EasyFs';
import DBFastActions from './IndexActionsSQL';
import BetterSqlite3, { Database } from 'better-sqlite3';
import { print } from '../OutputInput/Console';
import fetch, { RequestInfo } from 'node-fetch';
import { workingDirectory } from '../RunTimeBuild/SearchFileSystem';

function req_get(url: RequestInfo, json: boolean) {
    return new Promise(res => {
        fetch(url).then(response => {
            if (json) {
                response.json().then(res);
            } else {
                response.text().then(res);
            }
        }).catch(() => res(null));
    });
}

(<any>global).req_get = req_get;

class FastSqlite extends DBFastActions {
    public db: Database;

    constructor(public folder?: string, private logs = false) {
        super()
        this.folder = folder ?? workingDirectory + "SystemSave/";
    }

    async load() {
        await EasyFs.mkdirIfNotExists(this.folder);

        this.db = BetterSqlite3(this.folder + 'DataBase.db', this.logs ? {
            verbose: print.log
        }: null);
    }

    fixTextQuery(text: string) {
        return text.replace(/\$([0-9]+)/gi, '?');
    }

    prepareSqlCache(query: string): BetterSqlite3.Statement<any[]>{
        return this.db.prepare(this.fixTextQuery(query));
    }

    runDB(text = "", ...values: any) {
        try {
            return this.prepareSqlCache(text).run(values);

        } catch (err) {
            print.error(err);

            return {};
        }
    }

    queryDB(text = "", ...values: any) {
        try {
            return this.prepareSqlCache(text).all(values);

        } catch (err) {
            print.error(err);

            return [];
        }
    }
}

(<any>global).FastSqlite = FastSqlite;

export { FastSqlite, req_get };
