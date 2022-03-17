import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import sass from 'sass';
import { pathToFileURL } from "url";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import EasyFs from '../../../OutputInput/EasyFs';
import { CreateFilePath } from '../../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import MinCss from '../../../CompileCode/CssMinimizer';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';
import { getTypes } from '../../../RunTimeBuild/SearchFileSystem';
import { compileSass } from './sass';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any): Promise<BuildInComponent> {

    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);

    //eslint-disable-next-line 
    let { outStyle, compressed } = await compileSass(language, BetweenTagData, dependenceObject, InsertComponent, isDebug, await SaveServerCode.StartBuild());

    if (!compressed)
        outStyle = `\n${outStyle}\n`;

    const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));

    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${reStoreData}</style>`
    };
}