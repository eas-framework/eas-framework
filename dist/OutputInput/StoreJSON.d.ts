import { StringAnyMap } from "../CompileCode/XMLHelpers/CompileTypes";
export default class StoreJSON {
    private savePath;
    store: StringAnyMap;
    constructor(filePath: string, autoLoad?: boolean);
    loadFile(): Promise<void>;
    update(key: string, value: any): void;
    have(key: string, create?: () => string): any;
    clear(): void;
    private save;
}
