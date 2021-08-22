import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';
import { getTypes } from '../../../RunTimeBuild/SearchFileSystem';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any): Promise<BuildInComponent> {

    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);

    let outStyle = SaveServerCode.StartBuild();

    async function importSass(url: string, res: any) {
        const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, url, getTypes.Static[2], 'sass');
        if (!await EasyFs.existsFile(FullPath)) {
            PrintIfNew({
                text: `Sass import not found, on file -> ${pathName}:${BetweenTagData.DefaultInfoText.line}`,
                errorName: 'sass-import-not-found',
                type: 'error'
            });
            res(null);
            return;
        }
        dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs');

        res({
            file: FullPath
        });
    }

    let sassOutput: { expression: sass.SassException, result: sass.Result } = { expression: null, result: null };

    if (language != 'css')
        sassOutput = await new Promise((res: any) => {
            sass.render({
                data: outStyle,
                indentedSyntax: language == 'sass',
                importer(url: string, prev: string, done) {
                    importSass(url, done);
                },
            }, (expression, result) => res({ expression, result }));
        });

    const { expression, result } = sassOutput

    if (expression?.status)
        PrintIfNew({
            text: `${expression.message}, on file -> ${pathName}:${BetweenTagData.getLine(expression.line).DefaultInfoText.line}`,
            errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
            type: expression?.status == 5 ? 'warn' : 'error'
        });


    outStyle = result?.css?.toString() ?? outStyle;

    if (InsertComponent.SomePlugins("MinCss", "MinAll", "MinSass")) 
        outStyle = MinCss(outStyle);
    else 
        outStyle = `\n${outStyle}\n`;
    
    const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));

    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${reStoreData}</style>`
    };
}