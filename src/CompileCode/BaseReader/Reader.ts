import StringTracker from '../../EasyDebug/StringTracker';
import { find_end_of_def, find_end_of_q, find_end_block, ejs_parse } from './RustBind/index.js';
import * as Settings from './Settings';
import { getDirname } from '../../RunTimeBuild/SearchFileSystem';
import workerPool from 'workerpool';
import { cpus } from 'os';

const __dirname = getDirname(import.meta.url);
const cpuLength = Math.max(1, Math.floor(cpus().length / 2));
const pool = workerPool.pool(__dirname + '/RustBind/workerInsertComponent.js', { maxWorkers: cpuLength });

export class BaseReader {
    /**
     * Find the end of quotation marks, skipping things like escaping: "\\""
     * @return the index of end
     */
    static findEntOfQ(text: string, qType: string) {
        return find_end_of_q(text, qType);
    }

    /**
     * Find char skipping data inside quotation marks
     * @return the index of end
     */
    static findEndOfDef(text: string, EndType: string[] | string) {
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
    static FindEndOfBlock(text: string, open: string, end: string) {
        return find_end_block(text, open + end);
    }
}

export class InsertComponentBase {
    SimpleSkip: string[] = Settings.SimpleSkip;
    SkipSpecialTag: string[][] = Settings.SkipSpecialTag;

    constructor(private printNew?: any) { }

    private printErrors(text: StringTracker, errors: string) {
        if (!this.printNew) return;

        for (const i of JSON.parse(errors)) {
            this.printNew({
                text: `\nWarning, you didn't write right this tag: "${i.type_name}", used in: ${text.at(Number(i.index)).lineInfo}\n(the system will auto close it)`,
                errorName: "close-tag"
            });
        }
    }
    public async FindCloseChar(text: StringTracker, Search: string) {
        const [point, errors] = await pool.exec('FindCloseChar', [text.eq, Search]);
        this.printErrors(text, errors);

        return point;
    }

    public async FindCloseCharHTML(text: StringTracker, Search: string) {
        const [point, errors] = await pool.exec('FindCloseCharHTML', [text.eq, Search]);
        this.printErrors(text, errors);

        return point;
    }
}

type ParseBlocks = { name: string, start: number, end: number }[]

export async function RazorToEJS(text: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('RazorToEJS', [text]));
}


export async function EJSParser(text: string, start: string, end: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('EJSParser', [text, start, end]));
}