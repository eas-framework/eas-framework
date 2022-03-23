import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels';
import { TransformOptions, transform } from 'esbuild-wasm';
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import { ESBuildPrintError, ESBuildPrintWarnings } from '../../CompileCode/esbuild/printMessage';

async function BuildScript(inputPath: string, type: string, isDebug: boolean, moreOptions?: TransformOptions) {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
    const AddOptions: TransformOptions = {
        sourcefile: inputPath + '?source=true',
        sourcemap: isDebug ? 'inline': false,
        minify: SomePlugins("Min" + type.toUpperCase()) || SomePlugins("MinAll"),
        ...GetPlugin("transformOptions"), ...moreOptions
    };

    let result = await EasyFs.readFile(fullPath);

    try {
        const { code, warnings } = await transform(result, AddOptions);
        result = code;
        ESBuildPrintWarnings(fullPath, warnings);
    } catch (err) {
        ESBuildPrintError(fullPath, err);
    }

    await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath, result);

    return {
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}

export function BuildJS(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'js', isDebug, undefined);
}

export function BuildTS(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'ts', isDebug, { loader: 'ts' });
}

export function BuildJSX(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'jsx', isDebug, { ...(GetPlugin("JSXOptions") ?? {}), loader: 'jsx' });
}

export function BuildTSX(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'tsx', isDebug, { loader: 'tsx', ...(GetPlugin("TSXOptions") ?? {}) });
}
