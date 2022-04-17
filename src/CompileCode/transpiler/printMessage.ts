import { RawSourceMap, SourceMapConsumer } from 'source-map';
import StringTracker from '../../EasyDebug/StringTracker';
import { print } from '../../OutputInput/Console';
import { createNewPrint } from '../../OutputInput/Logger';

export function parseSWCError(err: {message: string, stack: string, code: string}, changeLocations = (line: number, char: number, info: string) => {return {line, char, info}}){
    const splitData:string[] = err.stack.trim().split('\n');
    const errorFileAsIndex = splitData.reverse().findIndex((x:string) => x.includes('//!'))

    if(errorFileAsIndex == -1){
        const message = err.message.replace(/(;[0-9]m)(.*?)\[0m:([0-9]+):([0-9]+)\]/, (_, start, file, g1, g2) => {
            const {line, char, info} = changeLocations(Number(g1), Number(g2), file)
            return `${start}${info}:${line}:${char}]`
        })

        return {
            errorCode: err.code,
            errorLines: splitData[0],
            errorFile: splitData[0],
            simpleMessage: message,
            fullMessage: message
        }
    }

    const errorFile = splitData[errorFileAsIndex].split('//!').pop()
    const errorLines = splitData.slice(splitData.length - errorFileAsIndex, - 3).map(x =>  x.substring(x.indexOf('│')+1)).join('\n');

    let errorCode:string = splitData.at(-2);
    errorCode = errorCode.substring(errorCode.indexOf('`')).split('[0m').shift().trim();

    const dataError = {
        get simpleMessage(){
            return `${dataError.errorCode}, on file -><color>\n${dataError.errorFile}`
        },
        get fullMessage(){
            return `${dataError.simpleMessage}\nLines: ${dataError.errorLines}`
        },
        errorFile,
        errorLines,
        errorCode
    }
    return dataError
}

export function ESBuildPrintError(err: any) {
    const parseError = parseSWCError(err);
    const [funcName, printText] = createNewPrint({
        type: 'error',
        errorName: 'compilation-error',
        text: parseError.fullMessage
    });
    print[funcName](printText);
    return parseError;
}

export async function ESBuildPrintErrorSourceMap(err: any, sourceMap: RawSourceMap, sourceFile?: string) {
    const original = await new SourceMapConsumer(sourceMap);
    
    const parseError = parseSWCError(err, (line, column) => {
        const position = original.originalPositionFor({line, column})
        return {
            line: position.line,
            char: position.column,
            info: sourceFile ?? position.source
        }
    });

    const [funcName, printText] = createNewPrint({
        type: 'error',
        errorName: 'compilation-error',
        text: parseError.fullMessage
    });
    print[funcName](printText);
    return parseError;
}


export function ESBuildPrintErrorStringTracker(base: StringTracker, err: any) {

    const parseError = parseSWCError(err, (line, column, info) => {
        const position = base.originalPositionFor(line, column)
        return <any>{
            ...position,
            info: position.searchLine.extractInfo()
        }
    });

    const [funcName, printText] = createNewPrint({
        type: 'error',
        errorName: 'compilation-error',
        text: parseError.fullMessage
    });
    print[funcName](printText);
    return parseError;
}

