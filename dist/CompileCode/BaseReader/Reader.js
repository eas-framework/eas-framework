import { find_end_of_def, find_end_of_q, find_end_block } from './RustBind/index.js';
import * as Settings from './Settings.js';
import { getDirname } from '../../RunTimeBuild/SearchFileSystem.js';
import workerPool from 'workerpool';
import { cpus } from 'os';
const __dirname = getDirname(import.meta.url);
export class BaseReader {
    /**
     * Find the end of quotation marks, skipping things like escaping: "\\""
     * @return the index of end
     */
    static findEntOfQ(text, qType) {
        return find_end_of_q(text, qType);
    }
    /**
     * Find char skipping data inside quotation marks
     * @return the index of end
     */
    static findEndOfDef(text, EndType) {
        if (!Array.isArray(EndType)) {
            EndType = [EndType];
        }
        return find_end_of_def(text, JSON.stringify(EndType));
    }
    /**
     * Same as 'findEndOfDef' only with option to custom 'open' and 'close'
     * ```js
     * FindEndOfBlock(`cool "}" { data } } next`, '{', '}')
     * ```
     * it will return the 18 -> "} next"
     *  @return the index of end
     */
    static FindEndOfBlock(text, open, end) {
        return find_end_block(text, open + end);
    }
}
const cpuLength = Math.max(1, Math.floor(cpus().length / 2));
export class InsertComponentBase {
    constructor(printNew) {
        this.printNew = printNew;
        this.SimpleSkip = Settings.SimpleSkip;
        this.SkipSpecialTag = Settings.SkipSpecialTag;
        this.asyncMethod = workerPool.pool(__dirname + '/RustBind/workerInsertComponent.js', { maxWorkers: cpuLength });
    }
    printErrors(text, errors) {
        if (!this.printNew)
            return;
        for (const i of JSON.parse(errors)) {
            this.printNew({
                text: `\nWarning, you didn't write right this tag: "${i.type_name}", used in: ${text.at(Number(i.index)).lineInfo}\n(the system will auto close it)\n`,
                errorName: "close-tag"
            });
        }
    }
    async FindCloseChar(text, Search) {
        const [point, errors] = await this.asyncMethod.exec('FindCloseChar', [text.eq, Search]);
        this.printErrors(text, errors);
        return point;
    }
    async FindCloseCharHTML(text, Search) {
        const [point, errors] = await this.asyncMethod.exec('FindCloseCharHTML', [text.eq, Search]);
        this.printErrors(text, errors);
        return point;
    }
}
//# sourceMappingURL=Reader.js.map