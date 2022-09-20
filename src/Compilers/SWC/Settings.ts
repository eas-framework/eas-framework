import { Options as TransformOptions, transform, JscConfig, EsParserConfig } from '@swc/core';
import { GlobalSettings } from '../../Settings/GlobalSettings.js';
import { StringMap } from '../../Settings/types.js';
import { getPlugin } from '../../Settings/utils.js';

export const ES_TARGET = 'es2022';
export const TRANSFORM_MODULE = {
    module: {
        type: 'es6'
    }
}


export function Decorators(data: JscConfig) {
    if (data.parser?.syntax != 'typescript')
        return data;

    data.transform ??= {};
    data.transform.decoratorMetadata = true

    data.parser.decorators = true
    return data
}

export function TransformJSCVars(vars?: StringMap, simplify = false) {
    return {
        transform: {
            optimizer: {
                simplify,
                globals: {
                    vars
                }
            }
        }
    }
}

export function TransformJSC(data?: JscConfig, vars?: StringMap, simplify?: boolean): JscConfig {
    Object.assign(data, TransformJSCVars(vars ?? {}, simplify))

    const parser = <EsParserConfig>(data.parser ??= <any>{})
    parser.importAssertions = true

    return Decorators({
        target: ES_TARGET,
        ...data
    })
}

export function GetScriptSettings(isTypescript: boolean) {
    return {
        syntax: isTypescript ? 'typescript' : 'ecmascript',
        ...getPlugin((isTypescript ? 'TS' : 'JS') + "Options")
    }
}

export function defaultVariables(){
    return {
        __DEBUG__: '' + GlobalSettings.development,
        ...GlobalSettings.compile.globals
    }
}