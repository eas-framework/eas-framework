import {RawSourceMap, SourceMapConsumer} from "source-map";
import {fileURLToPath} from "node:url";
import PPath from "../../Settings/PPath.js";
import StringTracker from "../StringTracker/StringTracker.js";
import STSInfo from "../StringTracker/STSInfo.js";
import StringTrackerStack, {EMPTY_STACK} from '../StringTracker/StringTrackerStack.js';

export default async function SourceMapToStringTracker(code: string, sourceMap: string | RawSourceMap) {
    const map = typeof sourceMap == 'string' ? JSON.parse(sourceMap) : sourceMap;

    const trackCode = new StringTracker(code);
    const splitLines = trackCode.split('\n');
    (await new SourceMapConsumer(map)).eachMapping(m => {
        const isMap = splitLines[m.generatedLine - 1];
        if (!isMap) return;

        let charCount = m.originalColumn || 1;
        for (const stChar of isMap.slice(m.generatedColumn ? m.generatedColumn - 1 : 0, m.name?.length).getChars()) {
            stChar.stack = new StringTrackerStack([
                new STSInfo(
                    new PPath(m.source),
                    m.originalLine,
                    charCount++
                )
            ]);
        }
    });

    return trackCode;
}

function mergeInfoStringTracker(original: StringTracker, generated: StringTracker) {
    const originalLines = original.split('\n');
    for (const aboutChar of generated.getChars()) {
        const topInfo = aboutChar.stack.top();
        if (!topInfo) {
            continue;
        }

        const originalLine = originalLines[topInfo.line - 1];
        aboutChar.stack = originalLine.atStack(topInfo.column - 1) ?? EMPTY_STACK;
    }
}

export async function backToOriginal(original: StringTracker, code: string, sourceMap: string | RawSourceMap) {
    const newTracker = await SourceMapToStringTracker(code, sourceMap);
    mergeInfoStringTracker(original, newTracker);
    return newTracker;
}

function mergeSassInfoStringTracker(original: StringTracker, generated: StringTracker, mySource: string) {
    const originalLines = original.split('\n');
    for (const aboutChar of generated.getChars()) {
        const topInfo = aboutChar.stack.top();

        if (topInfo?.source.small == mySource) {
            const originalLine = originalLines[topInfo.line - 1];
            aboutChar.stack = originalLine.atStack(topInfo.column - 1);
        } else if (topInfo) {
            topInfo.source = PPath.fromFull(fileURLToPath(topInfo.source.small));
        }
    }
}

export async function backToOriginalSss(original: StringTracker, code: string, sourceMap: string | RawSourceMap, mySource: string) {
    const newTracker = await SourceMapToStringTracker(code, sourceMap);
    mergeSassInfoStringTracker(original, newTracker, mySource);

    return newTracker;
}