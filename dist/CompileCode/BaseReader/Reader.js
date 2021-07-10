// import * as assemblyscript from "@assemblyscript/loader";
// import exportsAsModule from '../../../../../asemblyCompiler/index.js';
// import {setReader, BaseReader, InsertComponentBase} from '../../../../../asemblyCompiler/src/BaseScriptReader.js';
// // import fs from 'fs';
import { insert_component, find_end_of_def, find_end_of_q, get_errors, find_close_char, find_close_char_html_elem } from './RustBind/index.js';
export class BaseReader {
    findEntOfQ(text, qType) {
        return find_end_of_q(text, qType);
    }
    findEndOfDef(text, EndType) {
        if (!Array.isArray(EndType)) {
            EndType = [EndType];
        }
        let re;
        try {
            re = find_end_of_def(text, JSON.stringify(EndType));
        }
        catch (err) {
            1 == 1;
        }
        return re;
    }
}
// console.log(find_end_of_def("=newAlertsLength == 0 ? 'd-none': 'd-inline-block'", JSON.stringify([";", "%>", "\n"])))
export class InsertComponentBase extends BaseReader {
    printNew;
    tree_map = [];
    SimpleSkip_;
    SkipSpecialTag_;
    constructor(printNew = null, SimpleSkip = ['textarea', 'script', 'style'], SkipSpecialTag = [["%", "%"], ["#{debug}", "{debug}#"]]) {
        super();
        this.printNew = printNew;
        insert_component(JSON.stringify(SkipSpecialTag), JSON.stringify(SimpleSkip));
        this.SimpleSkip_ = SimpleSkip;
        this.SkipSpecialTag_ = SkipSpecialTag;
    }
    FindSpecialTagByStart(string) {
        for (const i of this.SkipSpecialTag_) {
            if (string.substring(0, i[0].length).eq == i[0]) {
                return i;
            }
        }
    }
    FindCloseChar2(text, Search, Open = "<", End = ">", CharBeforeEnd = '/', TypeAsEndBigTag = false) {
        const SkipTypes = ['"', "'", '`'];
        let i = 0;
        for (; i < text.length - Search.length; i++) {
            const char = text.at(i);
            if (SkipTypes.includes(char.eq) && text.at(i - 1).eq != '\\') {
                i += this.findEntOfQ(text.substring(i + 1).eq, char.eq) + 1;
            }
            else if (text.substring(i, i + Search.length).eq == Search) {
                return i;
            }
            else if (text.substring(i, i + Open.length).eq == Open) {
                const subText = text.substring(i + Open.length);
                const FoundTag = this.FindSpecialTagByStart(subText);
                if (FoundTag) {
                    const EndScript = subText.substring(FoundTag[0].length).indexOf(FoundTag[1] + End);
                    if (EndScript != -1) {
                        i += EndScript + FoundTag[0].length + FoundTag[1].length + End.length + Open.length - 1;
                    }
                    else {
                        i += subText.length;
                    }
                }
                else {
                    const found = this.findEndOfDef(subText.eq, End);
                    i += found + End.length + Open.length - 1;
                    if (TypeAsEndBigTag && subText[0] == CharBeforeEnd) {
                        continue;
                    }
                    if (CharBeforeEnd && subText[found - 1] != CharBeforeEnd) {
                        const tagType = subText.substring(0, found).split(' ')[0];
                        let nextText = subText.substring(found + End.length);
                        let endTagIndex;
                        const SkipTag = this.SimpleSkip_.includes(tagType.eq);
                        if (SkipTag) {
                            endTagIndex = this.findEndOfDef(nextText.eq, '</' + tagType.eq); //body
                        }
                        else {
                            endTagIndex = this.FindCloseChar2(nextText, '</' + tagType.eq, Open, End, CharBeforeEnd, true);
                        }
                        if (endTagIndex == null) {
                            this.printNew({
                                text: `\nWarning, you didn't write right this tag: "${tagType}", used in: ${tagType.lineInfo}\n(the system will auto close it)\n`,
                                errorName: "close-tag"
                            });
                        }
                        else {
                            if (!SkipTag)
                                endTagIndex += 2 + tagType.length; // start length: </ + tagType + end length: >
                            nextText = nextText.substring(endTagIndex);
                            i += endTagIndex + this.findEndOfDef(nextText.eq, End) + End.length - 1; //body
                        }
                    }
                }
            }
        }
    }
    printErrors(text) {
        const errors = JSON.parse(get_errors());
        if (this.printNew) {
            for (const i of errors) {
                this.printNew({
                    text: `\nWarning, you didn't write right this tag: "${i.type_name}", used in: ${text.at(Number(i.index)).lineInfo}\n(the system will auto close it)\n`,
                    errorName: "close-tag"
                });
            }
        }
    }
    FindCloseChar(text, Search, Open = "<", End = ">", CharBeforeEnd = '/', TypeAsEndBigTag = false) {
        if (CharBeforeEnd == '') {
            CharBeforeEnd = ' ';
        }
        const point = find_close_char(text.eq, Search, Open, End, CharBeforeEnd, TypeAsEndBigTag);
        this.printErrors(text);
        return point;
    }
    FindCloseCharHTML(text, Search) {
        const point = find_close_char_html_elem(text.eq, Search);
        this.printErrors(text);
        return point;
    }
}
// export class BaseReader {
//     findEntOfQ(text: string, qType: string) {
//         let i = 0;
//         for (; i < text.length; i++) {
//             if (text[i] == qType && text[i - 1] != '\\') {
//                 return i + 1;
//             }
//         }
//         return i;
//     }
//     private isAnyDef(text: string, index: number, EndType: string[]){
//         for(const i of EndType){
//             if(text.substring(index - i.length, index) == i){
//                 return true;
//             }
//         }
//         return false;
//     }
//     findEndOfDef(text: string, EndType: string[] | string) {
//         if(!Array.isArray(EndType)){
//             EndType = [EndType];
//         }
//         const SkipTypes = ['"', "'", '`'];
//         let i = 0;
//         for (; i < text.length; i++) {
//             const char = text[i];
//             if (SkipTypes.includes(char) && text[i - 1] != '\\') {
//                 i += this.findEntOfQ(text.substring(i + 1), char) + 1;
//             } else if (this.isAnyDef(text, i, EndType)) {
//                 return i - 1;
//             }
//         }
//         return i - 1;
//     }
// }
//# sourceMappingURL=Reader.js.map