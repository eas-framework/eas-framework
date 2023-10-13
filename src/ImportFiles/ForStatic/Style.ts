import * as sass from 'sass';
import EasyFs from '../../OutputInput/EasyFs';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {BasicSettings, getTypes} from '../../RunTimeBuild/SearchFileSystem';
import {createImporter, PrintSassError, sassAndSource, sassStyle, sassSyntax} from '../../BuildInComponents/Components/style/sass';

export async function BuildStyleSass(inputPath: string, type: 'sass' | 'scss' | 'css', isDebug: boolean): Promise<{ [key: string]: number }> {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;

    const dependenceObject = {
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    };

    const fileData = await EasyFs.readFile(fullPath), fileDataDirname = path.dirname(fullPath);

    try {
        const result = await sass.compileStringAsync(fileData, {
            sourceMap: isDebug,
            syntax: sassSyntax(type),
            style: sassStyle(type),
            logger: sass.Logger.silent,
            importer: createImporter(fullPath),
        });

        if (result?.loadedUrls) {
            for (const file of result.loadedUrls) {
                const FullPath = fileURLToPath(<any>file);
                dependenceObject[BasicSettings.relative(FullPath)] = await EasyFs.stat(fullPath, 'mtimeMs', true, null);
            }
        }

        let data = result.css;

        if (isDebug && result.sourceMap) {
            sassAndSource(result.sourceMap, pathToFileURL(fileData).href);
            result.sourceMap.sources = result.sourceMap.sources.map(x => path.relative(fileDataDirname, fileURLToPath(x)) + '?source=true');

            data += `\r\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(result.sourceMap)).toString('base64')}*/`;
        }
        await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
        await EasyFs.writeFile(fullCompilePath, data);
    } catch (err) {
        PrintSassError(err);
        return {};
    }

    return dependenceObject;
}
