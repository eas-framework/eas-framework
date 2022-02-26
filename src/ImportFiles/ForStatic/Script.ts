import { PrintIfNew } from '../../OutputInput/PrintNew';
import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels';
import { Options as TransformOptions, transform } from 'sucrase';
import { minify } from "terser";
import { getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';

async function BuildScript(inputPath: string, type: string, isDebug: boolean, moreOptions?: TransformOptions, haveDifferentSource = true) {
    const AddOptions: TransformOptions = {
        transforms: [],
        sourceMapOptions: {
            compiledFilename: '/' + inputPath,
        },
        filePath: inputPath,
        ...GetPlugin("transformOptions"), ...moreOptions
    };

    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
    let result = await EasyFs.readFile(fullPath);

    try {
        const { code, sourceMap } = transform(result, AddOptions);
        result = code;

        if (isDebug && haveDifferentSource) {
            sourceMap.sources = sourceMap.sources.map(x => x.split(/\/|\\/).pop() +  '?source=true');

            result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," +
                Buffer.from(JSON.stringify(sourceMap)).toString("base64");
        }
    } catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: `${err.message}, on file -> ${fullPath}:${err?.loc?.line ?? 0}:${err?.loc?.column ?? 0}`
        });
    }

    const minit = SomePlugins("Min" + type.toUpperCase()) || SomePlugins("MinAll");

    if (minit) {
        result = (await minify(result, { module: false })).code;
    }

    await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
    await EasyFs.writeFile(fullCompilePath, result);

    return { 
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
}

export function BuildJS(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'js', isDebug, undefined, false);
}

export function BuildTS(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'ts', isDebug, { transforms: ['typescript'] });
}

export function BuildJSX(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'jsx', isDebug, { ...(GetPlugin("JSXOptions") ?? {}), transforms: ['jsx'] });
}

export function BuildTSX(inStaticPath: string, isDebug: boolean) {
    return BuildScript(inStaticPath, 'tsx', isDebug, { transforms: ['typescript', 'jsx'], ...(GetPlugin("TSXOptions") ?? {}) });
}
