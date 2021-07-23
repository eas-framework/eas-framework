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
    setDefualt(Info?: StringTrackerDataInfo): void;
    getDataArray(): StringTrackerDataInfo[];
    /**
     * allow indexing like string does: myString[0] -> StringTracker
     * @returns proxy that allow Proxy
     */
    private Indexing;
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
    AddTextAfter(text: string, info?: string, line?: number, char?: number): void;
    /**
     * add text at the *start* of the string
     * @param text
     * @param info
     */
    AddTextBefore(text: string, info?: string, line?: number, char?: number): void;
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
    removeEmptyStart(): StringTracker;
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
    private replaceWithTimes;
    replace(searchValue: string | RegExp, replaceValue: StringTracker | string): StringTracker;
    replacer(searchValue: RegExp, func: (data: ArrayMatch) => StringTracker): StringTracker;
    replaceAll(searchValue: string | RegExp, replaceValue: StringTracker | string): StringTracker;
    matchAll(searchValue: string | RegExp): StringTracker[];
    match(searchValue: string | RegExp): ArrayMatch | StringTracker[];
    toString(): string;
}
