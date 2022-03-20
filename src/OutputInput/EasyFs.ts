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

/**
 * If the file exists, return true
 * @param {string} path - The path to the file you want to check.
 * @param {any} [ifTrueReturn=true] - any = true
 * @returns A boolean value.
 */
async function existsFile(path: string, ifTrueReturn: any = true): Promise<boolean>{
    return (await stat(path, null, true)).isFile?.() && ifTrueReturn;
}

/**
 * It creates a directory.
 * @param {string} path - The path to the directory you want to create.
 * @returns A promise.
 */
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

/**
 * `rmdir` is a function that takes a string and returns a promise that resolves to a boolean
 * @param {string} path - The path to the directory to be removed.
 * @returns A promise.
 */
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

/**
 * `unlink` is a function that takes a string and returns a promise that resolves to a boolean
 * @param {string} path - The path to the file you want to delete.
 * @returns A promise.
 */
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

/**
 * If the path exists, delete it
 * @param {string} path - The path to the file or directory to be unlinked.
 * @returns A boolean value.
 */
async function unlinkIfExists(path: string): Promise<boolean>{
    if(await exists(path)){
        return await unlink(path);
    }
    return false;
}

/**
 * `readdir` is a function that takes a path and an options object, and returns a promise that resolves
 * to an array of strings
 * @param {string} path - The path to the directory you want to read.
 * @param options - {
 * @returns A promise that resolves to an array of strings.
 */
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

/**
 * If the path does not exist, create it
 * @param {string} path - The path to the directory you want to create.
 * @returns A boolean value indicating whether the directory was created or not.
 */
async function mkdirIfNotExists(path: string): Promise<boolean>{
    if(!await exists(path))
        return await mkdir(path);
    return false;
}

/**
 * Write a file to the file system
 * @param {string} path - The path to the file you want to write to.
 * @param {string | NodeJS.ArrayBufferView} content - The content to write to the file.
 * @returns A promise.
 */
function writeFile(path: string, content:  string | NodeJS.ArrayBufferView): Promise<boolean>{
    return new Promise(res => {
        fs.writeFile(path, content, (err) => {
            if(err){
                print.error(err);
            }
            res(!err);
        });
    });
}

/**
 * `writeJsonFile` is a function that takes a path and a content and writes the content to the file at
 * the path
 * @param {string} path - The path to the file you want to write to.
 * @param {any} content - The content to write to the file.
 * @returns A boolean value.
 */
async function writeJsonFile(path: string, content: any): Promise<boolean> {
    try {
        return await writeFile(path, JSON.stringify(content));
    } catch(err) {
        print.error(err);
    }

    return false;
}

/**
 * `readFile` is a function that takes a path and an optional encoding and returns a promise that
 * resolves to the contents of the file at the given path
 * @param {string} path - The path to the file you want to read.
 * @param [encoding=utf8] - The encoding of the file. Defaults to utf8.
 * @returns A promise.
 */
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

/**
 * It reads a JSON file and returns the parsed JSON object.
 * @param {string} path - The path to the file you want to read.
 * @param {string} [encoding] - The encoding to use when reading the file. Defaults to utf8.
 * @returns A promise that resolves to an object.
 */
async function readJsonFile(path:string, encoding?:string): Promise<any>{
    try {
        return JSON.parse(await readFile(path, encoding));
    } catch(err){
        print.error(err);
    }

    return {};
}

/**
 * If the path doesn't exist, create it
 * @param p - The path to the file that needs to be created.
 * @param [base] - The base path to the file.
 */
async function makePathReal(p:string, base = '') {
    p = path.dirname(p);

    if (!await exists(base + p)) {
        const all = p.split(/\\|\//);

        let pString = '';
        for (const i of all) {
            if (pString.length) {
                pString += '/';
            }
            pString += i;

            await mkdirIfNotExists(base + pString);
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