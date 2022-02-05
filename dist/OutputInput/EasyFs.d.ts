/// <reference types="node" />
import fs, { Dirent, Stats } from 'fs';
declare function exists(path: string): Promise<boolean>;
/**
 *
 * @param {path of the file} path
 * @param {filed to get from the stat object} filed
 * @returns the filed
 */
declare function stat(path: string, filed?: string, ignoreError?: boolean, defaultValue?: any): Promise<Stats | any>;
declare function existsFile(path: string, ifTrueReturn?: any): Promise<boolean>;
declare function mkdir(path: string): Promise<boolean>;
declare function rmdir(path: string): Promise<boolean>;
declare function unlink(path: string): Promise<boolean>;
declare function unlinkIfExists(path: string): Promise<boolean>;
declare function readdir(path: string, options?: {}): Promise<string[] | Buffer[] | Dirent[]>;
declare function mkdirIfNotExists(path: string): Promise<boolean>;
declare function writeFile(path: string, content: string): Promise<boolean>;
declare function writeJsonFile(path: string, content: any): Promise<boolean>;
declare function readFile(path: string, encoding?: string): Promise<string | any>;
declare function readJsonFile(path: string, encoding?: string): Promise<any>;
declare function makePathReal(p: string, basic?: string): Promise<void>;
export { Dirent };
declare const _default: {
    exists: typeof exists;
    existsFile: typeof existsFile;
    stat: typeof stat;
    mkdir: typeof mkdir;
    mkdirIfNotExists: typeof mkdirIfNotExists;
    writeFile: typeof writeFile;
    writeJsonFile: typeof writeJsonFile;
    readFile: typeof readFile;
    readJsonFile: typeof readJsonFile;
    rmdir: typeof rmdir;
    unlink: typeof unlink;
    unlinkIfExists: typeof unlinkIfExists;
    readdir: typeof readdir;
    makePathReal: typeof makePathReal;
    access(path: fs.PathLike, mode?: number): Promise<void>;
    copyFile(src: fs.PathLike, dest: fs.PathLike, mode?: number): Promise<void>;
    open(path: fs.PathLike, flags: string | number, mode?: fs.Mode): Promise<fs.promises.FileHandle>;
    rename(oldPath: fs.PathLike, newPath: fs.PathLike): Promise<void>;
    truncate(path: fs.PathLike, len?: number): Promise<void>;
    rm(path: fs.PathLike, options?: fs.RmOptions): Promise<void>;
    readlink(path: fs.PathLike, options?: BufferEncoding | fs.ObjectEncodingOptions): Promise<string>;
    readlink(path: fs.PathLike, options: fs.BufferEncodingOption): Promise<Buffer>;
    readlink(path: fs.PathLike, options?: string | fs.ObjectEncodingOptions): Promise<string | Buffer>;
    symlink(target: fs.PathLike, path: fs.PathLike, type?: string): Promise<void>;
    lstat(path: fs.PathLike, opts?: fs.StatOptions & {
        bigint?: false;
    }): Promise<fs.Stats>;
    lstat(path: fs.PathLike, opts: fs.StatOptions & {
        bigint: true;
    }): Promise<fs.BigIntStats>;
    lstat(path: fs.PathLike, opts?: fs.StatOptions): Promise<fs.Stats | fs.BigIntStats>;
    link(existingPath: fs.PathLike, newPath: fs.PathLike): Promise<void>;
    chmod(path: fs.PathLike, mode: fs.Mode): Promise<void>;
    lchmod(path: fs.PathLike, mode: fs.Mode): Promise<void>;
    lchown(path: fs.PathLike, uid: number, gid: number): Promise<void>;
    lutimes(path: fs.PathLike, atime: string | number | Date, mtime: string | number | Date): Promise<void>;
    chown(path: fs.PathLike, uid: number, gid: number): Promise<void>;
    utimes(path: fs.PathLike, atime: string | number | Date, mtime: string | number | Date): Promise<void>;
    realpath(path: fs.PathLike, options?: BufferEncoding | fs.ObjectEncodingOptions): Promise<string>;
    realpath(path: fs.PathLike, options: fs.BufferEncodingOption): Promise<Buffer>;
    realpath(path: fs.PathLike, options?: BufferEncoding | fs.ObjectEncodingOptions): Promise<string | Buffer>;
    mkdtemp(prefix: string, options?: BufferEncoding | fs.ObjectEncodingOptions): Promise<string>;
    mkdtemp(prefix: string, options: fs.BufferEncodingOption): Promise<Buffer>;
    mkdtemp(prefix: string, options?: BufferEncoding | fs.ObjectEncodingOptions): Promise<string | Buffer>;
    appendFile(path: fs.PathLike | fs.promises.FileHandle, data: string | Uint8Array, options?: BufferEncoding | (fs.ObjectEncodingOptions & fs.promises.FlagAndOpenMode)): Promise<void>;
    opendir(path: fs.PathLike, options?: fs.OpenDirOptions): Promise<fs.Dir>;
    watch(filename: fs.PathLike, options: "buffer" | (fs.WatchOptions & {
        encoding: "buffer";
    })): AsyncIterable<fs.promises.FileChangeInfo<Buffer>>;
    watch(filename: fs.PathLike, options?: BufferEncoding | fs.WatchOptions): AsyncIterable<fs.promises.FileChangeInfo<string>>;
    watch(filename: fs.PathLike, options: string | fs.WatchOptions): AsyncIterable<fs.promises.FileChangeInfo<Buffer>> | AsyncIterable<fs.promises.FileChangeInfo<string>>;
    cp(source: string, destination: string, opts?: fs.CopyOptions): Promise<void>;
};
export default _default;
