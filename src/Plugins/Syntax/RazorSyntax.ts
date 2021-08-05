import StringTracker from '../../EasyDebug/StringTracker';
import {BaseReader} from '../../CompileCode/BaseReader/Reader';

interface RazorDataItem {
    type: string,
    data: StringTracker
}

class Razor {
	public values: RazorDataItem[];


    constructor(public typeLoad = '@', public comment = '*', public skipWords = ["basic"], public CharNotSkip = [".", " ", "\n"], public StringNotSkip = ["?."], public checkEnd = [" ", "\n", ";"],public  notPrint = {"for": [], "if": ["else if", "else"], "while": ["do"], "do": []}) {
    }

    // findEntOfQ(text:StringTracker, qType:string) {
    //     let i = 0;
    //     for (; i < text.length; i++) {
    //         if (text.at(i).eq == qType && text.at(i - 1).eq != '\\') {
    //             return i + 1;
    //         }
    //     }
    //     return i;
    // }

    // BaseReader.FindEndOfBlock(text:StringTracker, open = '(', close = ')') {
    //     const SkipTypes = ['"', "'", '`'];
    //     let counter = 1;
    //     let i = 0;
    //     for (; i < text.length; i++) {
    //         const char = text.at(i);
    //         if (SkipTypes.includes(char.eq) && text.at(i - 1).eq != '\\') {
    //             i += this.findEntOfQ(text.substring(i + 1), char.eq); // no +1 becuse i is doing ++ in the loop
    //         } else if (text.substring(i, i + close.length).eq == open) {
    //             counter++;
    //         } else if (text.substring(i, i + close.length).eq == close) {
    //             counter--;
    //             if (counter == 0) {
    //                 return i;
    //             }
    //         }
    //     }
    //     return i;
    // }

    CheckWithoutSpace(text:StringTracker, ArrayCheck:string[]){
        for(const i of ArrayCheck){
            const index = text.indexOf(i);
            if(index != -1 && text.substring(0, index).trim().eq == ''){
                return i;
            }
        }
    }

    GetNextSpaceIndex(text:StringTracker, getFrom:StringTracker){
        const all = getFrom.split(' ');

        let counter = 0;
        for(const i of all){
          const index = text.indexOf(i.eq);
          counter += index + i.length;
          text = text.substring(index + i.length);
        }

        return counter;
    }

    AnyStringNotSkip(text: StringTracker, index: number): boolean {

        for(const i of this.StringNotSkip){
            if(text.substring(index, index+i.length).eq == i){
                return true;
            }
        }
        return false;
    }

