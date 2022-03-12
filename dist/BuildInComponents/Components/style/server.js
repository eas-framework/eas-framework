import StringTracker from '../../../EasyDebug/StringTracker.js';
import sass from 'sass';
import { pathToFileURL } from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew.js';
import EasyFs from '../../../OutputInput/EasyFs.js';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import MinCss from '../../../CompileCode/CssMinimizer.js';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser.js';
import { getTypes } from '../../../RunTimeBuild/SearchFileSystem.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent) {
    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);
    let outStyle = await SaveServerCode.StartBuild();
    async function importSass(url) {
        const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, url, getTypes.Static[2], InsertComponent.GetPlugin("sass")?.default ?? language);
        if (!await EasyFs.existsFile(FullPath)) {
            PrintIfNew({
                text: `Sass import not found, on file -> ${pathName}:${BetweenTagData.DefaultInfoText.line}`,
                errorName: 'sass-import-not-found',
                type: 'error'
            });
            return;
        }
        dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs');
        return pathToFileURL(FullPath);
    }
    let result;
    if (language != 'css') {
        try {
            result = await sass.compileStringAsync(outStyle, {
                syntax: language == 'sass' ? 'indented' : 'scss',
                importer: {
                    findFileUrl: importSass
                },
                logger: sass.Logger.silent
            });
        }
        catch (expression) {
            PrintIfNew({
                text: BetweenTagData.debugLine(expression),
                errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
                type: expression?.status == 5 ? 'warn' : 'error'
            });
        }
    }
    outStyle = result?.css ?? outStyle;
    if (InsertComponent.SomePlugins("MinCss", "MinAll", "MinSass"))
        outStyle = MinCss(outStyle);
    else
        outStyle = `\n${outStyle}\n`;
    const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<style${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${reStoreData}</style>`
    };
}
//# sourceMappingURL=server.js.map