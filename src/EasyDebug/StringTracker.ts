import { BasicSettings } from "../RunTimeBuild/SearchFileSystem";
import { outputMap, outputWithMap } from "./StringTrackerToSourceMap";

export interface StringTrackerDataInfo {
    text?: string,
    info: string,
    line?: number,
    char?: number
}

interface StringIndexerInfo {
    index: number,
    length: number
}

export interface ArrayMatch extends Array<StringTracker> {
    index?: number,
    input?: StringTracker
}

export default class StringTracker {
    private DataArray: StringTrackerDataInfo[] = [];
    public InfoText: string = null;
    public OnLine = 1;
    public OnChar = 1;
    /**
     * @param InfoText text info for all new string that are created in this object
     */
    public constructor(Info?: string | StringTrackerDataInfo, text?: string) {
        if (typeof Info == 'string') {
            this.InfoText = Info;
        } else if (Info) {
            this.setDefault(Info);
        }

        if (text) {
            this.AddFileText(text, this.InfoText);
        }
    }


    static get emptyInfo(): StringTrackerDataInfo {
        return {
            info: '',
            line: 0,
            char: 0
        }
    }

    public setDefault(Info = this.DefaultInfoText) {
        this.InfoText = Info.info;
        this.OnLine = Info.line;
        this.OnChar = Info.char;
    }

    public getDataArray() {
        return this.DataArray;
    }

    /**
     * get the first info of the string
     */
    public get DefaultInfoText(): StringTrackerDataInfo {
        return this.DataArray.find(x => x.info) ?? StringTracker.emptyInfo;
    }

    /**
     * get the last info of the string
     */
    public get DefaultInfoTextLast(): StringTrackerDataInfo {
        for(let i = this.DataArray.length - 1; i >= 0; i--) {
            if(this.DataArray[i].info) {
                return this.DataArray[i];
            }
        }
        return StringTracker.emptyInfo;
    }

    /**
     * get the InfoText that are setted on the first InfoText
     */
    get StartInfo() {
        return this.DataArray[0] ?? this.DefaultInfoText;
    }

    /**
     * return all the text as one string
     */
    private get OneString() {
        let bigString = '';
        for (const i of this.DataArray) {
            bigString += i.text;
        }

        return bigString;
    }

    /**
     * return all the text so you can check if it equal or not
     * use like that: myString.eq == "cool"
     */
    get eq() {
        return this.OneString;
    }

    /**
     * return the info about this text (small path)
     */
    get originalLineInfo() {
        const defaultInfo = this.DefaultInfoText;
        return `${defaultInfo.info}:${defaultInfo.line}:${defaultInfo.char}`;
    }

    /**
     * return the info about this text, with **full path**
     */
    get lineInfo() {
        const s = this.originalLineInfo.split('<line>');
        s.push(BasicSettings.fullWebSitePath + s.pop());

        return s.join('<line>');
    }

    /**
     * length of the string
     */
    get length(): number {
        return this.DataArray.length;
    }

    /**
     * 
     * @returns copy of this string object
     */
    public Clone(): StringTracker {
        const newData = new StringTracker(this.StartInfo);
        for (const i of this.DataArray) {
            newData.AddTextAfter(i.text, i.info, i.line, i.char);
        }
        return newData;
    }

    private AddClone(data: StringTracker) {
        this.DataArray = this.DataArray.concat(data.DataArray);

        this.setDefault({
            info: data.InfoText,
            line: data.OnLine,
            char: data.OnChar
        });
    }

    /**
     * 
     * @param text any thing to connect
     * @returns conncted string with all the text
     */
    public static concat(...text: any[]): StringTracker {
        const newString = new StringTracker();

        for (const i of text) {
            if (i instanceof StringTracker) {
                newString.AddClone(i);
            } else {
                newString.AddTextAfter(String(i));
            }
        }

        return newString;
    }

    /**
     * 
     * @param data 
     * @returns this string clone plus the new data connected
     */
    public ClonePlus(...data: any[]): StringTracker {
        return StringTracker.concat(this.Clone(), ...data);
    }