    ParseScript(text:StringTracker, SmallScript = false, i = 0, ArrayNext:string[] = [], needOneBig = false, ReFirst?: (text: StringTracker) => void) {
        const typeQ = [
            ["(", "[", "{"],
            [")", "]", "}"]
        ];

        let nextBreak = 0;

        for (; i < text.length; i++) {
            const char = text.at(i);
            const indexQ = typeQ[0].indexOf(char.eq);

            if (indexQ != -1) {
                const EndBlock = BaseReader.FindEndOfBlock(text.eq.substring(i + 1), char.eq, typeQ[1][indexQ]); // no +1 because i is doing ++ in the loop;

                if (!SmallScript && char.eq == typeQ[0][2]) {
                    needOneBig = true;
                    
                    if(ReFirst){
                        ReFirst(text.substring(0, i + 1));
                    } else {
                        this.values.push({
                            type: 'script',
                            data: text.substring(0, i + 1)
                        });
                    }

                    text = text.substring(i + 1);
                    this.Builder(text.substring(0, EndBlock));

                    text = text.substring(EndBlock + 1);

                    const next = this.CheckWithoutSpace(text, ArrayNext);

                    if (next) {
                        const values = this.values;
                        this.ParseScript(text, false, this.GetNextSpaceIndex(text, new StringTracker(text.DefaultInfoText, next)), ArrayNext, true, (FirstScript) => {
                            values.push({
                                type: 'script',
                                data: new StringTracker(FirstScript.DefaultInfoText, typeQ[1][indexQ]).Plus(FirstScript)
                            });
                        });
                    } else {
                        this.values.push({
                            type: 'script',
                            data: new StringTracker(text.DefaultInfoText, typeQ[1][indexQ])
                        });
                        this.Builder(text);
                    }

                    return;
                } else {

                    if(SmallScript && text.at(0).eq == "("){
                        nextBreak = 1;
                    }

                    i += 1 + EndBlock;
                }

            } else if (nextBreak || !needOneBig && this.checkEnd.includes(char.eq) || !this.CharNotSkip.includes(char.eq) && !this.AnyStringNotSkip(text, i) && this.findFirstWordIndex(char) != -1) {
                if (char.eq == ';') {
                    i++;
                }

                this.values.push({
                    type: 'script' + (SmallScript ? '-print' : ''),
                    data: text.substring(nextBreak, i - nextBreak)
                });

                this.Builder(text.substring(i));
                return;
            }
        }

        this.values.push({
            type: 'script' + (SmallScript ? '-print' : ''),
            data: text.substring(nextBreak, text.length - nextBreak).Plus(';')
        });
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
            data:  new StringTracker(maindata[maindata.length-1].DefaultInfoText, '}')
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
            data: new StringTracker(maindata[maindata.length-1].DefaultInfoText, '}')
        });

        this.Builder(text.substring(endMain + 1));
    }

    skipIt(text: StringTracker, indexEnd: number, indexStart = indexEnd){
        this.values.push({
            type: 'text',
            data: text.substring(0, indexEnd)
        }); 
        this.Builder(text.substring(indexStart));
    }

    Builder(text: StringTracker) {
        const index = text.indexOf(this.typeLoad);

        if (index == -1) {
            this.values.push({
                type: 'text',
                data: text
            }); // add lefted text
            return;
        } else if(text.at(index+1).eq == this.typeLoad){//adding as text if @@
            this.skipIt(text, index + this.typeLoad.length, index + this.typeLoad.length*2);
            return;
        } else if(text.at(index+1).eq == this.comment){//remove comments
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

        if(this.skipWords.includes(firstWord)){
            this.skipIt(text, firstWordIndex);
            return;
        }

        text = textNext;

        if (firstWord == 'switch') {
            this.SwitchParser(text);
        } else if (firstWord == 'function') {
            this.FunctionParser(text);
        } else if (this.notPrint[firstWord]) {
            this.ParseScript(text, false, 0, this.notPrint[firstWord]);
        } else if (text.at(0).eq == '{') {
            text = text.substring(1);
            const blockEnd = BaseReader.FindEndOfBlock(text.eq, '{', '}');
            this.values.push({
                type: 'script',
                data: text.substring(0, blockEnd).Plus(';')
            });
            this.Builder(text.substring(blockEnd + 1));
        } else {
            this.ParseScript(text, true, text.at(0).eq == ':' ? 1 : 0);
        }
    }

    BuildAll(text: StringTracker): StringTracker {
        this.values = [];
        this.Builder(text);

        const output = new StringTracker(text.StartInfo);
        for (const i of this.values) {
            if (i.type == 'text' && i.data.trim().eq != '') {
                output.Plus(i.data);
            } else if (i.type == 'script') {
                output.Plus$ `<%${i.data}%>`;
            } else if (i.type == 'script-print') {
                if (i.data[0] == ':') {
                    output.Plus$ `<%:${i.data.substring(1)}%>`;
                } else {
                    output.Plus$ `<%=${i.data}%>`;
                }
            }
        }
        return output;
    }
}

export default function ConvertSyntax(text: StringTracker, options?: any) {
    return new Razor(options?.char).BuildAll(text);
}
