import sass from 'sass';
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import EasyFs from '../../OutputInput/EasyFs.js';
import { SomePlugins } from '../../CompileCode/InsertModels.js';
import path from 'path';
import { fileURLToPath, pathToFileURL } from "url";
import { getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import { createImporter, sassAndSource, sassStyle, sassSyntax } from '../../BuildInComponents/Components/style/sass.js';
export async function BuildStyleSass(inputPath, type, isDebug) {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;
    const dependenceObject = {
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };
    const fileData = await EasyFs.readFile(fullPath), fileDataDirname = path.dirname(fullPath);
    try {
        const result = await sass.compileStringAsync(fileData, {
            sourceMap: isDebug,
            syntax: sassSyntax(type),
            style: sassStyle(type, SomePlugins),
            logger: sass.Logger.silent,
            importer: createImporter(fullPath),
        });
        let data = result.css;
        if (isDebug && result.sourceMap) {
            sassAndSource(result.sourceMap, pathToFileURL(fileData).href);
            result.sourceMap.sources = result.sourceMap.sources.map(x => path.relative(fileDataDirname, fileURLToPath(x)) + '?source=true');
            data += `\r\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(result.sourceMap)).toString("base64")}*/`;
        }
        await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
        await EasyFs.writeFile(fullCompilePath, data);
    }
    catch (expression) {
        PrintIfNew({
            text: `${expression.message}, on file -> ${fullPath}${expression.line ? ':' + expression.line : ''}`,
            errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
            type: expression?.status == 5 ? 'warn' : 'error'
        });
    }
    return dependenceObject;
}
//# sourceMappingURL=Style.js.map