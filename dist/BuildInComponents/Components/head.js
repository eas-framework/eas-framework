import StringTracker from '../../EasyDebug/StringTracker.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, buildScript, sessionInfo) {
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<head${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)}@DefaultInsertBundle</head>`,
        checkComponents: false
    };
}
export async function addFinalizeBuild(pageData, sessionInfo, fullCompilePath) {
    const buildBundleString = sessionInfo.buildHead();
    const bundlePlaceholder = [/@InsertBundle(;?)/, /@DefaultInsertBundle(;?)/];
    const removeBundle = () => { bundlePlaceholder.forEach(x => pageData = pageData.replace(x, '')); return pageData; };
    if (!buildBundleString) // there isn't anything to bundle
        return removeBundle();
    const replaceWith = new StringTracker(null, buildBundleString); // add bundle to page
    let bundleSucceed = false;
    for (let i = 0; i < bundlePlaceholder.length && !bundleSucceed; i++)
        pageData = pageData.replacer(bundlePlaceholder[i], () => (bundleSucceed = true) && replaceWith);
    if (bundleSucceed)
        return removeBundle();
    return pageData.Plus$ `\nout_run_script.text+='${replaceWith}';`;
}
//# sourceMappingURL=head.js.map