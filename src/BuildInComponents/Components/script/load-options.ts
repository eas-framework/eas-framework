import { Options as TransformOptions, transform, JscConfig } from '@swc/core';
import { GetPlugin, SomePlugins } from '../../../CompileCode/InsertModels';
import { SessionBuild } from '../../../CompileCode/Session';
import { ESBuildPrintErrorStringTracker } from '../../../CompileCode/transpiler/printMessage';
import { Commonjs, Decorators, esTarget } from '../../../CompileCode/transpiler/settings';
import StringTracker from '../../../EasyDebug/StringTracker';

export async function transpilerWithOptions(BetweenTagData: StringTracker, language: string, sourceMaps: boolean, BetweenTagDataString = BetweenTagData.eq, options?: JscConfig) {

    let resultCode = '', resultMap: string;

    const AddOptions: TransformOptions = Commonjs({
        filename: BetweenTagData.extractInfo(),
        minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
        sourceMaps,
        jsc: {
            target: esTarget,
            ...options
        },
        ...GetPlugin("transformOptions")
    });

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
        ESBuildPrintErrorStringTracker(BetweenTagData, err)
    }

    return { resultCode, resultMap }
}