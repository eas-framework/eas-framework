import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import path_node from 'path';
import { SessionBuild } from '../../CompileCode/Session';
import { CheckDependencyChange } from '../../OutputInput/StoreDeps';
import { FastCompileInFile } from '../../RunTimeBuild/SearchPages';
import InsertComponent from '../../CompileCode/InsertComponent';

function InFolderPagePath(inputPath: string, smallPath:string){
    if (inputPath[0] == '.') {
        if (inputPath[1] == '/') {
            inputPath = inputPath.substring(2);
        } else {
            inputPath = inputPath.substring(1);
        }
        let folder = path_node.dirname(smallPath);

        if(folder){
            folder += '/';
        }
        inputPath = folder + inputPath;
    } else if (inputPath[0] == '/') {
        inputPath = inputPath.substring(1);
    }

    const pageType = '.' + BasicSettings.pageTypes.page;
    if(!inputPath.endsWith(pageType)){
        inputPath += pageType;
    }

    return inputPath;
}

const cacheMap: { [key: string]: {CompiledData: StringTracker, newSession: SessionBuild}} = {};
export default async function BuildCode(pathName: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const filepath = dataTag.getValue("from");

    const SmallPathWithoutFolder = InFolderPagePath(filepath, type.extractInfo());

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

    let ReturnData: StringTracker;

    const haveCache = cacheMap[SmallPathWithoutFolder];
    if (!haveCache || await CheckDependencyChange(null, haveCache.newSession.dependencies)) {
        const { CompiledData, sessionInfo: newSession} = await FastCompileInFile(SmallPathWithoutFolder, getTypes.Static, null, pathName, dataTag.remove('object'));
        newSession.dependencies[SmallPath] = newSession.dependencies.thisPage;
        delete newSession.dependencies.thisPage;

        sessionInfo.extends(newSession)

        cacheMap[SmallPathWithoutFolder] = {CompiledData:<StringTracker>CompiledData, newSession};
        ReturnData =<StringTracker>CompiledData;
    } else {
        const { CompiledData, newSession } = cacheMap[SmallPathWithoutFolder];
   
        Object.assign(sessionInfo.dependencies, newSession.dependencies);
        sessionInfo.extends(newSession)

        ReturnData = CompiledData;
    }

    return {
        compiledString: ReturnData
    }
}