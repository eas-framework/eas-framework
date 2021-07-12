import StringTracker from '../../EasyDebug/StringTracker';
export declare class BaseReader {
    findEntOfQ(text: string, qType: string): any;
    findEndOfDef(text: string, EndType: string[] | string): any;
}
export declare class InsertComponentBase extends BaseReader {
    private printNew?;
    private asyncMethod;
    SimpleSkip: string[];
    SkipSpecialTag: string[][];
    constructor(printNew?: any);
    private printErrors;
    FindCloseChar(text: StringTracker, Search: string): Promise<any>;
    FindCloseCharHTML(text: StringTracker, Search: string): Promise<any>;
}
