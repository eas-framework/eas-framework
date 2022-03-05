import StringTracker from "./StringTracker.js";
import { SourceMapConsumer } from "source-map-js";
export default function inlineMapToStringTracker(string) {
    const [code, mapBase64] = string.split('//#sourceMappingURL=data:application/json;charset=utf-8;base64,');
    const map = JSON.parse(Buffer.from(mapBase64, 'base64').toString());
    const trackCode = new StringTracker(null, code);
    const splitLines = trackCode.split('\n');
    new SourceMapConsumer(map).eachMapping(m => {
        const isMap = splitLines[m.generatedLine - 1];
        if (!isMap)
            return;
        let charCount = 1;
        for (const i of isMap.substring(m.generatedColumn - 1).getDataArray()) {
            i.info = m.source;
            i.line = m.originalLine;
            i.char = charCount++;
        }
    });
    return trackCode;
}
//# sourceMappingURL=SourceMapLoad.js.map