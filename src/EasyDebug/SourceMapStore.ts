import StringTracker from './StringTracker';
import { SourceMapGenerator, RawSourceMap, SourceMapConsumer } from "source-map";
import path from 'path';
import { BasicSettings, getTypes } from '../RunTimeBuild/SearchFileSystem';
import {fileURLToPath} from "url";
import { SplitFirst } from '../StringMethods/Splitting';
import { toURLComment } from './SourceMap';
import { StringMap } from '../CompileCode/XMLHelpers/CompileTypes';
export abstract class SourceMapBasic {
    protected map: SourceMapGenerator;
    protected fileDirName: string;
    protected lineCount = 0;

    constructor(protected filePath: string, protected httpSource = true, protected relative = false, protected isCss = false) {
        this.map = new SourceMapGenerator({
            file: filePath.split(/\/|\\/).pop()
        });

        if (!httpSource)
            this.fileDirName = path.dirname(this.filePath);
    }

    protected getSource(source: string) {
        source = source.split('<line>').pop().trim();

        if (this.httpSource) {
            if (BasicSettings.pageTypesArray.includes(path.extname(source).substring(1)))
                source += '.source';
            else
                source = SplitFirst('/', source).pop() + '?source=true';
            return path.normalize((this.relative ? '': '/') + source.replace(/\\/gi, '/'));
        }

        return path.relative(this.fileDirName, BasicSettings.fullWebSitePath + source);
    }

    getRowSourceMap(): RawSourceMap{
        return this.map.toJSON()
    }

    mapAsURLComment() {
        return toURLComment(this.map, this.isCss);
    }
}

export default class SourceMapStore extends SourceMapBasic {
    metaMap: StringMap = {}
    private storeString = '';
    private actionLoad: { name: string, data: any[] }[] = [];

    constructor(filePath: string, protected debug = true, isCss = false, httpSource = true) {
        super(filePath, httpSource, false, isCss);
    }

    notEmpty() {
        return this.actionLoad.length > 0;
    }

    addStringTracker(track: StringTracker, { text: text = track.eq } = {}) {
        this.actionLoad.push({ name: 'addStringTracker', data: [track, {text}] });
    }

    private _addStringTracker(track: StringTracker, { text: text = track.eq } = {}) {
        if (!this.debug)
            return this._addText(text);

        const DataArray = track.getDataArray(), length = DataArray.length;
        let waitNextLine = false;

        for (let index = 0; index < length; index++) {
            const { text, line, info } = DataArray[index];

            if (text == '\n') {
                this.lineCount++;
                waitNextLine = false;
                continue;
            }

            if (!waitNextLine && line && info) {
                waitNextLine = true;
                this.map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: this.lineCount, column: 0 },
                    source: this.getSource(info)
                });
            }
        }

        this.storeString += text;
    }


    addText(text: string) {
        this.actionLoad.push({ name: 'addText', data: [text] });
    }

    private _addText(text: string) {
        if (this.debug)
            this.lineCount += text.split('\n').length - 1;
        this.storeString += text;
    }

    static fixURLSourceMap(map: RawSourceMap){
        for(let i = 0; i < map.sources.length; i++){
            map.sources[i] = BasicSettings.relative(fileURLToPath(map.sources[i]));
        }
        return map;
    }

    addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string) {
        this.actionLoad.push({ name: 'addSourceMapWithStringTracker', data: [fromMap, track, text] });
    }

    private async _addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string) {
        if (!this.debug)
            return this._addText(text);

        (await new SourceMapConsumer(fromMap)).eachMapping((m) => {
            const dataInfo = track.getLine(m.originalLine).getDataArray()[0];

            if (m.source == this.filePath)
                this.map.addMapping({
                    source: this.getSource(m.source),
                    original: { line: dataInfo.line, column: m.originalColumn },
                    generated: { line: m.generatedLine + this.lineCount, column: m.generatedColumn }
                });
            else
                this.map.addMapping({
                    source: this.getSource(m.source),
                    original: { line: m.originalLine, column: m.originalColumn },
                    generated: { line: m.generatedLine, column: m.generatedColumn }
                });
        });

        this._addText(text);
    }

    private async buildAll() {
        for (const { name, data } of this.actionLoad) {
            switch (name) {
                case 'addStringTracker':
                    //@ts-ignore
                    this._addStringTracker(...data)
                    break;
                case 'addText':
                    //@ts-ignore
                    this._addText(...data)
                    break;
                case 'addSourceMapWithStringTracker':
                    //@ts-ignore
                    await this._addSourceMapWithStringTracker(...data)
                    break;
            }
        }
    }

    mapAsURLComment() {
        this.buildAll();

        return super.mapAsURLComment()
    }

    async createDataWithMap() {
        await this.buildAll();
        if (!this.debug)
            return this.storeString;

        return this.storeString + super.mapAsURLComment();
    }

    clone() {
        const copy = new SourceMapStore(this.filePath, this.debug, this.isCss, this.httpSource);
        copy.actionLoad.push(...this.actionLoad)
        return copy;
    }
}