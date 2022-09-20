import PPath from "../../Settings/PPath.js";
import { unicode } from "../../Util/Strings.js";
import StringTrackerStack from "./StringTrackerStack.js";
import STSInfo from "./STSInfo.js";
const EMPTY_STACK = new StringTrackerStack()

export interface StringTrackerDataInfo {
    char: string
    stack: StringTrackerStack
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
    private chars: StringTrackerDataInfo[] = [];

    public constructor(text?: string) {
        if (text) {
            this.addTextAfter(text);
        }
    }

    public getChars() {
        return this.chars;
    }

    public get topCharStack(){
        for(let i = this.chars.length - 1; i >= 0; i--){
            const stack = this.chars[i].stack;
            if(stack.length){
                return stack
            }
        }

        return EMPTY_STACK
    }

    public get topSource(){
        return this.topCharStack?.top()?.source
    }

    /**
     * return all the text so you can check if it equal or not
     * use like that: myString.eq == "cool"
     */
    get eq() {
        return this.toString();
    }

    /**
     * length of the string
     */
    get length(): number {
        return this.chars.length;
    }

    /**
     * 
     * @returns copy of this string object
     */
    public clone(): StringTracker {
        const newData = new StringTracker();
        newData.chars = this.chars.slice();
        return newData;
    }

    private addClone(data: StringTracker) {
        this.chars = this.chars.concat(data.chars);
    }

    /**
     * 
     * @param text any thing to connect
     * @returns connected string with all the text
     */
    public static concat(...text: any[]): StringTracker {
        const newString = new StringTracker();

        for (const i of text) {
            if (i instanceof StringTracker) {
                newString.addClone(i);
            } else {
                newString.addTextAfter(String(i));
            }
        }

        return newString;
    }

    /**
     * 
     * @param data 
     * @returns this string clone plus the new data connected
     */
    public clonePlus(...data: any[]): StringTracker {
        return StringTracker.concat(this.clone(), ...data);
    }

    /**
     * Add string or any data to this string
     * @param data can be any thing
     * @returns this string (not new string)
     */
    public plus(...data: any[]): StringTracker {
        for (const i of data) {
            if (i instanceof StringTracker) {
                this.addClone(i);
            } else {
                this.addTextAfter(String(i));
            }
        }

        return this;
    }

    /**
     * Add strings to other data with 'Template literals'
     * used like this: myString.$Plus `this very${coolString}!`
     * @param texts all the splited text
     * @param values all the values
     */
    public plus$(texts: TemplateStringsArray, ...values: (StringTracker | any)[]): StringTracker {
        for (const i in values) {
            const text = texts[i];
            const value = values[i];

            this.addTextAfter(text);

            if (value instanceof StringTracker) {
                this.addClone(value);
            } else if (value != null) {
                this.addTextAfter(String(value));
            }
        }

        this.addTextAfter(texts.at(-1));

        return this;
    }

    addTextAfter(text: string) {
        for (const char of [...text]) {
            this.chars.push({
                char,
                stack: EMPTY_STACK
            })
        }
        return this
    }

    addTextBefore(text: string) {
        const chars = []
        for (const char of text) {
            chars.push({
                char,
                stack: EMPTY_STACK
            })
        }
        this.chars = chars.concat(this.chars)
        return this
    }


    private static createSTByInfo(text: string, createStack: (line: number, column: number)=>STSInfo[]){
        const newString = new StringTracker();
        let line = 1, column = 1;

        for (const char of [...text]) {
            newString.chars.push({
                char,
                stack: new StringTrackerStack(
                    createStack(line, column)
                )
            })

            if (char == '\n') {
                line++
                column = 1
            } else {
                column++
            }
        }

        return newString
    }
    static fromTextFile(text: string, file: PPath) {
        return StringTracker.createSTByInfo(text, (line, column) => [new STSInfo(file, line, column)])
    }

    static fromST(text: string, file: PPath, source: StringTracker){
        const stack = source.topCharStack
        return StringTracker.createSTByInfo(text, (line, column) => stack.hiddenStack.concat([new STSInfo(file, line, column)]))
    }

    slice(start = 0, end = this.length): StringTracker {
        const newString = new StringTracker();

        newString.chars = this.chars.slice(start, end)

        return newString;
    }

