import StringTracker from '../../EasyDebug/StringTracker';
import { BaseReader } from '../../CompileCode/BaseReader/Reader';

interface RazorDataItem {
    type: string,
    data: StringTracker
}

class Razor {
    public values: RazorDataItem[];

    private typeQ = [
        ["(", "["],
        [")", "]"]
    ];


    constructor(public typeLoad = '@', public comment = '*', public skipWords = ["basic"], public notPrint = { "for": [], "if": ["else if", "else"], "while": ["do"], "do": [] }) 
    {}

    CheckWithoutSpace(text: StringTracker, ArrayCheck: string[]) {
        for (const i of ArrayCheck) {
            const index = text.indexOf(i);
            if (index != -1 && text.substring(0, index).trim().eq == '') {
                return i;
            }
        }
    }

    GetNextSpaceIndex(text: StringTracker, getFrom: StringTracker) {
        const all = getFrom.split(' ');

        let counter = 0;
        for (const i of all) {
            const index = text.indexOf(i.eq);
            counter += index + i.length;
            text = text.substring(index + i.length);
        }

        return counter;
    }

    ParseScriptSmall(text: StringTracker) {
        const removeOneStartEnd = Number(text.at(0).eq == '(') // remove double parenthesis @(123) => write((123))

        const stop = /(((?![\p{L}_\$0-9.]).)|[\r\n])+/u;

        for (let i = 1, length = text.length; i < length; i++) {
            const char = text.at(i).eq;
            const indexQ = this.typeQ[0].indexOf(char);

            if (indexQ != -1) {
                i += BaseReader.FindEndOfBlock(text.eq.substring(i + 1), char, this.typeQ[1][indexQ]) + 1;
                continue;
            }

            //skip '?.'
            if (!(char == '?' && text.at(i+1).eq == '.') && stop.test(char)) {
                this.values.push({ // script
                    type: 'script-print',
                    data: text.substring(removeOneStartEnd, i)
                });

                this.Builder(text.substring(i + 1 + (char == ';' ? 1 : 0))); // text
                return;
            }
        }

        this.values.push({ // script
            type: 'script',
            data: text
        });
    }

    SkipTillChar(text: StringTracker, findChar: string) {
        for (let i = 0, length = text.length; i < length; i++) {
            const char = text.at(i).eq;
            const indexQ = this.typeQ[0].indexOf(char);

            if (indexQ != -1) {
                i += BaseReader.FindEndOfBlock(text.eq.substring(i + 1), char, this.typeQ[1][indexQ]); // no +1 because i is doing ++ in the loop;
                continue;
            }

            if (char == findChar)
                return i;
        }

        return -1;
    }

    ParseScriptBig(text: StringTracker, ArrayNext = [], lastRecursive?: (plus: StringTracker) => void) {
        const start = this.SkipTillChar(text, '{'); // need to add fined end with blocks

        const startScript = text.substring(0, start + 1);  // script before
        if (lastRecursive)
            lastRecursive(startScript)
        else
            this.values.push({
                type: 'script',
                data: startScript
            });

        text = text.substring(start + 1);

        const end = BaseReader.FindEndOfBlock(text.eq, '{', '}');

        const between = text.substring(0, end), after = text.substring(end + 1);

        this.Builder(between); // text

        const addToLast = (plus: StringTracker | string = '') =>
            this.values.push({ // script after
                type: 'script',
                data: text.at(end).Plus(plus) // adding }
            });

        const next = this.CheckWithoutSpace(after, ArrayNext);

        if (!next) {
            addToLast();
            this.Builder(after); // text
            return;
        }

        this.ParseScriptBig(after, ArrayNext, addToLast);
    }

    findFirstWordIndex(text: StringTracker) {
        return text.search(/(((?![\p{L}_\$]).)|[\r\n])+/u); // not match any language, _, $
    }

