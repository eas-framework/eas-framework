interface SplitText {
    text: string;
    type_name: string;
    is_skip: boolean;
}
export declare function ParseTextStream(text: string): Promise<SplitText[]>;
declare abstract class BaseEntityCode {
    ReplaceAll(text: string, find: string, replace: string): string;
}
declare abstract class ReBuildCodeBasic extends BaseEntityCode {
    ParseArray: SplitText[];
    constructor(ParseArray: SplitText[]);
    BuildCode(): string;
}
export declare class ReBuildCodeString extends ReBuildCodeBasic {
    private DataCode;
    constructor(ParseArray: SplitText[]);
    get CodeBuildText(): string;
    set CodeBuildText(value: string);
    get AllInputs(): string[];
    private CreateDataCode;
    /**
     * if the <||> start with a (+.) like that for example, "+.<||>", the update function will get the last "SkipText" instead getting the new one
     * same with a (-.) just for ignoring current value
     * @returns the builded code
     */
    BuildCode(): string;
}
export {};
