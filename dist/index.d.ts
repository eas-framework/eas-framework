/// <reference types="formidable" />
/// <reference types="node" />
declare module "@eas-framework/server/MainBuild/Types" {
    import type { Request as TinyhttpRequest, Response as TinyhttpResponse } from '@tinyhttp/app';
    import type { Fields, Files } from 'formidable';
    type AddAny = {
        [key: string]: any;
    };
    export type Request = TinyhttpRequest & {
        fields?: Fields;
        files?: Files;
    } & AddAny;
    export type Response = TinyhttpResponse & AddAny;
    type write = (data: any) => void;
    type echo = (arr: string[], params: any[]) => void;
    type page = {
        write: write;
        writeSafe: write;
        setResponse: write;
        echo: echo;
        Post: AddAny | null;
        Query: AddAny;
        Session: AddAny | null;
        Files: Files;
        Cookies: AddAny;
        PageVar: AddAny;
        GlobalVar: AddAny;
    } & AddAny;
    global {
        let page: page;
        let write: write;
        let writeSafe: write;
        let setResponse: write;
        let echo: echo;
        let Post: AddAny | null;
        let Query: AddAny;
        let Session: AddAny | null;
        let Files: Files;
        let Cookies: AddAny;
        let PageVar: AddAny;
        let GlobalVar: AddAny;
        function include(path: string, object?: AddAny): Promise<AddAny>;
        function transfer(path: string, preserveForm?: boolean, object?: AddAny): Promise<AddAny>;
    }
}
declare module "@eas-framework/server/OutputInput/Console" {
    export function allowPrint(d: boolean): void;
    export const print: Console;
}
declare module "@eas-framework/server/OutputInput/EasyFs" {
    import fs, { Dirent, Stats } from 'fs';
    function exists(path: string): Promise<boolean>;
    /**
     *
     * @param {path of the file} path
     * @param {filed to get from the stat object} filed
     * @returns the filed
     */
    function stat(path: string, filed?: string, ignoreError?: boolean, defaultValue?: any): Promise<Stats | any>;
    /**
     * If the file exists, return true
     * @param {string} path - The path to the file you want to check.
     * @param {any} [ifTrueReturn=true] - any = true
     * @returns A boolean value.
     */
    function existsFile(path: string, ifTrueReturn?: any): Promise<boolean>;
    /**
     * It creates a directory.
     * @param {string} path - The path to the directory you want to create.
     * @returns A promise.
     */
    function mkdir(path: string): Promise<boolean>;
    /**
     * `rmdir` is a function that takes a string and returns a promise that resolves to a boolean
     * @param {string} path - The path to the directory to be removed.
     * @returns A promise.
     */
    function rmdir(path: string): Promise<boolean>;
    /**
     * `unlink` is a function that takes a string and returns a promise that resolves to a boolean
     * @param {string} path - The path to the file you want to delete.
     * @returns A promise.
     */
    function unlink(path: string): Promise<boolean>;
    /**
     * If the path exists, delete it
     * @param {string} path - The path to the file or directory to be unlinked.
     * @returns A boolean value.
     */
    function unlinkIfExists(path: string): Promise<boolean>;
    /**
     * `readdir` is a function that takes a path and an options object, and returns a promise that resolves
     * to an array of strings
     * @param {string} path - The path to the directory you want to read.
     * @param options - {
     * @returns A promise that resolves to an array of strings.
     */
    function readdir(path: string, options?: {}): Promise<string[] | Buffer[] | Dirent[]>;
    /**
     * If the path does not exist, create it
     * @param {string} path - The path to the directory you want to create.
     * @returns A boolean value indicating whether the directory was created or not.
     */
    function mkdirIfNotExists(path: string): Promise<boolean>;
    /**
     * Write a file to the file system
     * @param {string} path - The path to the file you want to write to.
     * @param {string | NodeJS.ArrayBufferView} content - The content to write to the file.
     * @returns A promise.
     */
    function writeFile(path: string, content: string | NodeJS.ArrayBufferView): Promise<boolean>;
    /**
     * `writeJsonFile` is a function that takes a path and a content and writes the content to the file at
     * the path
     * @param {string} path - The path to the file you want to write to.
     * @param {any} content - The content to write to the file.
     * @returns A boolean value.
     */
    function writeJsonFile(path: string, content: any): Promise<boolean>;
    /**
     * `readFile` is a function that takes a path and an optional encoding and returns a promise that
     * resolves to the contents of the file at the given path
     * @param {string} path - The path to the file you want to read.
     * @param [encoding=utf8] - The encoding of the file. Defaults to utf8.
     * @returns A promise.
     */
    function readFile(path: string, encoding?: string): Promise<string | any>;
    /**
     * It reads a JSON file and returns the parsed JSON object.
     * @param {string} path - The path to the file you want to read.
     * @param {string} [encoding] - The encoding to use when reading the file. Defaults to utf8.
     * @returns A promise that resolves to an object.
     */
    function readJsonFile(path: string, encoding?: string): Promise<any>;
    /**
     * If the path doesn't exist, create it
     * @param p - The path to the file that needs to be created.
     * @param [base] - The base path to the file.
     */
    function makePathReal(p: string, base?: string): Promise<void>;
    export { Dirent };
    const _default: {
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
}
declare module "@eas-framework/server/EasyDebug/SourceMap" {
    import { RawSourceMap, SourceMapGenerator } from "source-map";
    export function toURLComment(map: SourceMapGenerator, isCss?: boolean): string;
    export function MergeSourceMap(generatedMap: RawSourceMap, originalMap: RawSourceMap): Promise<SourceMapGenerator>;
}
declare module "@eas-framework/server/EasyDebug/SourceMapStore" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { SourceMapGenerator, RawSourceMap } from "source-map";
    export abstract class SourceMapBasic {
        protected filePath: string;
        protected httpSource: boolean;
        protected relative: boolean;
        protected isCss: boolean;
        protected map: SourceMapGenerator;
        protected fileDirName: string;
        protected lineCount: number;
        constructor(filePath: string, httpSource?: boolean, relative?: boolean, isCss?: boolean);
        protected getSource(source: string): string;
        getRowSourceMap(): RawSourceMap;
        mapAsURLComment(): string;
    }
    export default class SourceMapStore extends SourceMapBasic {
        protected debug: boolean;
        private storeString;
        private actionLoad;
        constructor(filePath: string, debug?: boolean, isCss?: boolean, httpSource?: boolean);
        notEmpty(): boolean;
        addStringTracker(track: StringTracker, { text: text }?: {
            text?: string;
        }): void;
        private _addStringTracker;
        addText(text: string): void;
        private _addText;
        static fixURLSourceMap(map: RawSourceMap): RawSourceMap;
        addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string): void;
        private _addSourceMapWithStringTracker;
        private buildAll;
        mapAsURLComment(): string;
        createDataWithMap(): Promise<string>;
        clone(): SourceMapStore;
    }
}
declare module "@eas-framework/server/EasyDebug/StringTrackerToSourceMap" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export function outputMap(text: StringTracker, filePath: string, httpSource?: boolean, relative?: boolean): import("source-map").RawSourceMap;
    export function outputWithMap(text: StringTracker, filePath: string): string;
}
declare module "@eas-framework/server/EasyDebug/StringTracker" {
    export interface StringTrackerDataInfo {
        text?: string;
        info: string;
        line?: number;
        char?: number;
    }
    export interface ArrayMatch extends Array<StringTracker> {
        index?: number;
        input?: StringTracker;
    }
    export default class StringTracker {
        private DataArray;
        InfoText: string;
        OnLine: number;
        OnChar: number;
        /**
         * @param InfoText text info for all new string that are created in this object
         */
        constructor(Info?: string | StringTrackerDataInfo, text?: string);
        static get emptyInfo(): StringTrackerDataInfo;
        setDefault(Info?: StringTrackerDataInfo): void;
        getDataArray(): StringTrackerDataInfo[];
        /**
         * get the InfoText that are setted on the last InfoText
         */
        get DefaultInfoText(): StringTrackerDataInfo;
        /**
         * get the InfoText that are setted on the first InfoText
         */
        get StartInfo(): StringTrackerDataInfo;
        /**
         * return all the text as one string
         */
        private get OneString();
        /**
         * return all the text so you can check if it equal or not
         * use like that: myString.eq == "cool"
         */
        get eq(): string;
        /**
         * return the info about this text
         */
        get lineInfo(): string;
        /**
         * length of the string
         */
        get length(): number;
        /**
         *
         * @returns copy of this string object
         */
        Clone(): StringTracker;
        private AddClone;
        /**
         *
         * @param text any thing to connect
         * @returns conncted string with all the text
         */
        static concat(...text: any[]): StringTracker;
        /**
         *
         * @param data
         * @returns this string clone plus the new data connected
         */
        ClonePlus(...data: any[]): StringTracker;
        /**
         * Add string or any data to this string
         * @param data can be any thing
         * @returns this string (not new string)
         */
        Plus(...data: any[]): StringTracker;
        /**
         * Add strins ot other data with 'Template literals'
         * used like this: myStrin.$Plus `this very${coolString}!`
         * @param texts all the splited text
         * @param values all the values
         */
        Plus$(texts: TemplateStringsArray, ...values: (StringTracker | any)[]): StringTracker;
        /**
         *
         * @param text string to add
         * @param action where to add the text
         * @param info info the come with the string
         */
        private AddTextAction;
        /**
         * add text at the *end* of the string
         * @param text
         * @param info
         */
        AddTextAfter(text: string, info?: string, line?: number, char?: number): this;
        /**
         * add text at the *end* of the string without tracking
         * @param text
         */
        AddTextAfterNoTrack(text: string, info?: string): this;
        /**
         * add text at the *start* of the string
         * @param text
         * @param info
         */
        AddTextBefore(text: string, info?: string, line?: number, char?: number): this;
        /**
     * add text at the *start* of the string
     * @param text
     */
        AddTextBeforeNoTrack(text: string, info?: string): this;
        /**
         * Add Text File Tracking
         * @param text
         * @param info
         */
        private AddFileText;
        /**
         * simple methof to cut string
         * @param start
         * @param end
         * @returns new cutted string
         */
        private CutString;
        /**
         * substring-like method, more like js cutting string, if there is not parameters it complete to 0
         */
        substring(start: number, end?: number): StringTracker;
        /**
         * substr-like method
         * @param start
         * @param length
         * @returns
         */
        substr(start: number, length?: number): StringTracker;
        /**
         * slice-like method
         * @param start
         * @param end
         * @returns
         */
        slice(start: number, end?: number): StringTracker;
        charAt(pos: number): StringTracker;
        at(pos: number): StringTracker;
        charCodeAt(pos: number): number;
        codePointAt(pos: number): number;
        [Symbol.iterator](): Generator<StringTracker, void, unknown>;
        getLine(line: number, startFromOne?: boolean): StringTracker;
        /**
         * convert uft-16 length to count of chars
         * @param index
         * @returns
         */
        private charLength;
        indexOf(text: string): number;
        lastIndexOf(text: string): number;
        /**
         * return string as unicode
         */
        private unicodeMe;
        /**
         * the string as unicode
         */
        get unicode(): StringTracker;
        search(regex: RegExp | string): number;
        startsWith(search: string, position?: number): boolean;
        endsWith(search: string, position?: number): boolean;
        includes(search: string, position?: number): boolean;
        trimStart(): StringTracker;
        trimLeft(): StringTracker;
        trimEnd(): StringTracker;
        trimRight(): StringTracker;
        trim(): StringTracker;
        SpaceOne(addInside?: string): StringTracker;
        private ActionString;
        toLocaleLowerCase(locales?: string | string[]): StringTracker;
        toLocaleUpperCase(locales?: string | string[]): StringTracker;
        toUpperCase(): StringTracker;
        toLowerCase(): StringTracker;
        normalize(): StringTracker;
        private StringIndexer;
        private RegexInString;
        split(separator: string | RegExp, limit?: number): StringTracker[];
        repeat(count: number): StringTracker;
        static join(arr: StringTracker[]): StringTracker;
        private replaceWithTimes;
        replace(searchValue: string | RegExp, replaceValue: StringTracker | string): StringTracker;
        replacer(searchValue: RegExp, func: (data: ArrayMatch) => StringTracker): StringTracker;
        replacerAsync(searchValue: RegExp, func: (data: ArrayMatch) => Promise<StringTracker>): Promise<StringTracker>;
        replaceAll(searchValue: string | RegExp, replaceValue: StringTracker | string): StringTracker;
        matchAll(searchValue: string | RegExp): StringTracker[];
        match(searchValue: string | RegExp): ArrayMatch | StringTracker[];
        toString(): string;
        extractInfo(type?: string): string;
        originalPositionFor(line: number, column: number): {
            searchLine: StringTracker;
            text?: string;
            info: string;
            line?: number;
            char?: number;
        };
        /**
         * Extract error info form error message
         */
        debugLine({ message, text, location, line, col }: {
            message?: string;
            text?: string;
            location?: {
                line: number;
                column: number;
                lineText?: string;
            };
            line?: number;
            col?: number;
        }): string;
        StringWithTack(fullSaveLocation: string): string;
        StringTack(fullSaveLocation: string, httpSource?: boolean, relative?: boolean): import("source-map").RawSourceMap;
    }
}
declare module "@eas-framework/server/StringMethods/Splitting" {
    interface globalString<T> {
        indexOf(string: string): number;
        lastIndexOf(string: string): number;
        startsWith(string: string): boolean;
        substring(start: number, end?: number): T;
    }
    export function SplitFirst<T extends globalString<T>>(type: string, string: T): T[];
    export function CutTheLast(type: string, string: string): string;
    export function Extension<T extends globalString<T>>(string: T): T;
    export function trimType(type: string, string: string): string;
    export function substringStart<T extends globalString<T>>(start: string, string: T): T;
}
declare module "@eas-framework/server/RunTimeBuild/SearchFileSystem" {
    function getDirname(url: string): string;
    const SystemData: string;
    const workingDirectory: string;
    const getTypes: {
        Static: string[];
        Logs: string[];
        node_modules: string[];
        readonly WWW: string[];
    };
    const BasicSettings: {
        pageTypes: {
            page: string;
            model: string;
            component: string;
        };
        pageTypesArray: any[];
        pageCodeFile: {
            page: string[];
            model: string[];
            component: string[];
        };
        pageCodeFileArray: any[];
        partExtensions: string[];
        ReqFileTypes: {
            js: string;
            ts: string;
            'api-ts': string;
            'api-js': string;
        };
        ReqFileTypesArray: any[];
        WebSiteFolder: string;
        readonly fullWebSitePath: string;
        readonly tsConfig: string;
        tsConfigFile(): Promise<any>;
        relative(fullPath: string): string;
    };
    export function DeleteInDirectory(path: any): Promise<void>;
    export function smallPathToPage(smallPath: string): string;
    export function getTypeBySmallPath(smallPath: string): any;
    export { getDirname, SystemData, workingDirectory, getTypes, BasicSettings };
}
declare module "@eas-framework/server/OutputInput/Logger" {
    export interface PreventLog {
        id?: string;
        text: string;
        errorName: string;
        type?: "warn" | "error";
    }
    export const Settings: {
        PreventErrors: string[];
    };
    export const ClearWarning: () => number;
    /**
     * If the error is not in the PreventErrors array, print the error
     * @param {PreventLog}  - `id` - The id of the error.
     */
    export function createNewPrint({ id, text, type, errorName }: PreventLog): string[];
    export function LogToHTML(log: string): string;
}
declare module "@eas-framework/server/CompileCode/BaseReader/Reader" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import workerPool from 'workerpool';
    export const pool: workerPool.WorkerPool;
    export class BaseReader {
        /**
         * Find the end of quotation marks, skipping things like escaping: "\\""
         * @return the index of end
         */
        static findEntOfQ(text: string, qType: string): number;
        /**
         * Find char skipping data inside quotation marks
         * @return the index of end
         */
        static findEndOfDef(text: string, EndType: string[] | string): number;
        /**
         * Same as 'findEndOfDef' only with option to custom 'open' and 'close'
         * ```js
         * FindEndOfBlock(`cool "}" { data } } next`, '{', '}')
         * ```
         * it will return the 18 -> "} next"
         *  @return the index of end
         */
        static FindEndOfBlock(text: string, open: string, end: string): number;
    }
    export class InsertComponentBase {
        private printNew?;
        SimpleSkip: string[];
        SkipSpecialTag: string[][];
        constructor(printNew?: any);
        private printErrors;
        FindCloseChar(text: StringTracker, Search: string): Promise<any>;
        FindCloseCharHTML(text: StringTracker, Search: string): Promise<any>;
    }
    type ParseBlocks = {
        name: string;
        start: number;
        end: number;
    }[];
    export function RazorToEJS(text: string): Promise<ParseBlocks>;
    export function RazorToEJSMini(text: string, find: string): Promise<number[]>;
    export function EJSParser(text: string, start: string, end: string): Promise<ParseBlocks>;
}
declare module "@eas-framework/server/CompileCode/transform/EasyScript" {
    interface SplitText {
        text: string;
        type_name: string;
        is_skip: boolean;
    }
    export function ParseTextStream(text: string): Promise<SplitText[]>;
    export function EndOfDefSkipBlock(text: string, types: string[]): Promise<number>;
    export function EndOfBlock(text: string, types: string[]): Promise<number>;
    abstract class BaseEntityCode {
        ReplaceAll(text: string, find: string, replace: string): string;
    }
    abstract class ReBuildCodeBasic extends BaseEntityCode {
        ParseArray: SplitText[];
        constructor(ParseArray: SplitText[]);
        BuildCode(): string;
    }
    export class ReBuildCodeString extends ReBuildCodeBasic {
        private DataCode;
        constructor(ParseArray: SplitText[]);
        get CodeBuildText(): string;
        set CodeBuildText(value: string);
        get AllInputs(): string[];
        private CreateDataCode;
        /**
         * if the <||> start with a (+.) like that for example, "+.<||>", the update function will get the last "SkipText" instead getting the new one
         * same with a (-.) just for ignoring current value
         * @returns the builded code
         */
        BuildCode(): string;
    }
}
declare module "@eas-framework/server/CompileCode/JSParser" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    interface JSParserValues {
        type: 'text' | 'script' | 'no-track';
        text: StringTracker;
    }
    export default class JSParser {
        start: string;
        text: StringTracker;
        end: string;
        type: string;
        path: string;
        values: JSParserValues[];
        constructor(text: StringTracker, path: string, start?: string, end?: string, type?: string);
        ReplaceValues(find: string, replace: string): void;
        findEndOfDefGlobal(text: StringTracker): number;
        ScriptWithInfo(text: StringTracker): StringTracker;
        findScripts(): Promise<void>;
        static fixText(text: StringTracker | string): string | StringTracker;
        static fixTextSimpleQuotes(text: StringTracker | string): string | StringTracker;
        ReBuildText(): StringTracker;
        BuildAll(isDebug: boolean): StringTracker;
        static printError(message: string): string;
        static RunAndExport(text: StringTracker, path: string, isDebug: boolean): Promise<StringTracker>;
        private static split2FromEnd;
    }
    export class EnableGlobalReplace {
        private addText;
        private savedBuildData;
        private buildCode;
        private path;
        private replacer;
        constructor(addText?: string);
        load(code: StringTracker, path: string): Promise<void>;
        private ExtractAndSaveCode;
        private ParseOutsideOfComment;
        StartBuild(): Promise<string>;
        private RestoreAsCode;
        RestoreCode(code: StringTracker): StringTracker;
    }
}
declare module "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export type StringNumberMap = {
        [key: string]: number;
    };
    export type StringAnyMap = {
        [key: string]: any;
    };
    export type StringMap = {
        [key: string]: string;
    };
    export interface BuildInComponent {
        compiledString: StringTracker;
        checkComponents?: boolean;
    }
    export type CompileInFileFunc = (path: string, arrayType: string[], debugFromPage: string) => Promise<{
        CompiledData: StringTracker;
        dependenceObject: any;
    }>;
    export type BuildScriptWithoutModule = (code: StringTracker) => Promise<StringTracker> | StringTracker;
    export type StringArrayOrObject = (string | {
        [key: string]: string;
    })[];
}
declare module "@eas-framework/server/OutputInput/StoreJSON" {
    import { StringAnyMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    export default class StoreJSON {
        private savePath;
        store: StringAnyMap;
        constructor(filePath: string, autoLoad?: boolean);
        loadFile(): Promise<void>;
        update(key: string, value: any): void;
        /**
         * If the key is in the store, return the value. If not, create a new value, store it, and return it
         * @param {string} key - The key to look up in the store.
         * @param [create] - A function that returns a string.
         * @returns The value of the key in the store.
         */
        have(key: string, create?: () => string): any;
        clear(): void;
        save(): Promise<boolean>;
    }
}
declare module "@eas-framework/server/StringMethods/Id" {
    export default function createId(text: string, max?: number): string;
}
declare module "@eas-framework/server/EasyDebug/SourceMapLoad" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { RawSourceMap } from "source-map";
    export default function SourceMapToStringTracker(code: string, sourceMap: string | RawSourceMap): Promise<StringTracker>;
    export function backToOriginal(original: StringTracker, code: string, sourceMap: string | RawSourceMap): Promise<StringTracker>;
    export function backToOriginalSss(original: StringTracker, code: string, sourceMap: string | RawSourceMap, mySource: string): Promise<StringTracker>;
}
declare module "@eas-framework/server/CompileCode/transpiler/printMessage" {
    import { RawSourceMap } from 'source-map';
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export function parseSWCError(err: {
        message: string;
        stack: string;
        code: string;
    }, changeLocations?: (line: number, char: number, info: string) => {
        line: number;
        char: number;
        info: string;
    }): {
        errorCode: string;
        errorLines: string;
        errorFile: string;
        simpleMessage: string;
        fullMessage: string;
    };
    export function ESBuildPrintError(err: any): {
        errorCode: string;
        errorLines: string;
        errorFile: string;
        simpleMessage: string;
        fullMessage: string;
    };
    export function ESBuildPrintErrorSourceMap(err: any, sourceMap: RawSourceMap, sourceFile?: string): Promise<{
        errorCode: string;
        errorLines: string;
        errorFile: string;
        simpleMessage: string;
        fullMessage: string;
    }>;
    export function ESBuildPrintErrorStringTracker(base: StringTracker, err: any): {
        errorCode: string;
        errorLines: string;
        errorFile: string;
        simpleMessage: string;
        fullMessage: string;
    };
}
declare module "@eas-framework/server/ImportFiles/CustomImport/Extension/json" {
    export default function (path: string): Promise<any>;
}
declare module "@eas-framework/server/ImportFiles/CustomImport/Extension/wasm" {
    export default function (path: string): Promise<WebAssembly.Exports>;
}
declare module "@eas-framework/server/ImportFiles/CustomImport/Extension/index" {
    export const customTypes: string[];
    export default function ImportByExtension(path: string, type: string): Promise<any>;
}
declare module "@eas-framework/server/CompileCode/transform/EasySyntax" {
    export default class EasySyntax {
        private Build;
        load(code: string): Promise<void>;
        private actionStringImport;
        private actionStringExport;
        private actionStringImportAll;
        private actionStringExportAll;
        private BuildImportType;
        private BuildInOneWord;
        private replaceWithSpace;
        private Define;
        private BuildInAsFunction;
        private exportVariable;
        private exportBlock;
        BuildImports(defineData?: {
            [key: string]: string;
        }): Promise<void>;
        BuiltString(): string;
        static BuildAndExportImports(code: string, defineData?: {
            [key: string]: string;
        }): Promise<string>;
    }
}
declare module "@eas-framework/server/CompileCode/transpiler/settings" {
    import { Options as TransformOptions, JscConfig } from '@swc/core';
    export const esTarget = "es2022";
    export function Decorators(data: JscConfig): JscConfig;
    export function TransformJSC(data?: JscConfig): JscConfig;
    export function Commonjs(data: TransformOptions): TransformOptions;
}
declare module "@eas-framework/server/CompileCode/transform/Script" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    /**
     *
     * @param text
     * @param type
     * @returns
     */
    export default function BuildScript(text: StringTracker, isTypescript: boolean, sessionInfo: SessionBuild): Promise<StringTracker>;
}
declare module "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export default class TagDataParser {
        private text;
        valueArray: {
            key?: StringTracker;
            value: StringTracker | true;
            space: boolean;
            char?: string;
        }[];
        constructor(text: StringTracker);
        parser(): Promise<void>;
        private popItem;
        popTracker(key: string): StringTracker | null | boolean;
        popHaveDefaultTracker<T = string>(key: string, value?: T): StringTracker | null | T;
        popAnyTracker<T = string>(key: string, value?: T): string | null | T;
        popString(key: string): string | null | boolean;
        popBoolean(key: string, defaultValue?: boolean): boolean;
        exists(key: string): boolean;
        popHaveDefault<T = string>(key: string, value?: T): string | null | T;
        popAnyDefault<T = string>(key: string, value?: T): string | null | T;
        addClass(className: string): void;
        rebuildSpace(): StringTracker;
        pushValue(key: string, value: string): StringTracker;
        map(): {
            [key: string]: string | true;
        };
    }
}
declare module "@eas-framework/server/CompileCode/Session" {
    import SourceMapStore from "@eas-framework/server/EasyDebug/SourceMapStore";
    import { StringAnyMap, StringNumberMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export type setDataHTMLTag = {
        url: string;
        attributes?: StringAnyMap;
    };
    export type connectorInfo = {
        type: string;
        name: string;
        sendTo: string;
        validator: string[];
        order?: string[];
        notValid?: string;
        message?: string | boolean;
        responseSafe?: boolean;
    };
    export type connectorArray = connectorInfo[];
    export type cacheComponent = {
        [key: string]: null | {
            mtimeMs?: number;
            value?: string;
        };
    };
    export type inTagCache = {
        style: string[];
        script: string[];
        scriptModule: string[];
    };
    export class SessionBuild {
        smallPath: string;
        fullPath: string;
        typeName?: string;
        debug?: boolean;
        private _safeDebug?;
        connectorArray: connectorArray;
        private scriptURLSet;
        private styleURLSet;
        private inScriptStyle;
        headHTML: string;
        cache: inTagCache;
        cacheCompileScript: any;
        cacheComponent: cacheComponent;
        compileRunTimeStore: StringAnyMap;
        dependencies: StringNumberMap;
        recordNames: string[];
        get safeDebug(): boolean;
        constructor(smallPath: string, fullPath: string, typeName?: string, debug?: boolean, _safeDebug?: boolean);
        style(url: string, attributes?: StringAnyMap): void;
        script(url: string, attributes?: StringAnyMap): void;
        record(name: string): void;
        dependence(smallPath: string, fullPath?: string): Promise<boolean>;
        addScriptStyle(type: 'script' | 'style' | 'module', smallPath?: string): SourceMapStore;
        addScriptStylePage(type: 'script' | 'style' | 'module', dataTag: TagDataParser, info: StringTracker): SourceMapStore;
        private static createName;
        private addHeadTags;
        buildHead(): Promise<string>;
        extends(from: SessionBuild): void;
        BuildScriptWithPrams(code: StringTracker): Promise<StringTracker>;
    }
}
declare module "@eas-framework/server/CompileCode/XMLHelpers/CodeInfoAndDebug" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    function ParseDebugLine(code: StringTracker, path: string): Promise<StringTracker>;
    function ParseDebugInfo(code: StringTracker, path: string): Promise<StringTracker>;
    export function AddDebugInfo(isolate: boolean, pageName: string, FullPath: string, SmallPath: string, cache?: {
        value?: string;
    }): Promise<{
        allData: StringTracker;
        stringInfo: string;
    }>;
    export function CreateFilePathOnePath(filePath: string, inputPath: string, folder: string, pageType: string, pathType?: number): string;
    export interface PathTypes {
        SmallPathWithoutFolder?: string;
        SmallPath?: string;
        FullPath?: string;
        FullPathCompile?: string;
    }
    function CreateFilePath(filePath: string, smallPath: string, inputPath: string, folder: string, pageType: string): {
        SmallPath: string;
        FullPath: string;
    };
    export { ParseDebugLine, CreateFilePath, ParseDebugInfo };
}
declare module "@eas-framework/server/CompileCode/transpiler/minify" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export function minifyJS(text: string, tracker: StringTracker): Promise<string>;
}
declare module "@eas-framework/server/BuildInComponents/Components/client" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/script/load-options" {
    import { JscConfig } from '@swc/core';
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export function transpilerWithOptions(BetweenTagData: StringTracker, language: string, sourceMaps: boolean, BetweenTagDataString?: string, options?: JscConfig): Promise<{
        resultCode: string;
        resultMap: string;
    }>;
}
declare module "@eas-framework/server/BuildInComponents/Components/script/server" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(language: string, pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/script/client" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(language: string, tagData: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/script/index" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/style/sass" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import sass from 'sass';
    import { RawSourceMap } from "source-map-js";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    export function createImporter(originalPath: string): {
        findFileUrl(url: string): URL;
    };
    export function sassStyle(language: string): "compressed" | "expanded";
    export function sassSyntax(language: 'sass' | 'scss' | 'css'): "scss" | "css" | "indented";
    export function sassAndSource(sourceMap: RawSourceMap, source: string): void;
    export function getSassErrorLine({ sassStack }: {
        sassStack: any;
    }): {
        line: any;
        column: any;
    };
    export function PrintSassError(err: any, { line, column }?: {
        line: any;
        column: any;
    }): void;
    export function PrintSassErrorTracker(err: any, track: StringTracker): void;
    export function compileSass(language: string, BetweenTagData: StringTracker, sessionInfo: SessionBuild, outStyle?: string): Promise<{
        outStyle: string;
        result?: undefined;
        compressed?: undefined;
    } | {
        result: sass.CompileResult;
        outStyle: string;
        compressed: boolean;
    }>;
}
declare module "@eas-framework/server/BuildInComponents/Components/style/server" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(language: string, pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/style/client" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(language: string, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/style/index" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/OutputInput/StoreDeps" {
    import { StringNumberMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import StoreJSON from "@eas-framework/server/OutputInput/StoreJSON";
    export const pageDeps: StoreJSON;
    /**
     * Check if any of the dependencies of the page have changed
     * @param {string} path - The path to the page.
     * @param {StringNumberMap} dependencies - A map of dependencies. The key is the path to the file, and
     * the value is the last modified time of the file.
     * @returns A boolean value.
     */
    export function CheckDependencyChange(path: string, dependencies?: StringNumberMap): Promise<boolean>;
}
declare module "@eas-framework/server/BuildInComponents/Components/page" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/Components/isolate" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    export default function isolate(BetweenTagData: StringTracker): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/ImportFiles/ForStatic/Svelte/preprocess" {
    export function preprocess(fullPath: string, smallPath: string, savePath?: string, httpSource?: boolean, svelteExt?: string): Promise<{
        scriptLang: string;
        styleLang: string;
        code: string;
        map: import("source-map").RawSourceMap;
        dependencies: import("@eas-framework/server/CompileCode/XMLHelpers/CompileTypes").StringNumberMap;
        svelteFiles: string[];
    }>;
    export function Capitalize(name: string): string;
}
declare module "@eas-framework/server/ImportFiles/redirectCJS" {
    import clearModule from 'clear-module';
    const resolve: (path: string) => string;
    export default function (filePath: string): any;
    export { clearModule, resolve };
}
declare module "@eas-framework/server/ImportFiles/ForStatic/Svelte/error" {
    import { Warning } from "svelte/types/compiler/interfaces";
    import { RawSourceMap } from "source-map";
    export function PrintSvelteError({ message, code, start, frame }: Warning, filePath: string, sourceMap: RawSourceMap): Promise<void>;
    export function PrintSvelteWarn(warnings: Warning[], filePath: string, sourceMap: RawSourceMap): Promise<void>;
}
declare module "@eas-framework/server/ImportFiles/ForStatic/Svelte/ssr" {
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    export default function registerExtension(filePath: string, smallPath: string, sessionInfo: SessionBuild): Promise<string>;
}
declare module "@eas-framework/server/BuildInComponents/Components/svelte" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(type: StringTracker, dataTag: TagDataParser, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/CompileCode/CssMinimizer" {
    export default function MinCss(code: string): string;
}
declare module "@eas-framework/server/BuildInComponents/Components/markdown" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, session: SessionBuild): Promise<BuildInComponent>;
    export function minifyMarkdownTheme(): Promise<void>;
    export function autoCodeTheme(): Promise<string>;
}
declare module "@eas-framework/server/BuildInComponents/Components/head" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
    export function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild, fullCompilePath: string): Promise<StringTracker>;
}
declare module "@eas-framework/server/BuildInComponents/Components/serv-connect/index" {
    export function compileValues(value: string): string;
    export function makeValidationJSON(args: any[], validatorArray: any[]): Promise<boolean | string[]>;
    export function parseValues(args: any[], validatorArray: any[]): any[];
}
declare module "@eas-framework/server/BuildInComponents/Components/serv-connect/connect-node" {
    import { connectorInfo, SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export function addFinalizeBuildAnyConnection(connectName: string, connectorCall: string, connectionType: string, pageData: StringTracker, sessionInfo: SessionBuild, buildArguments: (info: connectorInfo) => string, { returnData }?: {
        returnData?: boolean;
    }): StringTracker;
}
declare module "@eas-framework/server/BuildInComponents/Components/connect" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import type { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, { SomePlugins }: {
        SomePlugins: any;
    }, sessionInfo: SessionBuild): Promise<BuildInComponent>;
    export function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild): StringTracker;
    export function handelConnector(thisPage: any, connector: any): Promise<boolean>;
}
declare module "@eas-framework/server/BuildInComponents/Components/form" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
    export function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild): StringTracker;
    export function handelConnector(thisPage: any, connectorInfo: any): Promise<void>;
}
declare module "@eas-framework/server/BuildInComponents/Components/record" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export function makeRecordPath(defaultName: string, dataTag: TagDataParser, sessionInfo: SessionBuild): {
        store: any;
        current: any;
        link: string;
    };
    export default function BuildCode(pathName: string, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
    export function deleteBeforeReBuild(smallPath: string): void;
    export function updateRecords(session: SessionBuild): Promise<void>;
    export function perCompile(): void;
    export function postCompile(): Promise<void>;
}
declare module "@eas-framework/server/BuildInComponents/Components/search" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export default function BuildCode(pathName: string, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
}
declare module "@eas-framework/server/BuildInComponents/index" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { BuildInComponent } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    export const AllBuildIn: string[];
    export function StartCompiling(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent>;
    export function IsInclude(tagname: string): boolean;
    export function finalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild, fullCompilePath: string): Promise<StringTracker>;
    export function handelConnectorService(type: string, thisPage: any, connector: any): Promise<boolean> | Promise<void>;
    export function perCompile(): Promise<void>;
    export function postCompile(): Promise<void>;
    export function perCompilePage(sessionInfo: SessionBuild, fullCompilePath: string): Promise<void>;
    export function postCompilePage(sessionInfo: SessionBuild, fullCompilePath: string): Promise<void>;
}
declare module "@eas-framework/server/Plugins/Syntax/RazorSyntax" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export default function ConvertSyntax(text: StringTracker, options?: any): Promise<StringTracker>;
    /**
     * ConvertSyntaxMini takes the code and a search string and convert curly brackets
     * @param {StringTracker} text - The string to be converted.
     * @param {string} find - The string to search for.
     * @param {string} addEJS - The string to add to the start of the ejs.
     * @returns A string.
     */
    export function ConvertSyntaxMini(text: StringTracker, find: string, addEJS: string): Promise<StringTracker>;
}
declare module "@eas-framework/server/Plugins/Syntax/Index" {
    export default function GetSyntax(CompileType: any): any;
}
declare module "@eas-framework/server/Plugins/Index" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    export default class AddPlugin {
        SettingsObject: any;
        constructor(SettingsObject: {
            [key: string]: any;
        });
        private get defaultSyntax();
        BuildBasic(text: StringTracker, OData: string | any, path: string, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
        /**
         * Execute plugins for pages
         * @param text all the code
         * @param path file location
         * @param pathName file location without start folder (small path)
         * @returns compiled code
         */
        BuildPage(text: StringTracker, path: string, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
        /**
         * Execute plugins for components
         * @param text all the code
         * @param path file location
         * @param pathName file location without start folder (small path)
         * @returns compiled code
         */
        BuildComponent(text: StringTracker, path: string, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
    }
}
declare module "@eas-framework/server/CompileCode/XMLHelpers/Extricate" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    function searchForCutMain(data: StringTracker, array: string[], sing: string, bigTag?: boolean, searchFor?: boolean): SearchCutOutput;
    interface SearchCutData {
        tag: string;
        data: StringTracker;
        loc: number;
    }
    interface SearchCutOutput {
        data?: StringTracker;
        error?: boolean;
        found?: SearchCutData[];
    }
    export { searchForCutMain as getDataTags };
}
declare module "@eas-framework/server/Global/SearchRecord" {
    import { SearchOptions, SearchResult } from 'minisearch';
    export default class SearchRecord {
        private fullPath;
        private indexData;
        private miniSearch;
        constructor(filepath: string);
        load(): Promise<void>;
        /**
         * It searches for a string and returns an array of matches
         * @param text - The text to search for.
         * @param options - length - maximum length - *not cutting half words*
         *
         * addAfterMaxLength - add text if a text result reach the maximum length, for example '...'
         * @param tag - The tag to wrap around the founded search terms.
         * @returns An array of objects, each object containing the `text` of the search result, `link` to the page, and an array of
         * objects containing the terms and the index of the term in the text.
         */
        search(text: string, options?: SearchOptions & {
            length?: number;
            addAfterMaxLength?: string;
        }, tag?: string): (SearchResult & {
            text: string;
            url: string;
        })[];
        suggest(text: string, options: SearchOptions): import("minisearch").Suggestion[];
    }
}
declare module "@eas-framework/server/ImportFiles/CustomImport/Alias/packageExport" {
    import SearchRecord from "@eas-framework/server/Global/SearchRecord";
    export default function (): {
        Settings: import("@eas-framework/server/MainBuild/SettingsTypes").ExportSettings;
        SearchRecord: typeof SearchRecord;
    };
}
declare module "@eas-framework/server/ImportFiles/CustomImport/Alias/index" {
    export const aliasNames: any[];
    export default function ImportAlias(originalPath: string): any;
    export function AliasOrPackage(originalPath: string): any;
}
declare module "@eas-framework/server/ImportFiles/CustomImport/index" {
    export function isPathCustom(originalPath: string, extension: string): boolean;
    export default function CustomImport(originalPath: string, fullPath: string, extension: string, require: (p: string) => Promise<any>): Promise<any>;
}
declare module "@eas-framework/server/ImportFiles/Script" {
    import { StringAnyMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    export function BuildScriptSmallPath(InStaticPath: string, typeArray: string[], isDebug?: boolean): Promise<string>;
    export function AddExtension(FilePath: string): string;
    /**
     * LoadImport is a function that takes a path to a file, and returns the module that is at that path
     * @param {string[]} importFrom - The path to the file that created this import.
     * @param {string} InStaticPath - The path to the file that you want to import.
     * @param {StringAnyMap} [useDeps] - This is a map of dependencies that will be used by the page.
     * @param {string[]} withoutCache - an array of paths that will not be cached.
     * @returns The module that was imported.
     */
    export default function LoadImport(importFrom: string[], InStaticPath: string, typeArray: string[], { isDebug, useDeps, withoutCache, onlyPrepare }: {
        isDebug: boolean;
        useDeps?: StringAnyMap;
        withoutCache?: string[];
        onlyPrepare?: boolean;
    }): Promise<any>;
    export function ImportFile(importFrom: string, InStaticPath: string, typeArray: string[], isDebug?: boolean, useDeps?: StringAnyMap, withoutCache?: string[]): Promise<any>;
    export function RequireOnce(filePath: string, isDebug: boolean): Promise<any>;
    export function RequireCjsScript(content: string): Promise<any>;
    /**
     * It takes a fake script location, a file location, a type array, and a boolean for whether or not it's
     * a TypeScript file. It then compiles the script and returns a function that will run the module
     * This is for RunTime Compile Scripts
     * @param {string} globalPrams - string, scriptLocation: string, inStaticLocationRelative: string,
     * typeArray: string[], isTypeScript: boolean, isDebug: boolean, fileCode: string,  sourceMapComment:
     * string
     * @param {string} scriptLocation - The location of the script to be compiled.
     * @param {string} inStaticLocationRelative - The relative path to the file from the static folder.
     * @param {string[]} typeArray - [string, string]
     * @param {boolean} isTypeScript - boolean, isDebug: boolean, fileCode: string,  sourceMapComment:
     * string
     * @param {boolean} isDebug - If true, the code will be compiled with debug information.
     * @param {string} fileCode - The code that will be compiled and saved to the file.
     * @param {string} sourceMapComment - string
     * @returns A function that returns a promise.
     */
    export function compileImport(globalPrams: string, scriptLocation: string, inStaticLocationRelative: string, typeArray: string[], isTypeScript: boolean, isDebug: boolean, mergeTrack: StringTracker): Promise<(...arr: any[]) => Promise<any>>;
}
declare module "@eas-framework/server/CompileCode/CompileScript/Compile" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import { StringAnyMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    export default class CRunTime {
        script: StringTracker;
        sessionInfo: SessionBuild;
        smallPath: string;
        isTs: boolean;
        define: {};
        constructor(script: StringTracker, sessionInfo: SessionBuild, smallPath: string, isTs: boolean);
        private templateScript;
        private methods;
        private rebuildCode;
        compile(attributes?: StringAnyMap): Promise<StringTracker>;
    }
}
declare module "@eas-framework/server/CompileCode/CompileScript/PageBase" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { StringAnyMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    export const settings: {
        define: {};
    };
    export default class ParseBasePage {
        private sessionInfo?;
        code?: StringTracker;
        isTs?: boolean;
        clearData: StringTracker;
        scriptFile: StringTracker;
        valueArray: {
            key: string;
            value: StringTracker | true;
            char?: string;
        }[];
        constructor(sessionInfo?: SessionBuild, code?: StringTracker, isTs?: boolean);
        nonDynamic(isDynamic: boolean): boolean;
        loadSettings(pagePath: string, smallPath: string, pageName: string, { attributes, dynamicCheck }: {
            attributes?: StringAnyMap;
            dynamicCheck?: boolean;
        }): Promise<boolean>;
        private parseBase;
        private rebuild;
        static rebuildBaseInheritance(code: StringTracker): Promise<StringTracker>;
        get(name: string): true | StringTracker;
        pop(name: string): true | StringTracker;
        popAny(name: string): true | StringTracker;
        byValue(value: string): string[];
        replaceValue(name: string, value: StringTracker): void;
        defaultValuePopAny<T>(name: string, defaultValue: T): string | T | null;
        private loadCodeFile;
        private loadSetting;
        private loadDefine;
    }
}
declare module "@eas-framework/server/CompileCode/InsertComponent" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import AddPlugin from "@eas-framework/server/Plugins/Index";
    import { CompileInFileFunc, StringArrayOrObject } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    import { InsertComponentBase } from "@eas-framework/server/CompileCode/BaseReader/Reader";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import TagDataParser from "@eas-framework/server/CompileCode/XMLHelpers/TagDataParser";
    interface DefaultValues {
        value: StringTracker;
        elements: string[];
    }
    export default class InsertComponent extends InsertComponentBase {
        dirFolder: string;
        PluginBuild: AddPlugin;
        CompileInFile: CompileInFileFunc;
        MicroPlugins: StringArrayOrObject;
        GetPlugin: (name: string) => any;
        SomePlugins: (...names: string[]) => boolean;
        isTs: () => boolean;
        get regexSearch(): RegExp;
        constructor(PluginBuild: AddPlugin);
        FindSpecialTagByStart(string: string): string[];
        findIndexSearchTag(query: string, tag: StringTracker): number;
        CheckMinHTML(code: StringTracker): StringTracker;
        CheckMinHTMLText(code: StringTracker): StringTracker;
        ReBuildTag(type: StringTracker, dataTag: StringTracker, dataTagSpliced: TagDataParser, BetweenTagData: StringTracker, SendDataFunc: (text: StringTracker) => Promise<StringTracker>): Promise<StringTracker>;
        exportDefaultValues(fileData: StringTracker, foundSetters?: DefaultValues[]): any;
        addDefaultValues(arrayValues: DefaultValues[], fileData: StringTracker): StringTracker;
        parseComponentProps(tagData: TagDataParser, component: StringTracker): StringTracker;
        buildTagBasic(fileData: StringTracker, tagData: TagDataParser, path: string, SmallPath: string, pathName: string, sessionInfo: SessionBuild, BetweenTagData?: StringTracker): Promise<StringTracker>;
        static addSpacialAttributes(data: TagDataParser, type: StringTracker, BetweenTagData: StringTracker): {
            [key: string]: string | true;
        };
        insertTagData(pathName: string, type: StringTracker, dataTag: StringTracker, { BetweenTagData, sessionInfo }: {
            sessionInfo: SessionBuild;
            BetweenTagData?: StringTracker;
        }): Promise<StringTracker>;
        private CheckDoubleSpace;
        StartReplace(data: StringTracker, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
        private RemoveUnnecessarySpace;
        Insert(data: StringTracker, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
    }
}
declare module "@eas-framework/server/CompileCode/ScriptTemplate" {
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import JSParser from "@eas-framework/server/CompileCode/JSParser";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    export class PageTemplate extends JSParser {
        private static AddPageTemplate;
        static BuildPage(text: StringTracker, sessionInfo: SessionBuild): Promise<StringTracker>;
        static AddAfterBuild(text: StringTracker, isDebug: boolean): StringTracker;
        static InPageTemplate(text: StringTracker, dataObject: any, fullPath: string): StringTracker;
    }
}
declare module "@eas-framework/server/BuildInComponents/Settings" {
    export const Settings: {
        plugins: any[];
    };
}
declare module "@eas-framework/server/CompileCode/InsertModels" {
    import InsertComponent from "@eas-framework/server/CompileCode/InsertComponent";
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    export const Settings: {
        AddCompileSyntax: any[];
        plugins: any[];
        BasicCompilationSyntax: string[];
    };
    export const Components: InsertComponent;
    export function GetPlugin(name: string): any;
    export function SomePlugins(...data: string[]): boolean;
    export function isTs(): boolean;
    export function Insert(data: string, fullPathCompile: string, nestedPage: boolean, nestedPageData: string, sessionInfo: SessionBuild, dynamicCheck?: boolean): Promise<StringTracker>;
}
declare module "@eas-framework/server/ImportFiles/ForStatic/Script" {
    export function BuildJS(inStaticPath: string, isDebug: boolean): Promise<{
        thisFile: any;
    }>;
    export function BuildTS(inStaticPath: string, isDebug: boolean): Promise<{
        thisFile: any;
    }>;
    export function BuildJSX(inStaticPath: string, isDebug: boolean): Promise<{
        thisFile: any;
    }>;
    export function BuildTSX(inStaticPath: string, isDebug: boolean): Promise<{
        thisFile: any;
    }>;
}
declare module "@eas-framework/server/ImportFiles/ForStatic/Svelte/client" {
    export default function BuildScript(inStaticPath: string, isDebug: boolean): Promise<{
        thisFile: any;
    }>;
}
declare module "@eas-framework/server/ImportFiles/ForStatic/Style" {
    export function BuildStyleSass(inputPath: string, type: "sass" | "scss" | "css", isDebug: boolean): Promise<{
        [key: string]: number;
    }>;
}
declare module "@eas-framework/server/ImportFiles/StaticFiles" {
    import { Response, Request } from '@tinyhttp/app';
    export default function BuildFile(SmallPath: string, isDebug: boolean, fullCompilePath?: string): Promise<boolean>;
    interface buildIn {
        path?: string;
        ext?: string;
        type: string;
        inServer?: string;
    }
    export function serverBuild(Request: Request, isDebug: boolean, path: string, checked?: boolean): Promise<null | buildIn>;
    export function rebuildFile(SmallPath: string, fullCompilePath: string, isDebug: boolean): Promise<boolean>;
    export function GetFile(SmallPath: string, isDebug: boolean, Request: Request, Response: Response): Promise<void>;
}
declare module "@eas-framework/server/MainBuild/ImportModule" {
    export function StartRequire(array: string[], isDebug: boolean): Promise<any[]>;
    export function GetSettings(filePath: string, isDebug: boolean): Promise<any>;
    export function getSettingsDate(): number;
}
declare module "@eas-framework/server/RunTimeBuild/CompileState" {
    export default class CompileState {
        private state;
        static filePath: string;
        constructor();
        get scripts(): string[];
        get pages(): string[][];
        get files(): string[];
        addPage(path: string, type: string): void;
        addImport(path: string): void;
        addFile(path: string): void;
        export(): Promise<boolean>;
        static checkLoad(): Promise<CompileState>;
    }
}
declare module "@eas-framework/server/MainBuild/SettingsTypes" {
    import { JscConfig as TransformOptions } from '@swc/core';
    import { Request, Response, NextFunction } from '@tinyhttp/app';
    import * as fileByUrl from "@eas-framework/server/RunTimeBuild/GetPages";
    export interface GreenLockSite {
        subject: string;
        altnames: string[];
    }
    interface formidableServer {
        maxFileSize: number;
        uploadDir: string;
        multiples: boolean;
        maxFieldsSize: number;
    }
    type TinyhttpPlugin = (req: Request, res: Response<any>, next?: NextFunction) => void;
    /**
     * example:
     * @param subject example.com
     * @param altnames: www.example.com, cool.example.com
     */
    interface SiteSettings {
        subject: string;
        altnames: string[];
    }
    interface JSXOptions extends TransformOptions {
        name: "JSXOptions";
    }
    interface TSXOptions extends TransformOptions {
        name: "TSXOptions";
    }
    interface transformOptions extends TransformOptions {
        name: "transformOptions";
    }
    interface Markdown {
        name: "markdown";
        codeTheme: 'none' | 'atom-one' | 'a11y-dark' | 'a11y-light' | 'agate' | 'an-old-hope' | 'androidstudio' | 'arduino-light' | 'arta' | 'ascetic' | 'atom-one-dark-reasonable' | 'atom-one-dark' | 'atom-one-light' | 'base16/3024' | 'base16/apathy' | 'base16/apprentice' | 'base16/ashes' | 'base16/atelier-cave-light' | 'base16/atelier-cave' | 'base16/atelier-dune-light' | 'base16/atelier-dune' | 'base16/atelier-estuary-light' | 'base16/atelier-estuary' | 'base16/atelier-forest-light' | 'base16/atelier-forest' | 'base16/atelier-heath-light' | 'base16/atelier-heath' | 'base16/atelier-lakeside-light' | 'base16/atelier-lakeside' | 'base16/atelier-plateau-light' | 'base16/atelier-plateau' | 'base16/atelier-savanna-light' | 'base16/atelier-savanna' | 'base16/atelier-seaside-light' | 'base16/atelier-seaside' | 'base16/atelier-sulphurpool-light' | 'base16/atelier-sulphurpool' | 'base16/atlas' | 'base16/bespin' | 'base16/black-metal-bathory' | 'base16/black-metal-burzum' | 'base16/black-metal-dark-funeral' | 'base16/black-metal-gorgoroth' | 'base16/black-metal-immortal' | 'base16/black-metal-khold' | 'base16/black-metal-marduk' | 'base16/black-metal-mayhem' | 'base16/black-metal-nile' | 'base16/black-metal-venom' | 'base16/black-metal' | 'base16/brewer' | 'base16/bright' | 'base16/brogrammer' | 'base16/brush-trees-dark' | 'base16/brush-trees' | 'base16/chalk' | 'base16/circus' | 'base16/classic-dark' | 'base16/classic-light' | 'base16/codeschool' | 'base16/colors' | 'base16/cupcake' | 'base16/cupertino' | 'base16/danqing' | 'base16/darcula' | 'base16/dark-violet' | 'base16/darkmoss' | 'base16/darktooth' | 'base16/decaf' | 'base16/default-dark' | 'base16/default-light' | 'base16/dirtysea' | 'base16/dracula' | 'base16/edge-dark' | 'base16/edge-light' | 'base16/eighties' | 'base16/embers' | 'base16/equilibrium-dark' | 'base16/equilibrium-gray-dark' | 'base16/equilibrium-gray-light' | 'base16/equilibrium-light' | 'base16/espresso' | 'base16/eva-dim' | 'base16/eva' | 'base16/flat' | 'base16/framer' | 'base16/fruit-soda' | 'base16/gigavolt' | 'base16/github' | 'base16/google-dark' | 'base16/google-light' | 'base16/grayscale-dark' | 'base16/grayscale-light' | 'base16/green-screen' | 'base16/gruvbox-dark-hard' | 'base16/gruvbox-dark-medium' | 'base16/gruvbox-dark-pale' | 'base16/gruvbox-dark-soft' | 'base16/gruvbox-light-hard' | 'base16/gruvbox-light-medium' | 'base16/gruvbox-light-soft' | 'base16/hardcore' | 'base16/harmonic16-dark' | 'base16/harmonic16-light' | 'base16/heetch-dark' | 'base16/heetch-light' | 'base16/helios' | 'base16/hopscotch' | 'base16/horizon-dark' | 'base16/horizon-light' | 'base16/humanoid-dark' | 'base16/humanoid-light' | 'base16/ia-dark' | 'base16/ia-light' | 'base16/icy-dark' | 'base16/ir-black' | 'base16/isotope' | 'base16/kimber' | 'base16/london-tube' | 'base16/macintosh' | 'base16/marrakesh' | 'base16/materia' | 'base16/material-darker' | 'base16/material-lighter' | 'base16/material-palenight' | 'base16/material-vivid' | 'base16/material' | 'base16/mellow-purple' | 'base16/mexico-light' | 'base16/mocha' | 'base16/monokai' | 'base16/nebula' | 'base16/nord' | 'base16/nova' | 'base16/ocean' | 'base16/oceanicnext' | 'base16/one-light' | 'base16/onedark' | 'base16/outrun-dark' | 'base16/papercolor-dark' | 'base16/papercolor-light' | 'base16/paraiso' | 'base16/pasque' | 'base16/phd' | 'base16/pico' | 'base16/pop' | 'base16/porple' | 'base16/qualia' | 'base16/railscasts' | 'base16/rebecca' | 'base16/ros-pine-dawn' | 'base16/ros-pine-moon' | 'base16/ros-pine' | 'base16/sagelight' | 'base16/sandcastle' | 'base16/seti-ui' | 'base16/shapeshifter' | 'base16/silk-dark' | 'base16/silk-light' | 'base16/snazzy' | 'base16/solar-flare-light' | 'base16/solar-flare' | 'base16/solarized-dark' | 'base16/solarized-light' | 'base16/spacemacs' | 'base16/summercamp' | 'base16/summerfruit-dark' | 'base16/summerfruit-light' | 'base16/synth-midnight-terminal-dark' | 'base16/synth-midnight-terminal-light' | 'base16/tango' | 'base16/tender' | 'base16/tomorrow-night' | 'base16/tomorrow' | 'base16/twilight' | 'base16/unikitty-dark' | 'base16/unikitty-light' | 'base16/vulcan' | 'base16/windows-10-light' | 'base16/windows-10' | 'base16/windows-95-light' | 'base16/windows-95' | 'base16/windows-high-contrast-light' | 'base16/windows-high-contrast' | 'base16/windows-nt-light' | 'base16/windows-nt' | 'base16/woodland' | 'base16/xcode-dusk' | 'base16/zenburn' | 'brown-paper' | 'codepen-embed' | 'color-brewer' | 'dark' | 'default' | 'devibeans' | 'docco' | 'far' | 'foundation' | 'github-dark-dimmed' | 'github-dark' | 'github' | 'gml' | 'googlecode' | 'gradient-dark' | 'gradient-light' | 'grayscale' | 'hybrid' | 'idea' | 'intellij-light' | 'ir-black' | 'isbl-editor-dark' | 'isbl-editor-light' | 'kimbie-dark' | 'kimbie-light' | 'lightfair' | 'lioshi' | 'magula' | 'mono-blue' | 'monokai-sublime' | 'monokai' | 'night-owl' | 'nnfx-dark' | 'nnfx-light' | 'nord' | 'obsidian' | 'paraiso-dark' | 'paraiso-light' | 'pojoaque' | 'purebasic' | 'qtcreator-dark' | 'qtcreator-light' | 'rainbow' | 'routeros' | 'school-book' | 'shades-of-purple' | 'srcery' | 'stackoverflow-dark' | 'stackoverflow-light' | 'sunburst' | 'tomorrow-night-blue' | 'tomorrow-night-bright' | 'vs' | 'vs2015' | 'xcode' | 'xt256';
        theme: 'dark' | 'light' | 'auto' | 'none';
        headerLink: boolean;
        attrs: boolean;
        abbr: boolean;
        copyCode: boolean;
        linkify: boolean;
        breaks: boolean;
        typographer: boolean;
        hljsClass: boolean;
    }
    type pluginsOptions = "MinAll" | "MinHTML" | "MinCss" | "MinSass" | "MinJS" | "MinTS" | "MinJSX" | JSXOptions | "MinTSX" | TSXOptions | transformOptions | "SafeDebug" | Markdown;
    export interface serveLimits {
        cacheDays?: number;
        fileLimitMB?: number;
        requestLimitMB?: number;
        cookiesExpiresDays?: number;
        sessionTotalRamMB?: number;
        sessionTimeMinutes?: number;
        sessionCheckPeriodMinutes?: number;
    }
    interface GlobalSettings {
        general?: {
            pageInRam?: boolean;
            importOnLoad?: ((...data: any) => any)[];
        };
        compile?: {
            compileSyntax?: ("Razor" | "TypeScript" | string | {
                [key: string]: any;
            })[];
            ignoreError?: ("close-tag" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" | "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning" | "markdown-parser")[];
            plugins?: pluginsOptions[];
            define: {
                [key: string]: string | number | boolean | null;
            };
        };
        routing?: {
            rules?: {
                [key: string]: ((url: string, req?: Request, res?: Response<any>) => string | Promise<string>);
            };
            validPath: ((url: string, req?: Request, res?: Response<any>) => boolean | Promise<boolean>)[];
            errorPages?: fileByUrl.ErrorPages;
            urlStop?: string[];
            ignoreTypes?: string[];
            ignorePaths?: string[];
            sitemap?: boolean | {
                rules?: boolean;
                urlStop?: boolean;
                errorPages?: boolean;
                validPath?: boolean;
                file?: string;
            };
        };
        serveLimits: serveLimits;
        serve?: {
            port?: number;
            http2?: boolean;
            greenLock?: {
                staging?: null;
                cluster?: null;
                email?: string;
                agent?: null;
                agreeToTerms?: boolean;
                sites?: SiteSettings[];
            };
        };
    }
    export interface ExportSettings extends GlobalSettings {
        development: boolean;
        settingsPath: string;
        middleware: {
            cookies: TinyhttpPlugin;
            cookieEncrypter: TinyhttpPlugin;
            session: TinyhttpPlugin;
            bodyParser: TinyhttpPlugin;
            formidable: formidableServer;
        };
        secret: {
            cookies: string;
            session: string;
        };
        implDev?: GlobalSettings;
        implProd?: GlobalSettings;
    }
}
declare module "@eas-framework/server/RunTimeBuild/FileTypes" {
    /**
     * Given a file name and an extension, return true if the file name ends with the extension
     * @param {string} name - The name of the file.
     * @param {string} extname - the extension to check for.
     * @returns A boolean value.
     */
    export function extensionIs(name: string, extname: string): boolean;
    /**
     * Check if the file name ends with one of the given file types.
     * @param {string[]} types - an array of file extensions to match.
     * @param {string} name - The name of the file.
     * @returns A boolean value.
     */
    export function isFileType(types: string[], name: string): boolean;
    /**
     * Remove the last dot and everything after it from a string
     * @param {string} string - The string to remove the end type from.
     * @returns The string without the last character.
     */
    export function RemoveEndType(string: string): string;
}
declare module "@eas-framework/server/RunTimeBuild/SiteMap" {
    import { ExportSettings } from "@eas-framework/server/MainBuild/SettingsTypes";
    import CompileState from "@eas-framework/server/RunTimeBuild/CompileState";
    export function debugSiteMap(Export: ExportSettings): Promise<void>;
    export function createSiteMap(Export: ExportSettings, state: CompileState): Promise<void>;
}
declare module "@eas-framework/server/RunTimeBuild/SearchPages" {
    import { SessionBuild } from "@eas-framework/server/CompileCode/Session";
    import { ExportSettings } from "@eas-framework/server/MainBuild/SettingsTypes";
    import StringTracker from "@eas-framework/server/EasyDebug/StringTracker";
    /**
     * when page call other page;
     */
    export function FastCompileInFile(path: string, arrayType: string[], { hasSessionInfo, nestedPage, nestedPageData, dynamicCheck }?: {
        hasSessionInfo?: SessionBuild;
        nestedPage?: string;
        nestedPageData?: string;
        dynamicCheck?: boolean;
    }): Promise<{
        CompiledData: StringTracker;
        sessionInfo: SessionBuild;
    }>;
    export function FastCompile(path: string, arrayType: string[], dynamicCheck?: boolean): Promise<void>;
    export function compileAll(Export: ExportSettings): Promise<() => Promise<void>>;
}
declare module "@eas-framework/server/RunTimeBuild/ImportFileRuntime" {
    import { StringAnyMap } from "@eas-framework/server/CompileCode/XMLHelpers/CompileTypes";
    type RequireFiles = {
        path: string;
        status?: number;
        model: any;
        dependencies?: StringAnyMap;
        static?: boolean;
    };
    /**
     * It imports a file and returns the model.
     * @param {string} filePath - The path to the file that you want to import.
     * @param {string} __filename - The filename of the file that is currently being executed.
     * @param {string} __dirname - The directory of the file that is currently being executed.
     * @param {string[]} typeArray - paths types.
     * @param LastRequire - A map of all the files that have been required so far.
     * @param {boolean} isDebug - boolean
     * @returns The model that is being imported.
     */
    export default function RequireFile(filePath: string, __filename: string, __dirname: string, typeArray: string[], LastRequire: {
        [key: string]: RequireFiles;
    }, isDebug: boolean): Promise<any>;
}
declare module "@eas-framework/server/RunTimeBuild/FunctionScript" {
    import { Request, Response } from '@tinyhttp/app';
    import { Files } from 'formidable';
    import { SplitFirst } from "@eas-framework/server/StringMethods/Splitting";
    const Export: {
        PageLoadRam: {};
        PageRam: boolean;
    };
    function getFullPathCompile(url: string): string;
    /**
     * It loads a page.
     * @param {string} url - The URL of the page to load.
     * @param ext - The extension of the file.
     * @returns A function that takes a data object and returns a string.
     */
    function LoadPage(url: string, isDebug: boolean): Promise<any>;
    /**
     * It takes a function that prepare a page, and returns a function that loads a page
     * @param LoadPageFunc - A function that takes in a page to execute on
     * @param {string} run_script_name - The name of the script to run.
     * @returns a function that returns a promise.
     */
    function BuildPage(LoadPageFunc: (...data: any[]) => void, run_script_name: string): (Response: Response<any>, Request: Request, Post: {
        [key: string]: any;
    }, Query: {
        [key: string]: any;
    }, Cookies: {
        [key: string]: any;
    }, Session: {
        [key: string]: any;
    }, Files: Files, isDebug: boolean) => Promise<{
        out_run_script: string;
        redirectPath: any;
    }>;
    export { LoadPage, BuildPage, getFullPathCompile, Export, SplitFirst };
}
declare module "@eas-framework/server/RunTimeBuild/ApiCall" {
    export default function (Request: any, Response: any, url: string, isDebug: boolean, nextPrase: () => Promise<any>): Promise<boolean>;
}
declare module "@eas-framework/server/RunTimeBuild/GetPages" {
    import { Request, Response } from '@tinyhttp/app';
    export interface ErrorPages {
        notFound?: {
            path: string;
            code?: number;
        };
        serverError?: {
            path: string;
            code?: number;
        };
    }
    interface GetPagesSettings {
        CacheDays: number;
        DevMode: boolean;
        CookieSettings?: any;
        Cookies?: (...args: any[]) => Promise<any>;
        CookieEncrypter?: (...args: any[]) => Promise<any>;
        SessionStore?: (...args: any[]) => Promise<any>;
        ErrorPages: ErrorPages;
    }
    const Settings: GetPagesSettings;
    function LoadAllPagesToRam(isDebug: boolean): Promise<void>;
    function ClearAllPagesFromRam(): void;
    function GetErrorPage(code: number, LocSettings: 'notFound' | 'serverError'): {
        url: string;
        arrayType: string[];
        code: number;
    };
    function DynamicPage(Request: Request | any, Response: Response | any, url: string, arrayType?: string[], code?: number): Promise<void>;
    function urlFix(url: string): string;
    export { Settings, DynamicPage, LoadAllPagesToRam, ClearAllPagesFromRam, urlFix, GetErrorPage };
}
declare module "@eas-framework/server/MainBuild/Settings" {
    import { ExportSettings } from "@eas-framework/server/MainBuild/SettingsTypes";
    export function pageInRamActivateFunc(): () => Promise<void>;
    export const Export: ExportSettings;
    export function buildFormidable(): void;
    export function buildBodyParser(): void;
    export function buildSession(): void;
    export function requireSettings(): Promise<void>;
    export function waitProductionPromise(): Promise<void>;
    export function buildFirstLoad(): void;
}
declare module "@eas-framework/server/MainBuild/ListenGreenLock" {
    import http from 'http';
    import http2 from 'http2';
    /**
     * If you want to use greenlock, it will create a server that will serve your app over https
     * @param app - The tinyHttp application object.
     * @returns A promise that resolves the server methods
     */
    export function UpdateGreenLock(app: any): Promise<{
        server: http.Server;
        listen(port: number): Promise<unknown>;
        close(): void;
    } | {
        server: any;
        listen: (port: any) => Promise<[unknown, unknown]>;
        close: () => void;
    } | {
        server: http2.Http2SecureServer;
        listen(port: any): void;
        stop(): void;
    }>;
}
declare module "@eas-framework/server/MainBuild/Server" {
    import { Export as Settings } from "@eas-framework/server/MainBuild/Settings";
    import { UpdateGreenLock } from "@eas-framework/server/MainBuild/ListenGreenLock";
    import http from 'http';
    export default function StartServer({ SitePath, HttpServer }?: {
        SitePath?: string;
        HttpServer?: typeof UpdateGreenLock;
    }): Promise<{
        close: () => void;
        server: http.Server;
    }>;
    export { Settings };
}
declare module "@eas-framework/server" {
    import server, { Settings } from "@eas-framework/server/MainBuild/Server";
    import SearchRecord from "@eas-framework/server/Global/SearchRecord";
    import { waitProductionPromise } from "@eas-framework/server/MainBuild/Settings";
    export type { Request, Response } from "@eas-framework/server/MainBuild/Types";
    export const AsyncImport: (path: string, importFrom?: string) => Promise<any>;
    export { Settings, SearchRecord, waitProductionPromise };
    export default server;
}
declare module "@eas-framework/server/Global/localSql" {
    import { Database } from 'sql.js';
    export default class LocalSql {
        db: Database;
        savePath: string;
        hadChange: boolean;
        private loaded;
        constructor(savePath?: string, checkIntervalMinutes?: number);
        private notLoaded;
        load(): Promise<void>;
        private updateLocalFile;
        private buildQueryTemplate;
        insert(queryArray: string[], ...valuesArray: any[]): import("sql.js").SqlValue;
        affected(queryArray: string[], ...valuesArray: any[]): number;
        select(queryArray: string[], ...valuesArray: any[]): import("sql.js").QueryExecResult[];
        selectOne(queryArray: string[], ...valuesArray: any[]): import("sql.js").ParamsObject;
    }
}
declare module "@eas-framework/server/Global/Index" {
    import LocalSql from "@eas-framework/server/Global/localSql";
    import { print } from "@eas-framework/server/OutputInput/Console";
    global {
        let LocalSql: LocalSql;
        let dump: typeof console;
        let debug: boolean;
    }
    export { LocalSql, print as dump };
}
declare module "@eas-framework/server/scripts/build-scripts" { }
declare module "@eas-framework/server/scripts/install" { }