    SwitchParser(text: StringTracker) {
        let start = text.indexOf('(') + 1;
        start += BaseReader.FindEndOfBlock(text.eq.substring(start), '(', ')');
        start += text.substring(start).indexOf('{') + 1;

        this.values.push({
            type: 'script',
            data: text.substring(0, start)
        });

        text = text.substring(start);
        const endMain = BaseReader.FindEndOfBlock(text.eq, '{', '}');

        const maindata = text.substring(0, endMain).split('case');
        maindata.shift();

        for (let i of maindata) {
            const startIndex = BaseReader.findEndOfDef(i.eq, ':') + 1;

            this.values.push({
                type: 'script',
                data: new StringTracker(i.DefaultInfoText, 'case ').Plus(i.substring(0, startIndex))
            });

            i = i.substring(startIndex);

            const endIndex = BaseReader.findEndOfDef(i.eq, 'break');
            this.Builder(i.substring(0, endIndex));

            i = i.substring(endIndex);

            this.values.push({
                type: 'script',
                data: i
            });
        }

        this.values.push({
            type: 'script',
            data: new StringTracker(maindata[maindata.length - 1].DefaultInfoText, '}')
        });

        this.Builder(text.substring(endMain + 1));
    }

    FunctionParser(text: StringTracker) {
        let start = text.indexOf('(') + 1;
        start += BaseReader.FindEndOfBlock(text.eq.substring(start), '(', ')');
        start += text.substring(start).indexOf('{') + 1;

        this.values.push({
            type: 'script',
            data: text.substring(0, start)
        });

        text = text.substring(start);
        const endMain = BaseReader.FindEndOfBlock(text.eq, '{', '}');

        const maindata = text.substring(0, endMain);
        this.Builder(maindata);

        this.values.push({
            type: 'script',
            data: new StringTracker(maindata[maindata.length - 1].DefaultInfoText, '}')
        });

        this.Builder(text.substring(endMain + 1));
    }

    skipIt(text: StringTracker, indexEnd: number, indexStart = indexEnd) {
        this.values.push({
            type: 'text',
            data: text.substring(0, indexEnd)
        });
        this.Builder(text.substring(indexStart));
    }

    simpleBigScript(text: StringTracker) {
        text = text.substring(1);
        const blockEnd = BaseReader.FindEndOfBlock(text.eq, '{', '}');
        this.values.push({
            type: 'script',
            data: text.substring(0, blockEnd)
        });
        this.Builder(text.substring(blockEnd + 1));
    }

    Builder(text: StringTracker) {
        const index = text.indexOf(this.typeLoad);

        if (index == -1) {
            this.values.push({
                type: 'text',
                data: text
            }); // add lefted text
            return;
        } else if (text.at(index + 1).eq == this.typeLoad) {//adding as text if @@
            this.skipIt(text, index + this.typeLoad.length, index + this.typeLoad.length * 2);
            return;
        } else if (text.at(index + 1).eq == this.comment) {//remove comments
            this.values.push({
                type: 'text',
                data: text.substring(0, index)
            });

            text = text.substring(index);
            this.Builder(text.substring(text.indexOf(this.comment + this.typeLoad) + this.typeLoad.length + this.comment.length));
            return;
        }

        this.values.push({
            type: 'text',
            data: text.substring(0, index)
        }); // text before script

        //cut to the script
        const textNext = text.substring(index + this.typeLoad.length);

        const firstWordIndex = this.findFirstWordIndex(textNext);
        const firstWord = textNext.substring(0, firstWordIndex).eq;

        if (this.skipWords.includes(firstWord)) {
            this.skipIt(text, firstWordIndex);
            return;
        }

        text = textNext;

        if (firstWord == 'switch')
            this.SwitchParser(text);

        else if (firstWord == 'function')
            this.FunctionParser(text);

        else if (this.notPrint[firstWord])
            this.ParseScriptBig(text, this.notPrint[firstWord]);

        else if (text.at(0).eq == '{')
            this.simpleBigScript(text);

        else
            this.ParseScriptSmall(text);

    }

    BuildAll(text: StringTracker): StringTracker {
        this.values = [];
        this.Builder(text);

        const output = new StringTracker(text.StartInfo);
        for (const i of this.values) {
            if (i.type == 'text' && i.data.eq != '') {
                output.Plus(i.data);
            } else if (i.type == 'script') {
                output.Plus$`<%${i.data}%>`;
            } else if (i.type == 'script-print') {
                if (i.data[0] == ':') {
                    output.Plus$`<%:${i.data.substring(1)}%>`;
                } else {
                    output.Plus$`<%=${i.data}%>`;
                }
            }
        }
        return output;
    }
}

export default function ConvertSyntax(text: StringTracker, options?: any) {
    return new Razor(options?.char).BuildAll(text);
}
