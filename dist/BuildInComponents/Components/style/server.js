import StringTracker from '../../../EasyDebug/StringTracker.js';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser.js';
import { compileSass } from './sass.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent) {
    const SaveServerCode = new EnableGlobalReplace();
    await SaveServerCode.load(BetweenTagData.trimStart(), pathName);
    //eslint-disable-next-line 
    let { outStyle, compressed } = await compileSass(language, BetweenTagData, dependenceObject, InsertComponent, isDebug, await SaveServerCode.StartBuild());
    if (!compressed)
        outStyle = `\n${outStyle}\n`;
    const reStoreData = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, outStyle));
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<style${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${reStoreData}</style>`
    };
}
//# sourceMappingURL=server.js.map