import StringTracker from "./StringTracker";
import { SourceMapConsumer } from "source-map-js";

export default function SourceMapToStringTracker(code: string, sourceMap: string) {
    const map = JSON.parse(sourceMap);

    const trackCode = new StringTracker(null, code);
    const splitLines = trackCode.split('\n');
    new SourceMapConsumer(map).eachMapping(m => {
        const isMap = splitLines[m.generatedLine - 1];
        if (!isMap) return;


        let charCount = 1;
        for (const i of isMap.substring(m.generatedColumn - 1).getDataArray()) {
            i.info = m.source;
            i.line = m.originalLine;
            i.char = charCount++;
        }
    });

    return trackCode;
}

export function mergeInfoStringTracker(original: StringTracker, generated: StringTracker) {
    const originalLines = original.split('\n');
    for (const item of generated.getDataArray()) {
        const {line, char, info}  = originalLines[item.line - 1].DefaultInfoText ?? StringTracker.emptyInfo;
        item.line = line;
        item.info = info;
        item.char = char;
    }
}

export function backToOriginal(original: StringTracker, code: string, sourceMap: string) {
    const newTracker = SourceMapToStringTracker(code, sourceMap);
    mergeInfoStringTracker(original, newTracker);

    return newTracker;
}