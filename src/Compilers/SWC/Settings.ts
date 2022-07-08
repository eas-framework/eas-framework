import { Options as TransformOptions, transform, JscConfig } from '@swc/core';
import { GlobalSettings } from '../../Settings/GlobalSettings';
import { StringMap } from '../../Settings/types';
import { getPlugin } from '../../Settings/utils';

export const esTarget = 'es2022';

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

    return Decorators({
        target: esTarget,
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