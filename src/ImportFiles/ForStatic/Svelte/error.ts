import { Warning } from "svelte/types/compiler/interfaces";
import { PrintIfNew } from "../../../OutputInput/PrintNew";
import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from "source-map";

class reLocation {
    map: Promise<SourceMapConsumer>
    constructor(sourceMap: RawSourceMap){
        this.map = new SourceMapConsumer(sourceMap)
    }

    async getLocation(location: {line: number, column: number}){
        const {line, column} = (await this.map).originalPositionFor(location)
        return `${line}:${column}`;
    }
}

export async function PrintSvelteError({ message, code, start, frame }: Warning, filePath: string, sourceMap: RawSourceMap) {
    const findLocation = new reLocation(sourceMap)
    PrintIfNew({
        errorName: 'svelte-' + code,
        type: 'error',
        text: `${message}\n${frame}\n${filePath}:${await findLocation.getLocation(start)}`
    });
}

export async function PrintSvelteWarn(warnings: Warning[], filePath: string, sourceMap: RawSourceMap) {
    const findLocation = new reLocation(sourceMap);
    for(const { message, code, start, frame } of warnings){
        PrintIfNew({
            errorName: 'svelte-' + code,
            type: 'warn',
            text: `${message}\n${frame}\n${filePath}:${await findLocation.getLocation(start)}`
        });
    }
}