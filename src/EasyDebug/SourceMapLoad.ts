import StringTracker from "./StringTracker";
import { RawSourceMap, SourceMapConsumer } from "source-map";
import { fileURLToPath } from "url";
import { BasicSettings } from "../RunTimeBuild/SearchFileSystem";

export default async function SourceMapToStringTracker(code: string, sourceMap: string | RawSourceMap) {
    const map = typeof sourceMap == 'string' ? JSON.parse(sourceMap): sourceMap;

    const trackCode = new StringTracker(null, code);
    const splitLines = trackCode.split('\n');
    (await new SourceMapConsumer(map)).eachMapping(m => {
        const isMap = splitLines[m.generatedLine - 1];
        if (!isMap) return;

        let charCount = m.originalColumn || 1;
        for (const i of isMap.substring(m.generatedColumn ? m.generatedColumn - 1: 0, m.name?.length).getDataArray()) {
            i.info = m.source;
            i.line = m.originalLine;
            i.char = charCount++;
        }
    });

    return trackCode;
}

function mergeInfoStringTracker(original: StringTracker, generated: StringTracker) {
    const originalLines = original.split('\n');
    for (const item of generated.getDataArray()) {
        const originalLine = originalLines[item.line - 1]
        const {line, char, info}  = originalLine && originalLine.at(item.char - 1).DefaultInfoText || StringTracker.emptyInfo;
        
        item.char = char;
        item.line = line;
        item.info = info;
    }
}

export async function backToOriginal(original: StringTracker, code: string, sourceMap: string | RawSourceMap) {
    const newTracker = await SourceMapToStringTracker(code, sourceMap);
    mergeInfoStringTracker(original, newTracker);
    return newTracker;
}

function mergeSassInfoStringTracker(original: StringTracker, generated: StringTracker, mySource: string) {
    const originalLines = original.split('\n');
    for (const item of generated.getDataArray()) {
        if(item.info == mySource){
            const {line, char, info} = originalLines[item.line - 1].at(item.char-1)?.DefaultInfoText ?? StringTracker.emptyInfo;
            item.line = line;
            item.info = info;
            item.char = char;
        } else if(item.info) {
            item.info = BasicSettings.relative(fileURLToPath(item.info));
        }
    }
}
export async function backToOriginalSss(original: StringTracker, code: string, sourceMap: string | RawSourceMap, mySource: string) {
    const newTracker = await SourceMapToStringTracker(code, sourceMap);
    mergeSassInfoStringTracker(original, newTracker, mySource);

    return newTracker;
}