import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent, StringAnyMap, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs';
import { BasicSettings } from '../../RunTimeBuild/SearchFileSystem';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, buildScript: BuildScriptWithoutModule, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)
            }<%!@DefaultInsertBundle%></head>`,
        checkComponents: false
    }
}

export async function addFinalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap, fullCompilePath: string) {
    let name = fullCompilePath.split(/\/|\\/).pop().split('.' + BasicSettings.pageTypes.page).shift();
    name += '-' + Buffer.from(name).toString('base64').substring(0, 5) + '.pub';

    const compilePath = path.join(fullCompilePath, '../' + name);

    if (sessionInfo.style) {
        sessionInfo.styleURLSet.add(`./${name}.css`);
        EasyFs.writeFile(compilePath + '.css', sessionInfo.style);
    }

    let buildBundleString = '';
    for (const i of sessionInfo.styleURLSet)
        buildBundleString += `<link rel="stylesheet" href="${i}" />`;
    for (const i of sessionInfo.scriptURLSet)
        buildBundleString += `<script type="text/javascript" src="${i}" async></script>`;


    if (sessionInfo.script) {
        buildBundleString += `<script type="text/javascript" src="./${name}.js" defer></script>`;
        EasyFs.writeFile(compilePath + '.js', sessionInfo.script);
    }

    if(!buildBundleString){ // there isn't any bundle
        pageData = pageData.replace(/@DefaultInsertBundle(;?)/, '');
        return pageData.replace(/@InsertBundle(;?)/, '');
    }

    const replaceWith = new StringTracker(null, `out_run_script.text+= \`${buildBundleString}\``); // add bundle to page
    let hadFound = false;

    pageData = pageData.replacer(/@InsertBundle(;?)/, () => {
        hadFound = true;
        return replaceWith
    });

    if (!hadFound)
        pageData = pageData.replace(/@DefaultInsertBundle(;?)/, replaceWith);
    else
        pageData = pageData.replace(/@DefaultInsertBundle(;?)/, '');

    return pageData;
}