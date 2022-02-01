import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { CreateFilePathOnePath, PathTypes } from './../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { BasicSettings, CheckDependencyChange, getTypes, PagesInfo } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import path_node from 'path';

function InFolderPagePath(inputPath: string, fullPath:string){
    if (inputPath[0] == '.') {
        if (inputPath[1] == '/') {
            inputPath = inputPath.substring(2);
        } else {
            inputPath = inputPath.substring(1);
        }
        let folder = path_node.dirname(fullPath).substring(getTypes.Static[0].length);

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

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    const filepath = dataTag.getValue("from");

    const SmallPathWithoutFolder = InFolderPagePath(filepath, path);

    const FullPath = getTypes.Static[0] + SmallPathWithoutFolder, FullPathCompile =  getTypes.Static[1] + SmallPathWithoutFolder + '.cjs', SmallPath = getTypes.Static[2] + '/' + SmallPathWithoutFolder;

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

    let ReturnData: string;

    if (!await EasyFs.existsFile(FullPathCompile) || await CheckDependencyChange(SmallPath) || isDebug) {
        const { CompiledData, dependenceObject: dependence } = await InsertComponent.CompileInFile(SmallPathWithoutFolder, getTypes.Static, pathName, sessionInfo);
        dependence[SmallPath] = dependence.thisPage;
        delete dependence.thisPage;

        Object.assign(dependenceObject, dependence);

        ReturnData = CompiledData;
    } else {
        const copy = {...PagesInfo[ InsertComponent.RemoveEndType(SmallPath)]}
        copy[SmallPath] = copy.thisPage;
        delete copy.thisPage;

        Object.assign(dependenceObject, copy);

        ReturnData = await EasyFs.readFile(FullPathCompile);
    }

    return {
        compiledString: new StringTracker(type.DefaultInfoText, `<%!${ReturnData}%>`)
    }
}