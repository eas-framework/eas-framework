import StringTracker from './StringTracker';
import { RawSourceMap } from "source-map-js";
export default class SourceMapStore {
    private filePath;
    private debug;
    private isCss;
    private addToUrl;
    private storeString;
    private map;
    private lineCount;
    constructor(filePath: string, debug: boolean, isCss?: boolean, addToUrl?: string);
    notEmpty(): boolean;
    private getSource;
    addStringTracker(track: StringTracker, text?: string): void;
    addText(text: string): void;
    addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string): Promise<void>;
    createDataWithMap(): string;
}
