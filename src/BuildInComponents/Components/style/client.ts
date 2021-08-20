import StringTracker from '../../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { StringAnyMap } from '../../../CompileCode/XMLHelpers/CompileTypes';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent> {

    let outStyle = BetweenTagData.eq;

    async function importSass(url: string, res: any) {
        const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, url, 'Static', 'sass');
        if (!await EasyFs.exists(FullPath)) {
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

    const { expression, result } = sassOutput;

    if (expression?.status)
        PrintIfNew({
            text: `${expression.message}, on file -> ${pathName}:${BetweenTagData.getLine(expression.line).DefaultInfoText.line}`,
            errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
            type: expression?.status == 5 ? 'warn' : 'error'
        });


    outStyle = result?.css?.toString() ?? outStyle;

    if (InsertComponent.SomePlugins("MinCss", "MinAll", "MinSass"))
        outStyle = MinCss(outStyle);

    sessionInfo.style += outStyle;

    return {
        compiledString: new StringTracker()
    };
}