import StringTracker from '../../EasyDebug/StringTracker';
import {find_end_of_def, find_end_of_q} from './RustBind/index.js';
import * as Settings from './Settings';
import {getDirname} from '../../RunTimeBuild/SearchFileSystem';
import Multithreading from '../Multithreading';

const __dirname = getDirname(import.meta.url);

export class BaseReader {
    findEntOfQ(text: string, qType: string) {
        return find_end_of_q(text, qType);
    }

    findEndOfDef(text: string, EndType: string[] | string) {
        if(!Array.isArray(EndType)){
            EndType = [EndType];
        }

        return find_end_of_def(text, JSON.stringify(EndType));
    }
}

export class InsertComponentBase extends BaseReader {
    private asyncMethod: Multithreading;

    SimpleSkip: string[] = Settings.SimpleSkip;
    SkipSpecialTag: string[][] = Settings.SkipSpecialTag;

    constructor(private printNew?:any){
        super();

        this.asyncMethod = new Multithreading(10, __dirname + '/RustBind/worker.js');
    }

    private printErrors(text: StringTracker, errors: any[]){
        if(this.printNew){
            for(const i of errors){
                this.printNew({
                    text: `\nWarning, you didn't write right this tag: "${i.type_name}", used in: ${text.at(Number(i.index)).lineInfo}\n(the system will auto close it)\n`,
                    errorName: "close-tag"
                });
            }
        }
    }

    public async FindCloseChar(text: StringTracker, Search: string){
        const [point, errors] = await this.asyncMethod.getMethod(['FindCloseChar', 'GetErrors'], text.eq, Search);

        this.printErrors(text, JSON.parse(errors));

        return point;
    }

    public async FindCloseCharHTML(text: StringTracker, Search: string){
        const [point, errors] = await this.asyncMethod.getMethod(['FindCloseCharHTML', 'GetErrors'], text.eq, Search);

        this.printErrors(text, JSON.parse(errors));

        return point;
    }
}