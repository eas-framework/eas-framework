import StringTracker from '../../EasyDebug/StringTracker.js';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs.js';
import { BasicSettings } from '../../RunTimeBuild/SearchFileSystem.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, buildScript, sessionInfo) {
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<head${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)}<%!@DefaultInsertBundle%></head>`,
        checkComponents: false
    };
}
export async function addFinalizeBuild(pageData, sessionInfo, fullCompilePath) {
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
    if (!buildBundleString) { // there isn't any bundle
        pageData = pageData.replace(/@DefaultInsertBundle(;?)/, '');
        return pageData.replace(/@InsertBundle(;?)/, '');
    }
    const replaceWith = new StringTracker(null, `out_run_script.text+= \`${buildBundleString}\``); // add bundle to page
    let hadFound = false;
    pageData = pageData.replacer(/@InsertBundle(;?)/, () => {
        hadFound = true;
        return replaceWith;
    });
    if (!hadFound)
        pageData = pageData.replace(/@DefaultInsertBundle(;?)/, replaceWith);
    else
        pageData = pageData.replace(/@DefaultInsertBundle(;?)/, '');
    return pageData;
}
//# sourceMappingURL=head.js.map