    /**
     * Add string or any data to this string
     * @param data can be any thing
     * @returns this string (not new string)
     */
    public Plus(...data: any[]): StringTracker {
        let lastinfo = this.DefaultInfoTextLast;
        for (const i of data) {
            if (i instanceof StringTracker) {
                lastinfo = i.DefaultInfoTextLast;
                this.AddClone(i);
            } else {
                this.AddTextAfter(String(i), lastinfo.info, lastinfo.line, lastinfo.char);
            }
        }

        return this;
    }

    /**
     * Add strins ot other data with 'Template literals'
     * used like this: myStrin.$Plus `this very${coolString}!`
     * @param texts all the splited text
     * @param values all the values
     */
    public Plus$(texts: TemplateStringsArray, ...values: (StringTracker | any)[]): StringTracker {
        let lastValue: StringTrackerDataInfo = this.DefaultInfoTextLast;
        for (const i in values) {
            const text = texts[i];
            const value = values[i];

            this.AddTextAfter(text, lastValue?.info, lastValue?.line, lastValue?.char);

            if (value instanceof StringTracker) {
                this.AddClone(value);
                lastValue = value.DefaultInfoTextLast;
            } else if (value != null) {
                this.AddTextAfter(String(value), lastValue?.info, lastValue?.line, lastValue?.char);
            }
        }

        this.AddTextAfter(texts[texts.length - 1], lastValue?.info, lastValue?.line, lastValue?.char);

        return this;
    }

    /**
     * 
     * @param text string to add
     * @param action where to add the text
     * @param info info the come with the string
     */
    private AddTextAction(text: string, action: "push" | "unshift", info = this.DefaultInfoText.info, LineCount = 0, CharCount = 1): void {
        const dataStore: StringTrackerDataInfo[] = [];

        for (const char of [...text]) {
            dataStore.push({
                text: char,
                info,
                line: LineCount,
                char: CharCount
            });
            CharCount++;

            if (char == '\n') {
                LineCount++;
                CharCount = 1;
            }
        }

        this.DataArray[action](...dataStore);
    }

    /**
     * add text at the *end* of the string
     * @param text 
     * @param info 
     */
    public AddTextAfter(text: string, info?: string, line?: number, char?: number) {
        this.AddTextAction(text, "push", info, line, char);
        return this;
    }

    /**
     * add text at the *end* of the string without tracking
     * @param text 
     */
    public AddTextAfterNoTrack(text: string, info = '') {
        for (const char of text) {
            this.DataArray.push({
                text: char,
                info,
                line: 0,
                char: 0
            });
        }
        return this;
    }

    /**
     * add text at the *start* of the string
     * @param text 
     * @param info 
     */
    public AddTextBefore(text: string, info?: string, line?: number, char?: number) {
        this.AddTextAction(text, "unshift", info, line, char);
        return this;
    }

    /**
 * add text at the *start* of the string
 * @param text 
 */
    public AddTextBeforeNoTrack(text: string, info = '') {
        const copy = [];
        for (const char of text) {
            copy.push({
                text: char,
                info,
                line: 0,
                char: 0
            });
        }

        this.DataArray.unshift(...copy);
        return this;
    }

    /**
     * Add Text File Tracking
     * @param text 
     * @param info 
     */
    private AddFileText(text: string, info = this.DefaultInfoText.info) {
        let LineCount = 1, CharCount = 1;

        for (const char of [...text]) {
            this.DataArray.push({
                text: char,
                info,
                line: LineCount,
                char: CharCount
            });
            CharCount++;

            if (char == '\n') {
                LineCount++;
                CharCount = 1;
            }
        }
    }

    /**
     * simple methof to cut string
     * @param start 
     * @param end 
     * @returns new cutted string
     */
    private CutString(start = 0, end = this.length): StringTracker {
        const newString = new StringTracker(this.StartInfo);

        newString.DataArray = newString.DataArray.concat(this.DataArray.slice(start, end))

        return newString;
    }

