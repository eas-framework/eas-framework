import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import { SomePlugins, GetPlugin } from '../../CompileCode/InsertModels.js';
import { transform } from 'sucrase';
import { minify } from "terser";
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import EasyFs from '../../OutputInput/EasyFs.js';
async function BuildScript(inputPath, type, isDebug, moreOptions, haveDifferentSource = true) {
    const AddOptions = {
        transforms: [],
        sourceMapOptions: {
            compiledFilename: inputPath,
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
            sourceMap.sources = sourceMap.sources.map(x => x.split(/\/|\\/).pop() + '?source=true');
            result += "\r\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," +
                Buffer.from(JSON.stringify(sourceMap)).toString("base64");
        }
    }
    catch (err) {
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
export function BuildJS(inStaticPath, isDebug) {
    return BuildScript(inStaticPath, 'js', isDebug, undefined, false);
}
export function BuildTS(inStaticPath, isDebug) {
    return BuildScript(inStaticPath, 'ts', isDebug, { transforms: ['typescript'] });
}
export function BuildJSX(inStaticPath, isDebug) {
    return BuildScript(inStaticPath, 'jsx', isDebug, { ...(GetPlugin("JSXOptions") ?? {}), transforms: ['jsx'] });
}
export function BuildTSX(inStaticPath, isDebug) {
    return BuildScript(inStaticPath, 'tsx', isDebug, { transforms: ['typescript', 'jsx'], ...(GetPlugin("TSXOptions") ?? {}) });
}
//# sourceMappingURL=Script.js.map