import StringTracker from './StringTracker';
import { SourceMapGenerator, RawSourceMap, SourceMapConsumer } from "source-map-js";
import path from 'path';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';

export default class SourceMapStore {
    private storeString = '';
    private map: SourceMapGenerator;
    private lineCount = 0;

    constructor(private filePath: string, private debug: boolean, private isCss = false) {

        const name = filePath.split(/\/|\\/).pop();
        this.map = new SourceMapGenerator({
            file: name
        });
    }

    notEmpty() {
        return Boolean(this.storeString);
    }

    private getSource(source: string) {
        let name = path.relative(BasicSettings.fullWebSitePath, source.split('<line>').pop());

        if (BasicSettings.pageTypesArray.includes(path.extname(name).substring(1)))
            name += '.source';
        else 
            name += '?source=true';
        

        return name;
    }

    addStringTracker(track: StringTracker, text = track.eq) {
        if (!this.debug)
            return this.addText(text);

        const DataArray = track.getDataArray(), length = DataArray.length;

        for (let index = 0, element = DataArray[index]; index < length; index++, element = DataArray[index]) {

            if (element.text == '\n') {
                this.lineCount++;
                continue;
            }

            const { line, info } = element;

            if (line && info) {
                this.map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: this.lineCount + 1, column: 0 },
                    source: this.getSource(element.info)
                });
            }
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

        let mapString = `sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(this.map.toString()).toString("base64")}`;

        if (this.isCss)
            mapString = `/*# ${mapString}*/`
        else
            mapString = '//# ' + mapString;

        return this.storeString + '\r\n' + mapString;
    }
}