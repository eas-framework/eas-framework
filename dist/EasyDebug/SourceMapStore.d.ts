import StringTracker from './StringTracker';
import { SourceMapGenerator, RawSourceMap } from "source-map-js";
export declare abstract class SourceMapBasic {
    protected filePath: string;
    protected httpSource: boolean;
    protected isCss: boolean;
    protected map: SourceMapGenerator;
    protected fileDirName: string;
    protected lineCount: number;
    constructor(filePath: string, httpSource?: boolean, isCss?: boolean);
    protected getSource(source: string): string;
    mapAsURLComment(): string;
}
export default class SourceMapStore extends SourceMapBasic {
    protected debug: boolean;
    private storeString;
    private actionLoad;
    constructor(filePath: string, debug?: boolean, isCss?: boolean, httpSource?: boolean);
    notEmpty(): boolean;
    addStringTracker(track: StringTracker, { text: text }?: {
        text?: string;
    }): void;
    private _addStringTracker;
    addText(text: string): void;
    private _addText;
    static fixURLSourceMap(map: RawSourceMap): RawSourceMap;
    addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string): Promise<void>;
    private _addSourceMapWithStringTracker;
    private buildAll;
    mapAsURLComment(): string;
    createDataWithMap(): string;
    clone(): SourceMapStore;
}
