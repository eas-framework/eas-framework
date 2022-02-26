import EasyFs from '../OutputInput/EasyFs';
import initSqlJs, { Database } from 'sql.js';
import { print } from '../OutputInput/Console';
import { workingDirectory } from '../RunTimeBuild/SearchFileSystem';
import path from 'path';
import { PrintIfNew } from '../OutputInput/PrintNew';

export default class LocalSql {
    public db: Database;
    public savePath: string;
    public hadChange = false;
    private loaded = false;

    constructor(savePath?: string, checkIntervalMinutes = 10) {
        this.savePath = savePath ?? workingDirectory + "SystemSave/DataBase.db";
        this.updateLocalFile = this.updateLocalFile.bind(this);
        setInterval(this.updateLocalFile, 1000 * 60 * checkIntervalMinutes);
        process.on('SIGINT', this.updateLocalFile)
        process.on('exit', this.updateLocalFile);
    }

    private notLoaded(){
        if(!this.loaded){
            PrintIfNew({
                errorName: 'dn-not-loaded',
                text: 'DataBase is not loaded, please use \'await db.load()\'',
                type: 'error'
            })
            return true
        }
    }

    async load() {
        const notExits = await EasyFs.mkdirIfNotExists(path.dirname(this.savePath));
        const SQL = await initSqlJs();

        let readData: Buffer;
        if (!notExits && await EasyFs.existsFile(this.savePath))
            readData = await EasyFs.readFile(this.savePath, 'binary');
        this.db = new SQL.Database(readData);
    }

    private updateLocalFile(){
        if(!this.hadChange) return;
        this.hadChange = false;
        EasyFs.writeFile(this.savePath, this.db.export());
    }

    private buildQueryTemplate(arr: string[], params: any[]) {
        let query = '';
        for (const i in params) {
            query += arr[i] + '?';
        }

        query += arr.at(-1);

        return query;
    }

    insert(queryArray: string[], ...valuesArray: any[]) {
        if(this.notLoaded()) return
        const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
        try {
            const id = query.get(valuesArray)[0];
            this.hadChange = true;
            query.free();
            return id;
        } catch (err) {
            print.error(err);
        }
    }

    affected(queryArray: string[], ...valuesArray: any[]) {
        if(this.notLoaded()) return
        const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
        
        try {
             query.run(valuesArray)
             const effected = this.db.getRowsModified()
             this.hadChange ||= effected > 0;
             query.free();
             return effected;
        } catch (err) {
            print.error(err);
        }
    }

    select(queryArray: string[], ...valuesArray: any[]) {
        if(this.notLoaded()) return
        const query = this.buildQueryTemplate(queryArray, valuesArray);
        try {
            return this.db.exec(query);
        } catch (err) {
            print.error(err);
        }
    }

    selectOne(queryArray: string[], ...valuesArray: any[]) {
        if(this.notLoaded()) return
        const query = this.db.prepare(this.buildQueryTemplate(queryArray, valuesArray));
        try {
            query.step();
            const one = query.getAsObject();
            query.free();
            return one;
        } catch (err) {
            print.error(err);
        }
    }
}
