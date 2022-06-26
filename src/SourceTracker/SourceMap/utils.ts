import { RawSourceMap, SourceMapConsumer, SourceMapGenerator } from "source-map";

export function toURLComment(stringMap: string, isCss?: boolean) {
    let mapString = `sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(stringMap).toString("base64")}`;

    if (isCss)
        mapString = `/*# ${mapString}*/`
    else
        mapString = '//# ' + mapString;

    return '\r\n' + mapString;
}

export async function mergeSourceMap(generatedMap: RawSourceMap, originalMap: RawSourceMap) {
    const original = await new SourceMapConsumer(originalMap);
    const newMap = new SourceMapGenerator();
    (await new SourceMapConsumer(generatedMap)).eachMapping(m => {
        const location = original.originalPositionFor({line: m.originalLine, column: m.originalColumn})
        if(!location.source) return;
        newMap.addMapping({
            generated: {
                column: m.generatedColumn,
                line: m.generatedLine
            },
            original: {
                column: location.column,
                line: location.line
            },
            source: location.source
        })
    });

    return newMap;
}