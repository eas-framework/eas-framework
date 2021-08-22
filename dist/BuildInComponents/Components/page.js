import StringTracker from '../../EasyDebug/StringTracker.js';
import { BasicSettings, CheckDependencyChange, getTypes, PagesInfo } from '../../RunTimeBuild/SearchFileSystem.js';
import EasyFs from '../../OutputInput/EasyFs.js';
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import path_node from 'path';
function InFolderPagePath(inputPath, fullPath) {
    if (inputPath[0] == '.') {
        if (inputPath[1] == '/') {
            inputPath = inputPath.substring(2);
        }
        else {
            inputPath = inputPath.substring(1);
        }
        let folder = path_node.dirname(fullPath).substring(getTypes.Static[0].length);
        if (folder) {
            folder += '/';
        }
        inputPath = folder + inputPath;
    }
    else if (inputPath[0] == '/') {
        inputPath = inputPath.substring(1);
    }
    const pageType = '.' + BasicSettings.pageTypes.page;
    if (!inputPath.endsWith(pageType)) {
        inputPath += pageType;
    }
    return inputPath;
}
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const filepath = dataTag.getValue("from");
    const SmallPathWithoutFolder = InFolderPagePath(filepath, path);
    const FullPath = getTypes.Static[0] + SmallPathWithoutFolder, FullPathCompile = getTypes.Static[1] + SmallPathWithoutFolder + '.js', SmallPath = getTypes.Static[2] + '/' + SmallPathWithoutFolder;
    if (!(await EasyFs.stat(FullPath, null, true)).isFile?.()) {
        PrintIfNew({
            text: `Page not found! -> ${pathName}\n-> ${type.lineInfo}`,
            errorName: 'page-not-found',
            type: 'error'
        });
        return {
            compiledString: new StringTracker(type.DefaultInfoText)
        };
    }
    let ReturnData;
    if (!await EasyFs.existsFile(FullPathCompile) || await CheckDependencyChange(SmallPath) || isDebug) {
        const { CompiledData, dependenceObject: dependence } = await InsertComponent.CompileInFile(SmallPathWithoutFolder, getTypes.Static, pathName, sessionInfo);
        dependence[SmallPath] = dependence.thisPage;
        delete dependence.thisPage;
        Object.assign(dependenceObject, dependence);
        ReturnData = CompiledData;
    }
    else {
        const copy = { ...PagesInfo[InsertComponent.RemoveEndType(SmallPath)] };
        copy[SmallPath] = copy.thisPage;
        delete copy.thisPage;
        Object.assign(dependenceObject, copy);
        ReturnData = await EasyFs.readFile(FullPathCompile);
    }
    return {
        compiledString: new StringTracker(type.DefaultInfoText, `<%!${ReturnData}%>`)
    };
}
//# sourceMappingURL=page.js.map