import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';
import { compileSass } from './sass';
import { SessionBuild } from '../../../CompileCode/Session';
import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';

export default async function BuildCode(language: string,pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);

    //eslint-disable-next-line 
    let { outStyle, compressed } = await compileSass(language, BetweenTagData, sessionInfo, await SaveServerCode.StartBuild());

    if (!compressed)
        outStyle = `\n${outStyle}\n`;

    const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));

    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<style${dataTag.rebuildSpace()}>${reStoreData}</style>`
    };
}