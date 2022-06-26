import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent,  } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../../CompileCode/Session';
import SourceMapStore from '../../../EasyDebug/SourceMapStore';
import { compileSass } from './sass';
import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';

export default async function BuildCode(language: string, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    
    const outStyleAsTrim = BetweenTagData.eq;
    if (sessionInfo.cache.style.includes(outStyleAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache.style.push(outStyleAsTrim);

    const { result, outStyle } = await compileSass(language, BetweenTagData, sessionInfo);

    const pushStyle = sessionInfo.addScriptStylePage('style', dataTag,  BetweenTagData);

    if (result?.sourceMap)
        pushStyle.addSourceMapWithStringTracker(SourceMapStore.fixURLSourceMap(<any>result.sourceMap), BetweenTagData, outStyle);
    else
        pushStyle.addStringTracker(BetweenTagData, { text: outStyle });

    return {
        compiledString: new StringTracker()
    };
}