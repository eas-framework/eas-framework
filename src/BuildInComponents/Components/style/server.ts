import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import {pathToFileURL} from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';
import { getTypes } from '../../../RunTimeBuild/SearchFileSystem';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any): Promise<BuildInComponent> {

    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);

    let outStyle = await SaveServerCode.StartBuild();

    async function importSass(url: string) {
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

        return pathToFileURL(FullPath)
    }

    let result: sass.CompileResult;

    if (language != 'css') {
        try {
            result = await sass.compileStringAsync(outStyle, {
                syntax: language == 'sass' ? 'indented' : 'scss',
                importer: {
                    findFileUrl: importSass
                }
            });
        } catch (expression) {
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
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${reStoreData}</style>`
    };
}