import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import EasyFs from '../../OutputInput/EasyFs';
import { CreateFilePath, PathTypes } from './../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../CompileCode/CssMinimizer';
import { EnableGlobalReplace } from '../../CompileCode/JSParser';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any): Promise<BuildInComponent> {
    const lang = dataTag.find(x => x.n.eq == 'lang');

    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);

    let outStyle = SaveServerCode.StartBuild();


    if(['sass', 'scss'].includes(lang?.v?.eq)){
        await new Promise((res: any) => {
            sass.render({
                data: outStyle,
                indentedSyntax: lang?.v?.eq == 'sass',
                importer(url: string, prev: string, done) {
                    const { SmallPath, FullPath } = CreateFilePath(path, LastSmallPath, url, 'Static', 'sass');
    
                    (async () => {
                        if (!await EasyFs.exists(FullPath)) {
                            PrintIfNew({
                                text: `Sass import not found, on file -> ${pathName}:${BetweenTagData.DefaultInfoText.line}`,
                                errorName: 'sass-import-not-found',
                                type: 'error'
                            });
                            done(null);
                            return;
                        }
                        dependenceObject[SmallPath] = await EasyFs.stat(FullPath, 'mtimeMs');
                        done({
                            file: FullPath
                        });
                    })();
    
                },
            }, (expression, result) => {
                if (expression?.status) {
                    PrintIfNew({
                        text: `${expression.message}, on file -> ${pathName}:${BetweenTagData.getLine(expression.line).DefaultInfoText.line}`,
                        errorName: expression?.status == 5 ? 'sass-warning' : 'sass-error',
                        type: expression?.status == 5 ? 'warn' : 'error'
                    });
                }

                outStyle = result?.css?.toString() ?? outStyle;
                res();
            });
        });
    }
    
    if(InsertComponent.SomePlugins("MinCss", "MinAll", "MinSass")){
        outStyle = MinCss(outStyle);
    }else {
        outStyle = `\n${outStyle}\n`;
    }

    dataTag.splice(dataTag.findIndex(x => x.n.eq == 'lang'), 1); // remove lang from tags

    const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));

    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${reStoreData}</style>`
    };
}