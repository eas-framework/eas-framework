import StringTracker from '../../../EasyDebug/StringTracker.js';
import sass from 'sass';
import { PrintIfNew } from '../../../OutputInput/PrintNew.js';
import EasyFs from '../../../OutputInput/EasyFs.js';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug.js';
import MinCss from '../../../CompileCode/CssMinimizer.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    let outStyle = BetweenTagData.eq;
    async function importSass(url, res) {
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
    let sassOutput = { expression: null, result: null };
    if (language != 'css')
        sassOutput = await new Promise((res) => {
            sass.render({
                sourceMap: isDebug,
                data: outStyle,
                indentedSyntax: language == 'sass',
                importer(url, prev, done) {
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
    if (result?.map)
        sessionInfo.style.addSourceMapWithStringTracker(JSON.parse(result.map.toString()), BetweenTagData, outStyle);
    else
        sessionInfo.style.addStringTracker(BetweenTagData, outStyle);
    return {
        compiledString: new StringTracker()
    };
}
//# sourceMappingURL=client.js.map