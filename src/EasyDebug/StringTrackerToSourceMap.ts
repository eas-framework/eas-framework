import StringTracker from '../EasyDebug/StringTracker';
import { SourceMapBasic } from '../EasyDebug/SourceMapStore';

class createPageSourceMap extends SourceMapBasic {
    constructor(filePath: string, httpSource = false, relative = false) {
        super(filePath, httpSource, relative);
        this.lineCount = 1;
    }

    addMappingFromTrack(track: StringTracker) {
        const DataArray = track.getDataArray(), length = DataArray.length;
        let waitNextLine = true;

        for (let index = 0; index < length; index++) {
            const { text, line, info } = DataArray[index];

            if (text == '\n') {
                this.lineCount++;
                waitNextLine = false;
                continue;
            }

            if (!waitNextLine && line && info && text.trim()) {
                waitNextLine = true;
                this.map.addMapping({
                    original: { line, column: 0 },
                    generated: { line: this.lineCount, column: 0 },
                    source: this.getSource(info)
                });
            }
        }

    }
}

export function outputMap(text: StringTracker, filePath: string, httpSource?: boolean, relative?: boolean){
    const storeMap = new createPageSourceMap(filePath, httpSource, relative);
    storeMap.addMappingFromTrack(text);

    return storeMap.getRowSourceMap();
}

export function outputWithMap(text: StringTracker, filePath: string){
    const storeMap = new createPageSourceMap(filePath);
    storeMap.addMappingFromTrack(text);

    return text.eq + storeMap.mapAsURLComment();
}