    /**
     * substring-like method, more like js cutting string, if there is not parameters it complete to 0
     */
    public substring(start: number, end?: number) {
        if (isNaN(end)) {
            end = undefined;
        } else {
            end = Math.abs(end);
        }

        if (isNaN(start)) {
            start = undefined;
        } else {
            start = Math.abs(start);
        }

        return this.CutString(start, end);
    }

    /**
     * substr-like method
     * @param start 
     * @param length 
     * @returns 
     */
    public substr(start: number, length?: number): StringTracker {
        if (start < 0) {
            start = this.length - start;
        }
        return this.substring(start, length != null ? length + start : length);
    }

    /**
     * slice-like method
     * @param start 
     * @param end 
     * @returns 
     */
    public slice(start: number, end?: number) {
        if (start < 0) {
            start = this.length - start;
        }

        if (end < 0) {
            start = this.length - start;
        }

        return this.substring(start, end);
    }

    public charAt(pos: number) {
        if (!pos) {
            pos = 0;
        }
        return this.CutString(pos, pos + 1);
    }

    public at(pos: number) {
        return this.charAt(pos);
    }

    public charCodeAt(pos: number) {
        return this.charAt(pos).OneString.charCodeAt(0);
    }

    public codePointAt(pos: number) {
        return this.charAt(pos).OneString.codePointAt(0);
    }

    *[Symbol.iterator]() {
        for (const i of this.DataArray) {
            const char = new StringTracker();
            char.DataArray.push(i);
            yield char;
        }
    }

    public getLine(line: number, startFromOne = true) {
        return this.split('\n')[line - +startFromOne];
    }

    /**
     * convert uft-16 length to count of chars
     * @param index 
     * @returns 
     */
    private charLength(index: number) {
        if (index <= 0) {
            return index;
        }

        let count = 0;
        for (const char of this.DataArray) {
            count++;
            index -= char.text.length;
            if (index <= 0)
                return count;
        }

        return count;
    }

    public indexOf(text: string) {
        return this.charLength(this.OneString.indexOf(text));
    }

    public lastIndexOf(text: string) {
        return this.charLength(this.OneString.lastIndexOf(text));
    }

    /**
     * return string as unicode
     */
    private unicodeMe(value: string) {
        let a = "";
        for (const v of value) {
            a += "\\u" + ("000" + v.charCodeAt(0).toString(16)).slice(-4);
        }
        return a;
    }

    /**
     * the string as unicode
     */
    public get unicode() {
        const newString = new StringTracker();

        for (const i of this.DataArray) {
            newString.AddTextAfter(this.unicodeMe(i.text), i.info, i.line, i.char);
        }

        return newString;
    }

    public search(regex: RegExp | string) {
        return this.charLength(this.OneString.search(regex));
    }

    public startsWith(search: string, position?: number) {
        return this.OneString.startsWith(search, position);
    }

    public endsWith(search: string, position?: number) {
        return this.OneString.endsWith(search, position);
    }

    public includes(search: string, position?: number) {
        return this.OneString.includes(search, position);
    }

    public trimStart() {
        const newString = this.Clone();
        newString.setDefault();

        for (let i = 0; i < newString.DataArray.length; i++) {
            const e = newString.DataArray[i];

            if (e.text.trim() == '') {
                newString.DataArray.shift();
                i--;
            } else {
                e.text = e.text.trimStart();
                break;
            }
        }

        return newString;
    }

    public trimLeft() {
        return this.trimStart();
    }

    public trimEnd() {
        const newString = this.Clone();
        newString.setDefault();

        for (let i = newString.DataArray.length - 1; i >= 0; i--) {
            const e = newString.DataArray[i];

            if (e.text.trim() == '') {
                newString.DataArray.pop();
            } else {
                e.text = e.text.trimEnd();
                break;
            }
        }

        return newString;
    }

    public trimRight() {
        return this.trimEnd();
    }

