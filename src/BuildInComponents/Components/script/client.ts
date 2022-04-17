import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent,  } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { SessionBuild } from '../../../CompileCode/Session';
import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';
import { transpilerWithOptions } from './load-options';

export default async function BuildCode(language: string, tagData: TagDataParser, BetweenTagData: StringTracker,  sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.popString('type') == 'module', isModelStringCache = isModel ? 'scriptModule' : 'script';

    if (sessionInfo.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);

    const {resultCode, resultMap} = await transpilerWithOptions(BetweenTagData, language, sessionInfo.debug)
    const pushStyle = sessionInfo.addScriptStylePage(isModel ? 'module' : 'script', tagData, BetweenTagData);

    if (resultMap) {
        pushStyle.addSourceMapWithStringTracker(JSON.parse(resultMap), BetweenTagData, resultCode);
    } else {
        pushStyle.addText(resultCode);
    }

    return {
        compiledString: new StringTracker()
    };
}