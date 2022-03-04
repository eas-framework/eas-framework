import StringTracker from '../../EasyDebug/StringTracker';
export declare class BaseReader {
    /**
     * Find the end of quotation marks, skipping things like escaping: "\\""
     * @return the index of end
     */
    static findEntOfQ(text: string, qType: string): any;
    /**
     * Find char skipping data inside quotation marks
     * @return the index of end
     */
    static findEndOfDef(text: string, EndType: string[] | string): any;
    /**
     * Same as 'findEndOfDef' only with option to custom 'open' and 'close'
     * ```js
     * FindEndOfBlock(`cool "}" { data } } next`, '{', '}')
     * ```
     * it will return the 18 -> "} next"
     *  @return the index of end
     */
    static FindEndOfBlock(text: string, open: string, end: string): any;
}
export declare class InsertComponentBase {
    private printNew?;
    SimpleSkip: string[];
    SkipSpecialTag: string[][];
    constructor(printNew?: any);
    private printErrors;
    FindCloseChar(text: StringTracker, Search: string): Promise<any>;
    FindCloseCharHTML(text: StringTracker, Search: string): Promise<any>;
}
declare type ParseBlocks = {
    name: string;
    start: number;
    end: number;
}[];
export declare function RazorToEJS(text: string): Promise<ParseBlocks>;
export declare function EJSParser(text: string, start: string, end: string): Promise<ParseBlocks>;
export {};
