import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels';
import { Options as TransformOptions, transform, ParserConfig } from '@swc/core';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import { ESBuildPrintError } from '../../CompileCode/transpiler/printMessage';
import { esTarget, TransformJSC } from '../../CompileCode/transpiler/settings';

async function BuildScript(inputPath: string, type: string, isDebug: boolean, parser?: ParserConfig, optionsName?: string) {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
    const AddOptions: TransformOptions = {
        filename: fullPath,
        sourceFileName: inputPath + '?source=true',
        jsc: TransformJSC({
            parser: {
                ...parser,
                ...GetPlugin("transformOptions"),
                ...GetPlugin(optionsName)
            }
        }),
        minify: SomePlugins("Min" + type.toUpperCase()) || SomePlugins("MinAll"),
        sourceMaps: isDebug ? 'inline' : false
    };

    let result = await EasyFs.readFile(fullPath);

    try {
        result = (await transform(result, AddOptions)).code;
    } catch (err) {
        ESBuildPrintError(err);
    }

    await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath, result);

    return {
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}

export function BuildJS(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'js', isDebug);
}

export function BuildTS(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'ts', isDebug, { syntax: 'typescript', decorators: true });
}

export function BuildJSX(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'jsx', isDebug, { syntax: 'ecmascript', jsx: true }, 'JSXOptions');
}

export function BuildTSX(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'tsx', isDebug, { syntax: 'typescript', tsx: true, decorators: true, }, 'TSXOptions');
}
