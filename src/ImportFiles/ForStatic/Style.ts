import sass from 'sass';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import EasyFs from '../../OutputInput/EasyFs';
import { SomePlugins } from '../../CompileCode/InsertModels';
import path from 'path';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';

export async function BuildStyleSass(inputPath: string, type: "sass" | "scss" | "css", isDebug: boolean): Promise<{ [key: string]: number }> {
    const fullPath = getTypes.Static[0] + inputPath, fullCompilePath = getTypes.Static[1] + inputPath;

    const outputStyle = (['sass', 'scss'].includes(type) ? SomePlugins("MinSass", "MinAll") : SomePlugins("MinCss", "MinAll")) ? 'compressed' : 'expanded';

    const dependenceObject = {
        thisFile: await EasyFs.stat(fullPath, 'mtimeMs')
    }

    const pathDir = path.dirname(fullPath);

    async function importSass(url: string, done: any) {
        let connectUrl = path.join(pathDir, url);

        if (!path.extname(url)) {
            connectUrl += '.' + type;
        }

        if (!await EasyFs.existsFile(connectUrl)) {
            PrintIfNew({
                text: `Sass import not found, on file -> ${url} at ${inputPath}`,
                errorName: 'sass-import-not-found',
                type: 'error'
            });
            done(null);
            return;
        }
        dependenceObject[path.relative(BasicSettings.fullWebSitePath, connectUrl)] = await EasyFs.stat(connectUrl, 'mtimeMs');

        done({
            file: connectUrl
        });
    }

    const fileData = await EasyFs.readFile(fullPath);

    return await new Promise((res: any) => {
        sass.render({
            sourceMap: isDebug,
            data: fileData,
            indentedSyntax: type == 'sass',
            outputStyle,
            importer(url: string, prev: string, done) {
                importSass(url, done);
            },
        }, async (expression, result) => {
            if (expression?.status) {
                PrintIfNew({
                    text: `${expression.message}, on file -> ${inputPath}${expression.line ? ':' + expression.line : ''}`,
                    errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
                    type: expression?.status == 5 ? 'warn' : 'error'
                });
            }
            if (result?.css) {
                let data = result.css.toString();

                if (isDebug && result.map) {
                    const map = JSON.parse(result.map.toString());
                    map.sources = map.sources.map(x => x.split(/\/|\\/).pop() + '?source=true');

                    data += `\r\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(map)).toString("base64")}*/`;
                }
                await EasyFs.makePathReal(inputPath, getTypes.Static[1]);
                await EasyFs.writeFile(fullCompilePath, data);
            }

            res(dependenceObject);
        });
    });
}