    public trim() {
        return this.trimStart().trimEnd();
    }

    public SpaceOne(addInside?: string) {
        const start = this.at(0);
        const end = this.at(this.length - 1);
        const copy = this.Clone().trim();

        if (start.eq) {
            copy.AddTextBefore(addInside || start.eq, start.DefaultInfoText.info, start.DefaultInfoText.line, start.DefaultInfoText.char);
        }

        if (end.eq) {
            copy.AddTextAfter(addInside || end.eq, end.DefaultInfoText.info, end.DefaultInfoText.line, end.DefaultInfoText.char);
        }

        return copy;
    }

    private ActionString(Act: (text: string) => string) {
        const newString = this.Clone();

        for (const i of newString.DataArray) {
            i.text = Act(i.text);
        }

        return newString;
    }

    public toLocaleLowerCase(locales?: string | string[]) {
        return this.ActionString(s => s.toLocaleLowerCase(locales));
    }

    public toLocaleUpperCase(locales?: string | string[]) {
        return this.ActionString(s => s.toLocaleUpperCase(locales));
    }

    public toUpperCase() {
        return this.ActionString(s => s.toUpperCase());
    }

    public toLowerCase() {
        return this.ActionString(s => s.toLowerCase());
    }

    public normalize() {
        return this.ActionString(s => s.normalize());
    }

    private StringIndexer(regex: RegExp | string, limit?: number): StringIndexerInfo[] {
        if (regex instanceof RegExp) {
            regex = new RegExp(regex, regex.flags.replace('g', ''));
        }

        const allSplit: StringIndexerInfo[] = [];

        let mainText = this.OneString, hasMath: RegExpMatchArray = mainText.match(regex), addNext = 0, counter = 0;
        let thisSubstring = this.Clone();

        while ((limit == null || counter < limit) && hasMath?.[0]?.length) {
            const length = [...hasMath[0]].length, index = thisSubstring.charLength(hasMath.index);
            allSplit.push({
                index: index + addNext,
                length
            });

            mainText = mainText.slice(hasMath.index + hasMath[0].length);
            thisSubstring = thisSubstring.CutString(index + length);
            addNext += index + length;

            hasMath = mainText.match(regex);
            counter++;
        }

        return allSplit;
    }

    private RegexInString(searchValue: string | RegExp) {
        if (searchValue instanceof RegExp) {
            return searchValue;
        }
        return new StringTracker('n', searchValue).unicode.eq;
    }

    public split(separator: string | RegExp, limit?: number): StringTracker[] {
        const allSplited = this.StringIndexer(this.RegexInString(separator), limit);
        const newSplit: StringTracker[] = [];

        let nextcut = 0;

        for (const i of allSplited) {
            newSplit.push(this.CutString(nextcut, i.index));
            nextcut = i.index + i.length;
        }

        newSplit.push(this.CutString(nextcut));

        return newSplit;
    }

    public repeat(count: number) {
        const newString = this.Clone();
        for (let i = 0; i < count; i++) {
            newString.AddClone(this.Clone());
        }
        return newString;
    }

    public static join(arr: StringTracker[]) {
        let all = new StringTracker();
        for (const i of arr) {
            all.AddClone(i);
        }
        return all;
    }

    private replaceWithTimes(searchValue: string | RegExp, replaceValue: StringTracker | string, limit?: number) {
        const allSplited = this.StringIndexer(searchValue, limit);
        let newString = new StringTracker();

        let nextcut = 0;
        for (const i of allSplited) {
            newString = newString.ClonePlus(
                this.CutString(nextcut, i.index),
                replaceValue
            );

            nextcut = i.index + i.length;
        }

        newString.AddClone(this.CutString(nextcut));

        return newString;
    }

    public replace(searchValue: string | RegExp, replaceValue: StringTracker | string) {
        return this.replaceWithTimes(this.RegexInString(searchValue), replaceValue, searchValue instanceof RegExp ? undefined : 1)
    }

