import { find_end_of_def, find_end_of_q, find_end_block } from './RustBind/index.js';
import * as Settings from './Settings.js';
import { getDirname } from '../../RunTimeBuild/SearchFileSystem.js';
import Multithreading from '../Multithreading.js';
const __dirname = getDirname(import.meta.url);
export class BaseReader {
    static findEntOfQ(text, qType) {
        return find_end_of_q(text, qType);
    }
    static findEndOfDef(text, EndType) {
        if (!Array.isArray(EndType)) {
            EndType = [EndType];
        }
        return find_end_of_def(text, JSON.stringify(EndType));
    }
    static FindEndOfBlock(text, open, end) {
        return find_end_block(text, open + end);
    }
}
export class InsertComponentBase {
    printNew;
    asyncMethod;
    SimpleSkip = Settings.SimpleSkip;
    SkipSpecialTag = Settings.SkipSpecialTag;
    constructor(printNew) {
        this.printNew = printNew;
        this.asyncMethod = new Multithreading(8, __dirname + '/RustBind/workerInsertComponent.js');
    }
    printErrors(text, errors) {
        if (this.printNew) {
            for (const i of errors) {
                this.printNew({
                    text: `\nWarning, you didn't write right this tag: "${i.type_name}", used in: ${text.at(Number(i.index)).lineInfo}\n(the system will auto close it)\n`,
                    errorName: "close-tag"
                });
            }
        }
    }
    async FindCloseChar(text, Search) {
        const [point, errors] = await this.asyncMethod.getMethod({
            FindCloseChar: [text.eq, Search],
            GetErrors: []
        });
        this.printErrors(text, JSON.parse(errors));
        return point;
    }
    async FindCloseCharHTML(text, Search) {
        const [point, errors] = await this.asyncMethod.getMethod({
            FindCloseCharHTML: [text.eq, Search],
            GetErrors: []
        });
        this.printErrors(text, JSON.parse(errors));
        return point;
    }
}
