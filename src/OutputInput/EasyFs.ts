import fs, {Dirent, Stats} from 'fs';
import { print } from './Console';
import path from 'path';

function exists(path: string): Promise<boolean>{
    return new Promise(res => {
        fs.stat(path, (err, stat) => {
            res(Boolean(stat));
        });
    });
}

/**
 * 
 * @param {path of the file} path 
 * @param {filed to get from the stat object} filed 
 * @returns the filed
 */
function stat(path: string, filed?: string, ignoreError?: boolean, defaultValue:any = {}): Promise<Stats | any>{
    return new Promise(res => {
        fs.stat(path, (err, stat) => {
            if(err && !ignoreError){
                print.error(err);
            }
            res(filed && stat? stat[filed]: stat || defaultValue);
        });
    });
}

async function existsFile(path: string): Promise<boolean>{
    return (await stat(path, null, true)).isFile?.();
}

function mkdir(path: string): Promise<boolean>{
    return new Promise(res => {
        fs.mkdir(path, (err) => {
            if(err){
                print.error(err);
            }
            res(!err);
        });
    });
}

function rmdir(path: string): Promise<boolean>{
    return new Promise(res => {
        fs.rmdir(path, (err) => {
            if(err){
                print.error(err);
            }
            res(!err);
        });
    });
}

function unlink(path: string): Promise<boolean>{
    return new Promise(res => {
        fs.unlink(path, (err) => {
            if(err){
                print.error(err);
            }
            res(!err);
        });
    });
}

async function unlinkIfExists(path: string): Promise<boolean>{
    if(await exists(path)){
        return await unlink(path);
    }
    return false;
}

function readdir(path: string, options = {}): Promise<string[] | Buffer[] | Dirent[]>{
    return new Promise(res => {
        fs.readdir(path, options, (err, files) => {
            if(err){
                print.error(err);
            }
            res(files || []);
        });
    });
}

async function mkdirIfNotExists(path: string): Promise<boolean>{
    if(!await exists(path))
        return await mkdir(path);
    return false;
}

function writeFile(path: string, content: string): Promise<boolean>{
    return new Promise(res => {
        fs.writeFile(path, content, (err) => {
            if(err){
                print.error(err);
            }
            res(!err);
        });
    });
}

async function writeJsonFile(path: string, content: any): Promise<boolean> {
    try {
        return await writeFile(path, JSON.stringify(content));
    } catch(err) {
        print.error(err);
    }

    return false;
}

function readFile(path:string, encoding = 'utf8'): Promise<string|any>{
    return new Promise(res => {
        fs.readFile(path, <any>encoding, (err, data) => {
            if(err){
                print.error(err);
            }
            res(data || "");
        });
    });
}

async function readJsonFile(path:string, encoding?:string): Promise<any>{
    try {
        return JSON.parse(await readFile(path, encoding));
    } catch(err){
        print.error(err);
    }

    return {};
}

async function makePathReal(p:string, basic = '') {
    p = path.dirname(p);

    if (!await exists(basic + p)) {
        const all = p.split(/\\|\//);

        let pString = '';
        for (const i of all) {
            if (pString.length) {
                pString += '/';
            }
            pString += i;

            await mkdirIfNotExists(basic + pString);
        }
    }
}

//types
export {
    Dirent
}

export default {
    ...fs.promises,
    exists,
    existsFile,
    stat,
    mkdir,
    mkdirIfNotExists,
    writeFile,
    writeJsonFile,
    readFile,
    readJsonFile,
    rmdir,
    unlink,
    unlinkIfExists,
    readdir,
    makePathReal
}