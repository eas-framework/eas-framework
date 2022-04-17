import { Warning } from "svelte/types/compiler/interfaces";
import { createNewPrint } from "../../../OutputInput/Logger";
import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from "source-map";
import { print } from "../../../OutputInput/Console";

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
    const [funcName, printText] = createNewPrint({
        errorName: 'svelte-' + code,
        type: 'error',
        text: `${message}\n${frame}<color>${filePath}:${await findLocation.getLocation(start)}`
    });
    print[funcName](printText);
}

export async function PrintSvelteWarn(warnings: Warning[], filePath: string, sourceMap: RawSourceMap) {
    const findLocation = new reLocation(sourceMap);
    for(const { message, code, start, frame } of warnings){
        const [funcName, printText] = createNewPrint({
            errorName: 'svelte-' + code,
            type: 'warn',
            text: `${message}\n${frame}<color>${filePath}:${await findLocation.getLocation(start)}`
        });
        print[funcName](printText);
    }
}