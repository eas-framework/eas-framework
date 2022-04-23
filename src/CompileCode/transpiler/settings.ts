import { Options as TransformOptions, transform, JscConfig } from '@swc/core';
import { StringMap } from '../XMLHelpers/CompileTypes';

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