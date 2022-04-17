import { Options as TransformOptions, transform, JscConfig } from '@swc/core';


export const esTarget = 'es2022';

export function Decorators(data: JscConfig){
    data.transform = {
        legacyDecorator: true,
        decoratorMetadata: true
    }
    data.parser.decorators = true
    return data
}

export function TransformJSC(data?: JscConfig): JscConfig{
    return Decorators({
        target: esTarget,
        ...data
    })
}

export function Commonjs(data: TransformOptions){
    data.module = {
        type: 'commonjs',
        strict: false,
        strictMode: false
    }
    return data
}