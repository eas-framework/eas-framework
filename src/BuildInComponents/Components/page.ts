import StringTracker from '../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { BasicSettings, getTypes, smallPathToPage } from '../../RunTimeBuild/SearchFileSystem';
import EasyFs from '../../OutputInput/EasyFs';
import { createNewPrint } from '../../OutputInput/PrintNew';
import path_node from 'path';
import { SessionBuild } from '../../CompileCode/Session';
import { CheckDependencyChange } from '../../OutputInput/StoreDeps';
import { FastCompileInFile } from '../../RunTimeBuild/SearchPages';
import InsertComponent from '../../CompileCode/InsertComponent';
import { print } from '../../OutputInput/Console';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';
import JSParser from '../../CompileCode/JSParser';

function InFolderPagePath(inputPath: string, smallPath: string) {
    if (inputPath[0] == '.') {
        inputPath = path_node.join(smallPath, '/../', inputPath);
    }

    if (!path_node.extname(inputPath))
        inputPath += '.' + BasicSettings.pageTypes.page;

    return inputPath;
}

const cacheMap: { [key: string]: { CompiledData: StringTracker, newSession: SessionBuild } } = {};
export default async function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const filepath = dataTag.popHaveDefault("from");

    const inStatic = InFolderPagePath(filepath, smallPathToPage(type.extractInfo()));

    const FullPath = getTypes.Static[0] + inStatic, SmallPath = getTypes.Static[2] + '/' + inStatic;

    if (!(await EasyFs.stat(FullPath, null, true)).isFile?.()) {
        const [funcName, printText] = createNewPrint({
            text: `\nPage not found: ${type.at(0).lineInfo} -> ${FullPath}`,
            errorName: 'page-not-found',
            type: 'error'
        });
        print[funcName](printText);

        return {
            compiledString: new StringTracker(type.DefaultInfoText, JSParser.printError(`Page not found: ${BasicSettings.relative(type.lineInfo)} -> ${SmallPath}`))
        };
    }

    let ReturnData: StringTracker;

    const haveCache = cacheMap[inStatic];
    if (!haveCache || await CheckDependencyChange(null, haveCache.newSession.dependencies)) {
        const { CompiledData, sessionInfo: newSession } = await FastCompileInFile(inStatic, getTypes.Static, { nestedPage: pathName, nestedPageData: dataTag.popHaveDefault('object') });
        newSession.dependencies[SmallPath] = newSession.dependencies.thisPage;
        delete newSession.dependencies.thisPage;

        sessionInfo.extends(newSession)

        cacheMap[inStatic] = { CompiledData: <StringTracker>CompiledData, newSession };
        ReturnData = <StringTracker>CompiledData;
    } else {
        const { CompiledData, newSession } = cacheMap[inStatic];

        Object.assign(sessionInfo.dependencies, newSession.dependencies);
        sessionInfo.extends(newSession)

        ReturnData = CompiledData;
    }

    return {
        compiledString: ReturnData
    }
}