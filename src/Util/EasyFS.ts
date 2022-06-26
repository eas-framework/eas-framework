import { Dirent, Stats, promises, fstat } from 'node:fs';
import path from 'node:path';
import { SystemAutoError } from '../Logger/ErrorLogger';

/**
 * A function that takes a promise and a callback function. It returns a new promise that will resolve
 * to the result of the callback function. If the promise is rejected, the callback function will be
 * called with the error as the first argument.
 * @param promise - The promise you want to handle
 * @param {any} callback - The callback function that you want to use.
 * @returns A promise that will resolve to the result of the callback function.
 */
function promiseErrorHandle<T>(promise: Promise<any>, callback?: (err: NodeJS.ErrnoException, data?: any) => T): Promise<T> {
    return new Promise(async res => {
        try {
            res(callback?.(null, await promise))
        } catch (err) {
            res(callback?.(err));
        }
    })
}

function basicFSErrorHandler(method: string, ...values) {
    return promiseErrorHandle(promises[method](...values), (err) => {
        if (err) {
            SystemAutoError(err)
        }
        return !err;
    });
}

function exists(path: string): Promise<boolean> {
    return promiseErrorHandle(promises.stat(path), (err, stat) => Boolean(stat))
}

/**
 * 
 * @param {path of the file} path 
 * @param {filed to get from the stat object} filed 
 * @returns the filed
 */
function stat(path: string, filed?: string, ignoreError?: boolean, defaultValue: any = {}): Promise<Stats | any> {
    return promiseErrorHandle(promises.stat(path), (err, stat) => {
        if (err && !ignoreError) {
            SystemAutoError(err)
        }
        return filed && stat ? stat[filed] : stat || defaultValue;
    });
}

/**
 * If the file exists, return true
 * @param {string} path - The path to the file you want to check.
 * @param {any} [ifTrueReturn=true] - any = true
 * @returns A boolean value.
 */
async function existsFile(path: string, ifTrueReturn: any = true): Promise<boolean> {
    return (await stat(path, undefined, true)).isFile?.() && ifTrueReturn;
}

/**
 * It creates a directory.
 * @param {string} path - The path to the directory you want to create.
 * @returns A promise.
 */
function mkdir(path: string): Promise<boolean> {
    return basicFSErrorHandler('mkdir', path);
}

/**
 * `rmdir` is a function that takes a string and returns a promise that resolves to a boolean
 * @param {string} path - The path to the directory to be removed.
 * @returns A promise.
 */
function rmdir(path: string): Promise<boolean> {
    return basicFSErrorHandler('rmdir', path);
}

/**
 * `unlink` is a function that takes a string and returns a promise that resolves to a boolean
 * @param {string} path - The path to the file you want to delete.
 * @returns A promise.
 */
function unlink(path: string): Promise<boolean> {
    return basicFSErrorHandler('unlink', path);
}

/**
 * If the path exists, delete it
 * @param {string} path - The path to the file or directory to be unlinked.
 * @returns A boolean value.
 */
async function unlinkIfExists(path: string): Promise<boolean> {
    return promiseErrorHandle(promises.unlink(path), err => {
        return !err;
    })
}

/**
 * `readdir` is a function that takes a path and an options object, and returns a promise that resolves
 * to an array of strings
 * @param {string} path - The path to the directory you want to read.
 * @param options - {
 * @returns A promise that resolves to an array of strings.
 */
function readdir(path: string, options = {}): Promise<string[] | Buffer[] | Dirent[]> {
    return promiseErrorHandle(promises.readdir(path, options), (err, files) => {
        if (err) {
            SystemAutoError(err)
        }
        return files || [];
    })
}

/**
 * If the path does not exist, create it
 * @param {string} path - The path to the directory you want to create.
 * @returns A boolean value indicating whether the directory was created or not.
 */
async function mkdirIfNotExists(path: string, options?: {recursive: boolean}): Promise<boolean> {
    return promiseErrorHandle(promises.mkdir(path, options), err => {
        return !err;
    })
}

/**
 * Write a file to the file system
 * @param {string} path - The path to the file you want to write to.
 * @param {string | NodeJS.ArrayBufferView} content - The content to write to the file.
 * @returns A promise.
 */
function writeFile(path: string, content: string | NodeJS.ArrayBufferView): Promise<boolean> {
    return promiseErrorHandle(promises.writeFile(path, content), err => {
        if (err) {
            SystemAutoError(err)
        }
        return !err;
    })
}


promises.appendFile
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
    } catch (err) {
        SystemAutoError(err)
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
function readFile(path: string, encoding: BufferEncoding = 'utf8', ignoreError = false): Promise<string | any> {
    return promiseErrorHandle(promises.readFile(path, { encoding }), (err, data) => {
        if (err && !ignoreError) {
            SystemAutoError(err)
        }
        return data || "";
    });
}

/**
 * It reads a JSON file and returns the parsed JSON object.
 * @param {string} path - The path to the file you want to read.
 * @param {string} [encoding] - The encoding to use when reading the file. Defaults to utf8.
 * @returns A promise that resolves to an object.
 */
async function readJsonFile(path: string, encoding?: BufferEncoding): Promise<any> {
    try {
        return JSON.parse(await readFile(path, encoding));
    } catch (err) {
        SystemAutoError(err)
    }

    return {};
}

/**
 * If the path doesn't exist, create it
 * @param p - The path to the file that needs to be created.
 * @param content - the content to write to the file.
 */
async function writeFileAndPath(filePath: string, content: string) {
    await promiseErrorHandle(promises.mkdir(path.dirname(filePath), {recursive: true}));
    await writeFile(filePath, content);
}

//types
export {
    Dirent
}

export default {
    ...promises,
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
    writeFileAndPath
}