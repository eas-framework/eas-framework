import { find_end_of_def, find_end_of_q } from './RustBind/index.js';
import * as Settings from './Settings.js';
import { getDirname } from '../../RunTimeBuild/SearchFileSystem.js';
import Multithreading from '../Multithreading.js';
const __dirname = getDirname(import.meta.url);
export class BaseReader {
    findEntOfQ(text, qType) {
        return find_end_of_q(text, qType);
    }
    findEndOfDef(text, EndType) {
        if (!Array.isArray(EndType)) {
            EndType = [EndType];
        }
        return find_end_of_def(text, JSON.stringify(EndType));
    }
}
export class InsertComponentBase extends BaseReader {
    printNew;
    asyncMethod;
    SimpleSkip = Settings.SimpleSkip;
    SkipSpecialTag = Settings.SkipSpecialTag;
    constructor(printNew) {
        super();
        this.printNew = printNew;
        this.asyncMethod = new Multithreading(10, __dirname + '/RustBind/worker.js');
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
        const [point, errors] = await this.asyncMethod.getMethod(['FindCloseChar', 'GetErrors'], text.eq, Search);
        this.printErrors(text, JSON.parse(errors));
        return point;
    }
    async FindCloseCharHTML(text, Search) {
        const [point, errors] = await this.asyncMethod.getMethod(['FindCloseCharHTML', 'GetErrors'], text.eq, Search);
        this.printErrors(text, JSON.parse(errors));
        return point;
    }
}
//# sourceMappingURL=Reader.js.map