    public at(pos: number) {
        return this.slice(pos, pos + 1);
    }

    private atString(pos: number) {
        return this.chars[pos]?.char
    }

    public atStack(pos: number) {
        return this.chars[pos]?.stack
    }

    public charCodeAt(pos: number) {
        return this.atString(pos).charCodeAt(0);
    }

    public codePointAt(pos: number) {
        return this.atString(pos).codePointAt(0);
    }

    *[Symbol.iterator]() {
        for (const i of this.chars) {
            const char = new StringTracker();
            char.chars.push(i);
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
        for (const {char} of this.chars) {
            count++;
            index -= char.length;
            if (index <= 0)
                return count;
        }

        return count;
    }

    public indexOf(text: string) {
        return this.charLength(this.eq.indexOf(text));
    }

    public lastIndexOf(text: string) {
        return this.charLength(this.eq.lastIndexOf(text));
    }

    public search(regex: RegExp | string) {
        return this.charLength(this.eq.search(regex));
    }

    public startsWith(search: string, position?: number) {
        return this.eq.startsWith(search, position);
    }

    public endsWith(search: string, position?: number) {
        return this.eq.endsWith(search, position);
    }

    public includes(search: string, position?: number) {
        return this.eq.includes(search, position);
    }

    public trimStart() {
        const newString = this.clone();

        while(newString.chars[0]?.char.trim() === ''){
            newString.chars.shift();
        }

        return newString;
    }

    public trimEnd() {

        const newString = this.clone();

        while(newString.chars.at(-1)?.char.trim() === ''){
            newString.chars.pop();
        }

        return newString;
    }

    public trim() {
        return this.trimStart().trimEnd();
    }

    public spaceOne(addInside?: string) {
        const start = this.atString(0);
        const end = this.atString(this.length - 1);
        const copy = this.clone().trim();

        if (start) {
            copy.addTextBefore(addInside || start);
        }

        if (end) {
            copy.addTextAfter(addInside || end);
        }

        return copy;
    }

    private mapChars(act: (text: string) => string) {
        const newString = this.clone();

        for (const item of newString.chars) {
            item.char = act(item.char);
        }

        return newString;
    }

    public toLocaleLowerCase(locales?: string | string[]) {
        return this.mapChars(s => s.toLocaleLowerCase(locales));
    }

    public toLocaleUpperCase(locales?: string | string[]) {
        return this.mapChars(s => s.toLocaleUpperCase(locales));
    }

    public toUpperCase() {
        return this.mapChars(s => s.toUpperCase());
    }

    public toLowerCase() {
        return this.mapChars(s => s.toLowerCase());
    }

    public normalize() {
        return this.mapChars(s => s.normalize());
    }

    private stringIndexer(regex: RegExp | string, limit?: number): StringIndexerInfo[] {
        if (regex instanceof RegExp) {
            regex = new RegExp(regex, regex.flags.replace('g', ''));
        }

        const allSplit: StringIndexerInfo[] = [];

        let mainText = this.eq, hasMath: RegExpMatchArray = mainText.match(regex), addNext = 0, counter = 0;
        let thisSubstring = this.clone();

        while ((limit == null || counter < limit) && hasMath?.[0]?.length) {
            const length = [...hasMath[0]].length, index = thisSubstring.charLength(hasMath.index);
            allSplit.push({
                index: index + addNext,
                length
            });

            mainText = mainText.slice(hasMath.index + hasMath[0].length);
            thisSubstring = thisSubstring.slice(index + length);
            addNext += index + length;

            hasMath = mainText.match(regex);
            counter++;
        }

        return allSplit;
    }

    private regexInString(searchValue: string | RegExp) {
        if (searchValue instanceof RegExp) {
            return searchValue;
        }
        return unicode(searchValue);
    }

    public split(separator: string | RegExp, limit?: number): StringTracker[] {
        const allSplitted = this.stringIndexer(this.regexInString(separator), limit);
        const newSplit: StringTracker[] = [];

        let nextSlice = 0;

        for (const i of allSplitted) {
            newSplit.push(this.slice(nextSlice, i.index));
            nextSlice = i.index + i.length;
        }

        newSplit.push(this.slice(nextSlice));

        return newSplit;
    }

    public repeat(count: number) {
        const newString = this.clone();
        for (let i = 0; i < count; i++) {
            newString.addClone(this.clone());
        }
        return newString;
    }

    public static join(arr: StringTracker[]) {
        let all = new StringTracker();
        for (const i of arr) {
            all.addClone(i);
        }
        return all;
    }

    private replaceWithTimes(searchValue: string | RegExp, replaceValue: StringTracker | string, limit?: number) {
        const allSplitted = this.stringIndexer(searchValue, limit);
        let newString = new StringTracker();

        let nextSlice = 0;
        for (const i of allSplitted) {
            newString = newString.clonePlus(
                this.slice(nextSlice, i.index),
                replaceValue
            );

            nextSlice = i.index + i.length;
        }

        newString.addClone(this.slice(nextSlice));

        return newString;
    }

    public replace(searchValue: string | RegExp, replaceValue: StringTracker | string) {
        return this.replaceWithTimes(this.regexInString(searchValue), replaceValue, searchValue instanceof RegExp ? undefined : 1)
    }

    public replacer(searchValue: RegExp, func: (data: ArrayMatch) => StringTracker) {
        let copy = this.clone(), splitToReplace: ArrayMatch;
        function ReMatch() {
            splitToReplace = copy.match(searchValue);
        }
        ReMatch();

        const newText = new StringTracker();

        while (splitToReplace) {
            newText.plus(copy.slice(0, splitToReplace.index));
            newText.plus(func(splitToReplace));

            copy = copy.slice(splitToReplace.index + splitToReplace[0].length);
            ReMatch();
        }
        newText.plus(copy);

        return newText;
    }

    public async replacerAsync(searchValue: RegExp, func: (data: ArrayMatch) => Promise<StringTracker>) {
        let copy = this.clone(), SplitToReplace: ArrayMatch;
        function ReMatch() {
            SplitToReplace = copy.match(searchValue);
        }
        ReMatch();

        const newText = new StringTracker();

        while (SplitToReplace) {
            newText.plus(copy.slice(0, SplitToReplace.index));
            newText.plus(await func(SplitToReplace));

            copy = copy.slice(SplitToReplace.index + SplitToReplace[0].length);
            ReMatch();
        }
        newText.plus(copy);

        return newText;
    }

    public replaceAll(searchValue: string | RegExp, replaceValue: StringTracker | string) {
        return this.replaceWithTimes(this.regexInString(searchValue), replaceValue)
    }

    public matchAll(searchValue: string | RegExp): StringTracker[] {
        const allMatches = this.stringIndexer(searchValue);
        const mathArray = [];

        for (const i of allMatches) {
            mathArray.push(this.slice(i.index, i.index + i.length));
        }

        return mathArray;
    }

    public match(searchValue: string | RegExp): ArrayMatch | StringTracker[] {
        if (searchValue instanceof RegExp && searchValue.global) {
            return this.matchAll(searchValue);
        }

        const find = this.eq.match(searchValue);

        if (find == null) return null;

        const ResultArray: ArrayMatch = [];

        const findIndex = this.charLength(find.index)
        ResultArray[0] = this.slice(findIndex, findIndex + find.shift().length);
        ResultArray.index = findIndex;
        ResultArray.input = this.clone();

        let nextMath = ResultArray[0].clone();

        for (const i in find) {
            if (isNaN(Number(i))) {
                break;
            }
            const e = find[i];

            if (e == null) {
                ResultArray.push(<any>e);
                continue;
            }

            const findNextIndex = nextMath.indexOf(e);
            ResultArray.push(nextMath.slice(findNextIndex, findNextIndex + e.length));
            nextMath = nextMath.slice(findNextIndex);
        }

        return ResultArray;
    }

    public toString() {
        let bigString = '';
        for (const i of this.chars) {
            bigString += i.char;
        }

        return bigString;
    }


    public originalPositionFor(line: number, column: number) {
        let searchLine = this.getLine(line);
        if (searchLine.startsWith('//')) {
            searchLine = this.getLine(line - 1);
            column = 0;
        }

        return searchLine.chars.at(column - 1).stack.top()
    }
}