    public replacer(searchValue: RegExp, func: (data: ArrayMatch) => StringTracker) {
        let copy = this.Clone(), SplitToReplace: ArrayMatch;
        function ReMatch() {
            SplitToReplace = copy.match(searchValue);
        }
        ReMatch();

        const newText = new StringTracker(copy.StartInfo);

        while (SplitToReplace) {
            newText.Plus(copy.substring(0, SplitToReplace.index));
            newText.Plus(func(SplitToReplace));

            copy = copy.substring(SplitToReplace.index + SplitToReplace[0].length);
            ReMatch();
        }
        newText.Plus(copy);

        return newText;
    }

    public async replacerAsync(searchValue: RegExp, func: (data: ArrayMatch) => Promise<StringTracker>) {
        let copy = this.Clone(), SplitToReplace: ArrayMatch;
        function ReMatch() {
            SplitToReplace = copy.match(searchValue);
        }
        ReMatch();

        const newText = new StringTracker(copy.StartInfo);

        while (SplitToReplace) {
            newText.Plus(copy.substring(0, SplitToReplace.index));
            newText.Plus(await func(SplitToReplace));

            copy = copy.substring(SplitToReplace.index + SplitToReplace[0].length);
            ReMatch();
        }
        newText.Plus(copy);

        return newText;
    }

    public replaceAll(searchValue: string | RegExp, replaceValue: StringTracker | string) {
        return this.replaceWithTimes(this.RegexInString(searchValue), replaceValue)
    }

    public matchAll(searchValue: string | RegExp): StringTracker[] {
        const allMatchs = this.StringIndexer(searchValue);
        const mathArray = [];

        for (const i of allMatchs) {
            mathArray.push(this.substr(i.index, i.length));
        }

        return mathArray;
    }

    public match(searchValue: string | RegExp): ArrayMatch | StringTracker[] {
        if (searchValue instanceof RegExp && searchValue.global) {
            return this.matchAll(searchValue);
        }

        const find = this.OneString.match(searchValue);

        if (find == null) return null;

        const ResultArray: ArrayMatch = [];

        ResultArray[0] = this.substr(find.index, find.shift().length);
        ResultArray.index = find.index;
        ResultArray.input = this.Clone();

        let nextMath = ResultArray[0].Clone();

        for (const i in find) {
            if (isNaN(Number(i))) {
                break;
            }
            const e = find[i];

            if (e == null) {
                ResultArray.push(<any>e);
                continue;
            }

            const findIndex = nextMath.indexOf(e);
            ResultArray.push(nextMath.substr(findIndex, e.length));
            nextMath = nextMath.substring(findIndex);
        }

        return ResultArray;
    }

    public toString() {
        return this.OneString;
    }

    public extractInfo(type = '<line>'): string {
        return this.DefaultInfoText.info.split(type).pop().trim()
    }

    public originalPositionFor(line: number, column: number) {
        let searchLine = this.getLine(line);
        if (searchLine.startsWith('//')) {
            searchLine = this.getLine(line - 1);
            column = 0;
        }
        return {
            ...searchLine.at(column - 1).DefaultInfoText,
            searchLine
        }
    }

    /**
     * Extract error info form error message
     */
    public debugLine({ message, text, location, line, col }: { message?: string, text?: string, location?: { line: number, column: number, lineText?: string }, line?: number, col?: number }): string {

        const data = this.originalPositionFor(line ?? location?.line ?? 1, col ?? location?.column ?? 0)

        return `${text || message}, on file -><color>${BasicSettings.fullWebSitePath + data.searchLine.extractInfo()}:${data.line}:${data.char}${location?.lineText ? '\nLine: "' + location.lineText.trim() + '"' : ''}`;
    }

    public StringWithTack(fullSaveLocation: string) {
        return outputWithMap(this, fullSaveLocation)
    }

    public StringTack(fullSaveLocation: string, httpSource?: boolean, relative?: boolean) {
        return outputMap(this, fullSaveLocation, httpSource, relative)
    }
}