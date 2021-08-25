import StringTracker from '../../EasyDebug/StringTracker.js';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs.js';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import Base64Id from '../../StringMethods/Id.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, buildScript, sessionInfo) {
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<head${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)}<%!@DefaultInsertBundle%></head>`,
        checkComponents: false
    };
}
function makeName(fullCompilePath) {
    let name = fullCompilePath.split(/\/|\\/).pop().split('.' + BasicSettings.pageTypes.page).shift(); // create name
    name += '-' + Base64Id(name, 5) + '.pub';
    return [name, path.join(fullCompilePath, '../' + name)];
}
function addStyle(sessionInfo, compilePath, name) {
    if (sessionInfo.style.notEmpty()) { // add style
        sessionInfo.styleURLSet.push({ url: `./${name}.css` });
        EasyFs.writeFile(compilePath + '.css', sessionInfo.style.createDataWithMap());
    }
}
function addHTMLTags(sessionInfo) {
    const makeAttributes = (i) => i.attributes ? ' ' + Object.keys(i.attributes).map(x => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(' ') : '';
    const addTypeInfo = sessionInfo.typeName == getTypes.Logs[2] ? '?t=l' : '';
    let buildBundleString = ''; // add scripts add css
    for (const i of sessionInfo.styleURLSet)
        buildBundleString += `<link rel="stylesheet" href="${i.url + addTypeInfo}"${makeAttributes(i)}/>`;
    for (const i of sessionInfo.scriptURLSet)
        buildBundleString += `<script src="${i.url + addTypeInfo}"${makeAttributes(i)}></script>`;
    return buildBundleString + sessionInfo.headHTML;
}
function addScript(sessionInfo, compilePath, name) {
    if (sessionInfo.script.notEmpty()) { // add default script
        sessionInfo.scriptURLSet.push({ url: `./${name}.js`, attributes: { defer: null } });
        EasyFs.writeFile(compilePath + '.js', sessionInfo.script.createDataWithMap());
    }
    if (sessionInfo.scriptModule.notEmpty()) {
        sessionInfo.scriptURLSet.push({ url: `./${name}.module.js`, attributes: { type: 'module' } });
        EasyFs.writeFile(compilePath + '.module.js', sessionInfo.scriptModule.createDataWithMap());
    }
}
export async function addFinalizeBuild(pageData, sessionInfo, fullCompilePath) {
    const [name, compilePath] = makeName(fullCompilePath);
    addStyle(sessionInfo, compilePath, name);
    addScript(sessionInfo, compilePath, name);
    const buildBundleString = addHTMLTags(sessionInfo);
    const bundlePlaceholder = [/@InsertBundle(;?)/, /@DefaultInsertBundle(;?)/];
    const removeBundle = () => { bundlePlaceholder.forEach(x => pageData = pageData.replace(x, '')); return pageData; };
    if (!buildBundleString) // there isn't anything to bundle
        return removeBundle();
    const replaceWith = new StringTracker(null, `out_run_script.text+= \`${buildBundleString}\``); // add bundle to page
    let bundleSucceed = false;
    for (let i = 0; i < bundlePlaceholder.length && !bundleSucceed; i++)
        pageData = pageData.replacer(bundlePlaceholder[i], () => (bundleSucceed = true) && replaceWith);
    if (bundleSucceed)
        return removeBundle();
    return pageData.Plus(replaceWith);
}
