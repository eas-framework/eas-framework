import path from "node:path";
import { SourceMapGenerator } from "source-map";
import PPath from "../../Settings/PPath";
import StringTracker from "../StringTracker/StringTracker";
import SourceComputeTrack from "./SourceComputeTrack";

function STToSourceMap(st: StringTracker, file: PPath) {
    const map = new SourceMapGenerator({
        file: file.name
    });

    let line = 1, column = 1;

    const chars = st.getChars();
    for(let i = 0; i < chars.length; i++) {
        const {stack, char} = chars[i]
        const info = stack.top()

        if(char == '\n') {
            line++;
            column = 1;
        }

        if(info && char.trim()){
            map.addMapping({
                original: { line: info.line, column: info.column },
                generated: { line, column },
                source: info.source.small
            });
        }

        column++
    }

    return map
}

export default function STToSourceMapCompute(st: StringTracker, file: PPath) {
    const map = STToSourceMap(st, file)
    return new SourceComputeTrack(st.eq, map.toJSON())
}