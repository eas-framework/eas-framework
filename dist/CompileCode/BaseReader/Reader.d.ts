import StringTracker from '../../EasyDebug/StringTracker';
export declare class BaseReader {
    static findEntOfQ(text: string, qType: string): any;
    static findEndOfDef(text: string, EndType: string[] | string): any;
    static FindEndOfBlock(text: string, open: string, end: string): any;
}
export declare class InsertComponentBase {
    private printNew?;
    private asyncMethod;
    SimpleSkip: string[];
    SkipSpecialTag: string[][];
    constructor(printNew?: any);
    private printErrors;
    FindCloseChar(text: StringTracker, Search: string): Promise<any>;
    FindCloseCharHTML(text: StringTracker, Search: string): Promise<any>;
}
