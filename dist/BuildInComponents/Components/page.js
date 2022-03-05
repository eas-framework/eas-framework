import StringTracker from '../../EasyDebug/StringTracker.js';
import { BasicSettings, CheckDependencyChange, getTypes } from '../../RunTimeBuild/SearchFileSystem.js';
import EasyFs from '../../OutputInput/EasyFs.js';
import { PrintIfNew } from '../../OutputInput/PrintNew.js';
import path_node from 'path';
import { extendsSession } from '../../CompileCode/Session.js';
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
const cacheMap = {};
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, sessionInfo) {
    const filepath = dataTag.getValue("from");
    const SmallPathWithoutFolder = InFolderPagePath(filepath, path);
    const FullPath = getTypes.Static[0] + SmallPathWithoutFolder, SmallPath = getTypes.Static[2] + '/' + SmallPathWithoutFolder;
    if (!(await EasyFs.stat(FullPath, null, true)).isFile?.()) {
        PrintIfNew({
            text: `\nPage not found: ${type.at(0).lineInfo} -> ${FullPath}`,
            errorName: 'page-not-found',
            type: 'error'
        });
        return {
            compiledString: new StringTracker(type.DefaultInfoText, `<p style="color:red;text-align:left;font-size:16px;">Page not found: ${type.lineInfo} -> ${SmallPath}</p>`)
        };
    }
    let ReturnData;
    const haveCache = cacheMap[SmallPathWithoutFolder];
    if (!haveCache || await CheckDependencyChange(null, haveCache.dependence)) {
        const { CompiledData, dependenceObject: dependence, sessionInfo: newSession } = await InsertComponent.CompileInFile(SmallPathWithoutFolder, getTypes.Static, pathName);
        dependence[SmallPath] = dependence.thisPage;
        delete dependence.thisPage;
        extendsSession(sessionInfo, newSession);
        cacheMap[SmallPathWithoutFolder] = { CompiledData, dependence, newSession };
        Object.assign(dependenceObject, dependence);
        ReturnData = CompiledData;
    }
    else {
        const { CompiledData, dependence, newSession } = cacheMap[SmallPathWithoutFolder];
        Object.assign(dependenceObject, dependence);
        extendsSession(sessionInfo, newSession);
        ReturnData = CompiledData;
    }
    return {
        compiledString: ReturnData
    };
}
//# sourceMappingURL=page.js.map