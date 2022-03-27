import StringTracker from '../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import path from 'path';
import EasyFs from '../../OutputInput/EasyFs';
import { BasicSettings, getTypes } from '../../RunTimeBuild/SearchFileSystem';
import Base64Id from '../../StringMethods/Id';
import { SessionBuild , setDataHTMLTag} from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

export default async function BuildCode( pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker,  InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<head${dataTag.rebuildSpace()}>${await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo)
            }@DefaultInsertBundle</head>`,
        checkComponents: false
    }
}

export async function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild, fullCompilePath: string) {
    const buildBundleString = await sessionInfo.buildHead();
    
    const bundlePlaceholder = [/@InsertBundle(;?)/, /@DefaultInsertBundle(;?)/];
    const removeBundle = () => {bundlePlaceholder.forEach(x => pageData = pageData.replace(x, '')); return pageData};


    if (!buildBundleString)  // there isn't anything to bundle
        return removeBundle();

    const replaceWith = new StringTracker(null, buildBundleString); // add bundle to page
    let bundleSucceed = false;

    for (let i = 0; i < bundlePlaceholder.length && !bundleSucceed; i++)
        pageData = pageData.replacer(bundlePlaceholder[i], () => (bundleSucceed = true) && replaceWith);

    if(bundleSucceed)
        return removeBundle();

    return pageData.Plus$ `\nout_run_script.text+='${replaceWith}';`;
}