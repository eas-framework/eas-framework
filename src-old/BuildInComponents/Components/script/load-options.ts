import { Options as TransformOptions, transform, JscConfig } from '@swc/core';
import { GetPlugin, SomePlugins } from '../../../CompileCode/InsertModels';
import { ESBuildPrintErrorStringTracker } from '../../../CompileCode/transpiler/printMessage';
import { Decorators, TransformJSC } from '../../../CompileCode/transpiler/settings';
import StringTracker from '../../../EasyDebug/StringTracker';

export async function transpilerWithOptions(BetweenTagData: StringTracker, language: string, sourceMaps: boolean, isDebug: boolean, BetweenTagDataString = BetweenTagData.eq, options?: JscConfig) {

    let resultCode = '', resultMap: string;

    const AddOptions: TransformOptions = {
        filename: BetweenTagData.extractInfo(),
        minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
        sourceMaps,
        jsc: TransformJSC({
            ...options
        }, {__DEBUG__: '' + isDebug}),
        ...GetPlugin("transformOptions")
    };

    try {
        switch (language) {
            case 'ts':
                Decorators(AddOptions.jsc).parser = {
                    syntax: 'typescript',
                    ...GetPlugin("TSOptions")
                }
                
                break;

            case 'jsx':
                AddOptions.jsc.parser = {
                    syntax: 'ecmascript',
                    jsx: true,
                    ...GetPlugin("JSXOptions")
                }
                break;

            case 'tsx':
                Decorators(AddOptions.jsc).parser = {
                    syntax: 'ecmascript',
                    jsx: true,
                    ...GetPlugin("TSXOptions")
                }
                break;
        }

        const { map, code } = await transform(BetweenTagDataString, AddOptions);

        resultCode = code;
        resultMap = map;
    } catch (err) {
        ESBuildPrintErrorStringTracker(BetweenTagData, err, BetweenTagData.extractInfo())
    }

    return { resultCode, resultMap }
}