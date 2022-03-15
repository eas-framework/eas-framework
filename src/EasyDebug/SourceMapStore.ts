import StringTracker from './StringTracker';
import { SourceMapGenerator, RawSourceMap, SourceMapConsumer } from "source-map-js";
import path from 'path';
import { BasicSettings, getTypes } from '../RunTimeBuild/SearchFileSystem';
import {fileURLToPath} from "url";
export abstract class SourceMapBasic {
    protected map: SourceMapGenerator;
    protected fileDirName: string;
    protected lineCount = 0;

    constructor(protected filePath: string, protected httpSource = true, protected isCss = false) {
        this.map = new SourceMapGenerator({
            file: filePath.split(/\/|\\/).pop()
        });

        if (!httpSource)
            this.fileDirName = path.dirname(this.filePath);
    }

    protected getSource(source: string) {
        source = source.split('<line>').pop().trim();

        if (this.httpSource) {
            source = path.relative(BasicSettings.fullWebSitePath, source);

            if (BasicSettings.pageTypesArray.includes(path.extname(source).substring(1)))
                source += '.source';
            else
                source += '?source=true';
            return path.join('/', source.replace(/\\/gi, '/'));
        }

        return path.relative(this.fileDirName, BasicSettings.fullWebSitePath + source);
    }

    mapAsURLComment() {
        let mapString = `sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(this.map.toString()).toString("base64")}`;

        if (this.isCss)
            mapString = `/*# ${mapString}*/`
        else
            mapString = '//# ' + mapString;

        return '\r\n' + mapString;
    }
}

export default class SourceMapStore extends SourceMapBasic {
    private storeString = '';
    private actionLoad: { name: string, data: any[] }[] = [];

    constructor(filePath: string, protected debug = true, isCss = false, httpSource = true) {
        super(filePath, httpSource, isCss);
    }

    notEmpty() {
        return this.actionLoad.length > 0;
    }

    addStringTracker(track: StringTracker, { text: text = track.eq } = {}) {
        this.actionLoad.push({ name: 'addStringTracker', data: [track, text] });
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

    async addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string, source?: string) {
        source && (fromMap.sources[fromMap.sources.length-1] = source);
        for(let i = 0; i < fromMap.sources.length -1; i++){
            fromMap.sources[i] = path.relative(getTypes.Static[0],fileURLToPath(fromMap.sources[i]));
        }
        this.actionLoad.push({ name: 'addSourceMapWithStringTracker', data: [fromMap, track, text] });
    }

    private async _addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string) {
        if (!this.debug)
            return this._addText(text);

        new SourceMapConsumer(fromMap).eachMapping((m) => {
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

    private buildAll() {
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
                    this._addSourceMapWithStringTracker(...data)
                    break;
            }
        }
    }

    mapAsURLComment() {
        this.buildAll();

        return super.mapAsURLComment()
    }

    createDataWithMap() {
        this.buildAll();
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