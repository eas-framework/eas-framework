import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';
import SourceMapToStringTracker from '../../../EasyDebug/SourceMapLoad';
import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';
import { transpilerWithOptions } from './load-options';

export default async function BuildCode(language: string, pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker): Promise<BuildInComponent> {

    let ResCode = BetweenTagData;

    const SaveServerCode = new EnableGlobalReplace("serv");
    await SaveServerCode.load(BetweenTagData, pathName);

    const BetweenTagDataExtracted = await SaveServerCode.StartBuild();

    const {resultCode, resultMap} = await transpilerWithOptions(BetweenTagData, language, false, BetweenTagDataExtracted, {preserveAllComments: true})
    ResCode = SaveServerCode.RestoreCode(await SourceMapToStringTracker(resultCode, resultMap));
 
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<script${dataTag.rebuildSpace()}>${ResCode}</script>`
    };
}