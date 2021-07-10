import StringTracker from '../../EasyDebug/StringTracker';
export declare class BaseReader {
    findEntOfQ(text: string, qType: string): any;
    findEndOfDef(text: string, EndType: string[] | string): any;
}
export declare class InsertComponentBase extends BaseReader {
    private printNew;
    private tree_map;
    private SimpleSkip_;
    private SkipSpecialTag_;
    constructor(printNew?: any, SimpleSkip?: string[], SkipSpecialTag?: string[][]);
    FindSpecialTagByStart(string: StringTracker): string[];
    FindCloseChar2(text: StringTracker, Search: string, Open?: string, End?: string, CharBeforeEnd?: string, TypeAsEndBigTag?: boolean): number;
    private printErrors;
    FindCloseChar(text: StringTracker, Search: string, Open?: string, End?: string, CharBeforeEnd?: string, TypeAsEndBigTag?: boolean): number;
    FindCloseCharHTML(text: StringTracker, Search: string): any;
}
