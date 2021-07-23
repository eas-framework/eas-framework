export default class StringTracker {
    DataArray = [];
    InfoText = null;
    OnLine = 1;
    OnChar = 1;
    /**
     * @param InfoText text info for all new string that are created in this object
     */
    constructor(Info, text) {
        if (typeof Info == 'string') {
            this.InfoText = Info;
        }
        else if (Info) {
            this.setDefualt(Info);
        }
        if (text) {
            this.AddTextAfter(text, this.DefaultInfoText.info, 1);
        }
        return this.Indexing();
    }
    static get emptyInfo() {
        return {
            info: '',
            line: 0,
            char: 0
        };
    }
    setDefualt(Info = this.DefaultInfoText) {
        this.InfoText = Info.info;
        this.OnLine = Info.line;
        this.OnChar = Info.char;
    }
    getDataArray() {
        return this.DataArray;
    }
    /**
     * allow indexing like string does: myString[0] -> StringTracker
     * @returns proxy that allow Proxy
     */
    Indexing() {
        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop == 'string') {
                    const index = Number(prop);
                    if (!isNaN(index) && !(prop in target)) {
                        return target.charAt(index);
                    }
                }
                return target[prop];
            },
        });
    }
    /**
     * get the InfoText that are setted on the last InfoText
     */
    get DefaultInfoText() {
        if (!this.DataArray.find(x => x.info) && this.InfoText != null) {
            return {
                info: this.InfoText,
                line: this.OnLine,
                char: this.OnChar
            };
        }
        return this.DataArray[this.DataArray.length - 1];
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
    get OneString() {
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
     * return the info about this text
     */
    get lineInfo() {
        const d = this.DefaultInfoText;
        return `${d.info}:${d.line}:${d.char}`;
    }
    /**
     * length of the string
     */
    get length() {
        let countChars = 0;
        for (const i of this.DataArray) {
            countChars += i.text.length;
        }
        return countChars;
    }
    /**
     *
     * @returns copy of this string object
     */
    Clone() {
        const newData = new StringTracker(this.StartInfo);
        for (const i of this.DataArray) {
            newData.AddTextAfter(i.text, i.info, i.line, i.char);
        }
        return newData;
    }
    AddClone(data) {
        this.DataArray.push(...data.DataArray);
        this.setDefualt({
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
    static concat(...text) {
        const newString = new StringTracker();
        for (const i of text) {
            if (i instanceof StringTracker) {
                newString.AddClone(i);
            }
            else {
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
    ClonePlus(...data) {
        return StringTracker.concat(this.Clone(), ...data);
    }
    /**
     * Add string or any data to this string
     * @param data can be any thing
     * @returns this string (not new string)
     */
    Plus(...data) {
        let lastinfo = this.DefaultInfoText;
        for (const i of data) {
            if (i instanceof StringTracker) {
                lastinfo = i.DefaultInfoText;
                this.AddClone(i);
            }
            else {
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
    Plus$(texts, ...values) {
        let lastValue = this.DefaultInfoText;
        for (const i in values) {
            const text = texts[i];
            const value = values[i];
            this.AddTextAfter(text, lastValue?.info, lastValue?.line, lastValue?.char);
            if (value instanceof StringTracker) {
                this.AddClone(value);
                lastValue = value.DefaultInfoText;
            }
            else if (value) {
                this.AddTextAfter(value, lastValue?.info, lastValue?.line, lastValue?.char);
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
    AddTextAction(text, action, info = this.DefaultInfoText.info, LineCount = 0, CharCount = 1) {
        const dataStore = [];
        for (const i of text) {
            if (i) {
                dataStore.push({
                    text: i,
                    info,
                    line: LineCount,
                    char: CharCount
                });
                CharCount++;
            }
            if (i == '\n') {
                LineCount++;
                CharCount = 1;
            }
        }
        if (action == 'push') {
            this.DataArray.push(...dataStore);
        }
        else {
            this.DataArray = dataStore.concat(this.DataArray);
        }
    }
    /**
     * add text at the *end* of the string
     * @param text
     * @param info
     */
    AddTextAfter(text, info, line, char) {
        this.AddTextAction(text, "push", info, line, char);
    }
    /**
     * add text at the *start* of the string
     * @param text
     * @param info
     */
    AddTextBefore(text, info, line, char) {
        this.AddTextAction(text, "unshift", info, line, char);
    }
    /**
     * simple methof to cut string
     * @param start
     * @param end
     * @returns new cutted string
     */
    CutString(start = 0, end = this.length) {
        const newString = new StringTracker(this.StartInfo);
        newString.DataArray.push(...this.DataArray.slice(start, end));
        return newString;
    }
    // private CutString(start = 0, end = this.length): StringTracker {
    //     let addTillEnd = false;
    //     let length = end - start;
    //     const newString = new StringTracker(this.StartInfo);
    //     for (const i of this.DataArray) {
    //         if (length <= 0) {
    //             break;
    //         }
    //         if (addTillEnd) {
    //             newString.AddTextAfter(i.text.substr(0, length), i.info, i.line, i.char);
    //             length -= i.text.length;
    //             continue;
    //         }
    //         start -= i.text.length;
    //         if (start <= 0) {
    //             start += i.text.length;
    //             newString.AddTextAfter(i.text.substr(start, length), i.info, i.line, i.char);
    //             length -= i.text.length - start;
    //             addTillEnd = true;
    //         }
    //     }
    //     return newString;
    // }
    /**
     * substring-like method, more like js cutting string, if there is not parameters it complete to 0
     */
    substring(start, end) {
        if (isNaN(end)) {
            end = undefined;
        }
        else {
            end = Math.abs(end);
        }
        if (isNaN(start)) {
            start = undefined;
        }
        else {
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
    substr(start, length) {
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
    slice(start, end) {
        if (start < 0) {
            start = this.length - start;
        }
        if (end < 0) {
            start = this.length - start;
        }
        return this.substring(start, end);
    }
    charAt(pos) {
        if (!pos) {
            pos = 0;
        }
        return this.CutString(pos, pos + 1);
    }
    at(pos) {
        return this.charAt(pos);
    }
    charCodeAt(pos) {
        return this.charAt(pos).OneString.charCodeAt(0);
    }
    codePointAt(pos) {
        return this.charAt(pos).OneString.codePointAt(0);
    }
    *[Symbol.iterator]() {
        for (const i of this.DataArray) {
            const char = new StringTracker();
            char.DataArray.push(i);
            yield char;
        }
    }
    getLine(line, startFromOne = true) {
        return this.split('\n')[line - +startFromOne];
    }
    indexOf(text) {
        return this.OneString.indexOf(text);
    }
    lastIndexOf(text) {
        return this.OneString.lastIndexOf(text);
    }
    /**
     * return string as unicode
     */
    unicodeMe(value) {
        let a = "";
        for (const v of value) {
            a += "\\u" + ("000" + v.charCodeAt(0).toString(16)).substr(-4);
        }
        return a;
    }
    /**
     * the string as unicode
     */
    get unicode() {
        const newString = new StringTracker();
        for (const i of this.DataArray) {
            newString.AddTextAfter(this.unicodeMe(i.text), i.info, i.line, i.char);
        }
        return newString;
    }
    search(regex) {
        return this.OneString.search(regex);
    }
    startsWith(search, position) {
        return this.OneString.startsWith(search, position);
    }
    endsWith(search, position) {
        return this.OneString.endsWith(search, position);
    }
    includes(search, position) {
        return this.OneString.includes(search, position);
    }
    trimStart() {
        const newString = this.Clone();
        newString.setDefualt();
        for (let i = 0; i < newString.DataArray.length; i++) {
            const e = newString.DataArray[i];
            if (e.text.trim() == '') {
                newString.DataArray.shift();
                i--;
            }
            else {
                e.text = e.text.trimStart();
                break;
            }
        }
        return newString;
    }
    trimLeft() {
        return this.trimStart();
    }
    trimEnd() {
        const newString = this.Clone();
        newString.setDefualt();
        for (let i = newString.DataArray.length - 1; i >= 0; i--) {
            const e = newString.DataArray[i];
            if (e.text.trim() == '') {
                newString.DataArray.pop();
            }
            else {
                e.text = e.text.trimEnd();
                break;
            }
        }
        return newString;
    }
    trimRight() {
        return this.trimEnd();
    }
    trim() {
        return this.trimStart().trimEnd();
    }
    SpaceOne(addInside) {
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
    removeEmptyStart() {
        const newString = this.Clone();
        newString.setDefualt();
        for (let i = 0; i < newString.DataArray.length; i++) {
            const e = newString.DataArray[i];
            if (e.text == '') {
                newString.DataArray.shift();
                i--;
            }
            else {
                e.text = e.text.trimStart();
                break;
            }
        }
        return newString;
    }
    ActionString(Act) {
        const newString = this.Clone();
        for (const i of newString.DataArray) {
            i.text = Act(i.text);
        }
        return newString;
    }
    toLocaleLowerCase(locales) {
        return this.ActionString(s => s.toLocaleLowerCase(locales));
    }
    toLocaleUpperCase(locales) {
        return this.ActionString(s => s.toLocaleUpperCase(locales));
    }
    toUpperCase() {
        return this.ActionString(s => s.toUpperCase());
    }
    toLowerCase() {
        return this.ActionString(s => s.toLowerCase());
    }
    normalize() {
        return this.ActionString(s => s.normalize());
    }
    StringIndexer(regex, limit) {
        if (regex instanceof RegExp) {
            regex = new RegExp(regex, regex.flags.replace('g', ''));
        }
        const allSplit = [];
        let mainText = this.OneString, hasMath = mainText.match(regex), addNext = 0, counter = 0;
        while ((limit == null || counter < limit) && hasMath?.[0]?.length) {
            allSplit.push({
                index: hasMath.index + addNext,
                length: hasMath[0].length
            });
            const addLength = hasMath.index + hasMath[0].length;
            mainText = mainText.slice(addLength);
            addNext += addLength;
            hasMath = mainText.match(regex);
            counter++;
        }
        return allSplit;
    }
    RegexInString(searchValue) {
        if (searchValue instanceof RegExp) {
            return searchValue;
        }
        return new StringTracker('n', searchValue).unicode.eq;
    }
    split(separator, limit) {
        const allSplited = this.StringIndexer(this.RegexInString(separator), limit);
        const newSplit = [];
        let nextcut = 0;
        for (const i of allSplited) {
            newSplit.push(this.CutString(nextcut, i.index));
            nextcut = i.index + i.length;
        }
        newSplit.push(this.CutString(nextcut));
        return newSplit;
    }
    repeat(count) {
        const newString = this.Clone();
        for (let i = 0; i < count; i++) {
            newString.AddClone(this.Clone());
        }
        return newString;
    }
    replaceWithTimes(searchValue, replaceValue, limit) {
        const allSplited = this.StringIndexer(searchValue, limit);
        let newString = new StringTracker();
        let nextcut = 0;
        for (const i of allSplited) {
            newString = newString.ClonePlus(this.CutString(nextcut, i.index), replaceValue);
            nextcut = i.index + i.length;
        }
        newString.AddClone(this.CutString(nextcut));
        return newString;
    }
    replace(searchValue, replaceValue) {
        return this.replaceWithTimes(this.RegexInString(searchValue), replaceValue, searchValue instanceof RegExp ? undefined : 1);
    }
    replacer(searchValue, func) {
        let copy = this.Clone(), SplitToReplace;
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
    replaceAll(searchValue, replaceValue) {
        return this.replaceWithTimes(this.RegexInString(searchValue), replaceValue);
    }
    matchAll(searchValue) {
        const allMatchs = this.StringIndexer(searchValue);
        const mathArray = [];
        for (const i of allMatchs) {
            mathArray.push(this.substr(i.index, i.length));
        }
        return mathArray;
    }
    match(searchValue) {
        if (searchValue instanceof RegExp && searchValue.global) {
            return this.matchAll(searchValue);
        }
        const find = this.OneString.match(searchValue);
        if (find == null)
            return null;
        const ResultArray = [];
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
                ResultArray.push(e);
                continue;
            }
            const findIndex = nextMath.indexOf(e);
            ResultArray.push(nextMath.substr(findIndex, e.length));
            nextMath = nextMath.substring(findIndex + e.length);
        }
        return ResultArray;
    }
    toString() {
        return this.OneString;
    }
}
//# sourceMappingURL=StringTracker.js.map