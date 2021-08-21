import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, setDataHTMLTag, BuildInComponent, SessionInfo, BuildScriptWithoutModule } from '../../CompileCode/XMLHelpers/CompileTypes';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs';
import { BasicSettings } from '../../RunTimeBuild/SearchFileSystem';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, buildScript: BuildScriptWithoutModule, sessionInfo: SessionInfo): Promise<BuildInComponent> {
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)
            }<%!@DefaultInsertBundle%></head>`,
        checkComponents: false
    }
}

function makeName(fullCompilePath: string) {
    let name = fullCompilePath.split(/\/|\\/).pop().split('.' + BasicSettings.pageTypes.page).shift(); // create name
    name += '-' + Buffer.from(name).toString('base64').substring(0, 5) + '.pub';

    return [name, path.join(fullCompilePath, '../' + name)];
}

function addStyle(sessionInfo: SessionInfo, compilePath: string, name: string) {
    if (sessionInfo.style.notEmpty()) { // add style
        sessionInfo.styleURLSet.push({ url: `./${name}.css` });
        EasyFs.writeFile(compilePath + '.css', sessionInfo.style.createDataWithMap());
    }
}

function addHTMLTags(sessionInfo: SessionInfo) {

    const makeAttributes = (i: setDataHTMLTag) => i.attributes ? ' ' + Object.keys(i.attributes).map(x => i.attributes[x] ? x + `="${i.attributes[x]}"` : x).join(' ') : '';

    let buildBundleString = ''; // add scripts add css
    for (const i of sessionInfo.styleURLSet)
        buildBundleString += `<link rel="stylesheet" href="${i.url}"${makeAttributes(i)}/>`;
    for (const i of sessionInfo.scriptURLSet)
        buildBundleString += `<script type="text/javascript" src="${i.url}"${makeAttributes(i)}></script>`;

    return buildBundleString;
}

function addScript(sessionInfo: SessionInfo, compilePath: string, name: string) {
    if (sessionInfo.script.notEmpty()) { // add default script
        sessionInfo.scriptURLSet.push({ url: `./${name}.js`, attributes: {defer: null} });
        EasyFs.writeFile(compilePath + '.js', sessionInfo.script.createDataWithMap());
    }

    if (sessionInfo.scriptModule.notEmpty()) {
        sessionInfo.scriptURLSet.push({ url: `./${name}.module.js`, attributes: {type: 'module'} });
        EasyFs.writeFile(compilePath + '.module.js', sessionInfo.scriptModule.createDataWithMap());
    }
}

export async function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionInfo, fullCompilePath: string) {
    const [name, compilePath] = makeName(fullCompilePath);

    addStyle(sessionInfo, compilePath, name);
    addScript(sessionInfo, compilePath, name);
    const buildBundleString = addHTMLTags(sessionInfo);

    const bundlePlaceholder = [/@InsertBundle(;?)/, /@DefaultInsertBundle(;?)/];
    const removeBundle = () => {bundlePlaceholder.forEach(x => pageData = pageData.replace(x, '')); return pageData};


    if (!buildBundleString)  // there isn't anything to bundle
        return removeBundle();

    const replaceWith = new StringTracker(null, `out_run_script.text+= \`${buildBundleString}\``); // add bundle to page
    let bundleSucceed = false;

    for (let i = 0; i < bundlePlaceholder.length && !bundleSucceed; i++)
        pageData = pageData.replacer(bundlePlaceholder[i], () => (bundleSucceed = true) && replaceWith);

    if(bundleSucceed)
        return removeBundle();

    return pageData.Plus(replaceWith);
}