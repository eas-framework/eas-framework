import StringTracker from './StringTracker';
import { SourceMapGenerator, RawSourceMap, SourceMapConsumer } from "source-map-js";
import path from 'path';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';

export abstract class SourceMapBasic {
    protected map: SourceMapGenerator;
    protected fileDirName: string;
    protected lineCount = 0;

    constructor(protected filePath: string, private httpSource = true, private isCss = false) {
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
        } else
            source = path.relative(this.fileDirName, source);

        return source.replace(/\\/gi, '/');
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

    constructor(filePath: string, private debug = true, isCss = false, httpSource = true) {
        super(filePath, httpSource, isCss);
    }

    notEmpty() {
        return Boolean(this.storeString);
    }

    addStringTracker(track: StringTracker, { text: text = track.eq } = {}) {
        if (!this.debug)
            return this.addText(text);

        const DataArray = track.getDataArray(), length = DataArray.length;

        for (let index = 0; index < length; index++) {
            const {text, line, info} = DataArray[index];

            if (text == '\n' && ++this.lineCount) 
                continue;

            if (line && info)
                this.map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: this.lineCount + 1, column: 0 },
                    source: this.getSource(info)
                });
        }

        this.storeString += text;
    }

    addText(text: string) {
        if (this.debug)
            this.lineCount += text.split('\n').length - 1;
        this.storeString += text;
    }

    async addSourceMapWithStringTracker(fromMap: RawSourceMap, track: StringTracker, text: string) {
        if (!this.debug)
            return this.addText(text);

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

        this.addText(text);
    }

    createDataWithMap() {
        if (!this.debug)
            return this.storeString;

        return this.storeString + this.mapAsURLComment();
    }
}