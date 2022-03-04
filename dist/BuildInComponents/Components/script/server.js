import StringTracker from '../../../EasyDebug/StringTracker.js';
import { transform } from 'sucrase';
import { minify } from "terser";
import { PrintIfNew } from '../../../OutputInput/PrintNew.js';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser.js';
export default async function BuildCode(language, path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent) {
    let result = '', ResCode = BetweenTagData;
    const SaveServerCode = new EnableGlobalReplace("serv");
    await SaveServerCode.load(BetweenTagData, pathName);
    const BetweenTagDataExtracted = await SaveServerCode.StartBuild();
    const AddOptions = {
        transforms: [],
        ...InsertComponent.GetPlugin("transformOptions")
    };
    try {
        switch (language) {
            case 'ts':
                AddOptions.transforms.push('typescript');
                break;
            case 'jsx':
                AddOptions.transforms.push('jsx');
                Object.assign(AddOptions, InsertComponent.GetPlugin("JSXOptions") ?? {});
                break;
            case 'tsx':
                AddOptions.transforms.push('typescript');
                AddOptions.transforms.push('jsx');
                Object.assign(AddOptions, InsertComponent.GetPlugin("TSXOptions") ?? {});
                break;
        }
        result = transform(BetweenTagDataExtracted, AddOptions).code;
        if (InsertComponent.SomePlugins("Min" + language.toUpperCase()) || InsertComponent.SomePlugins("MinAll")) {
            try {
                result = (await minify(result, { module: false, format: { comments: 'all' } })).code;
            }
            catch (err) {
                PrintIfNew({
                    errorName: 'minify',
                    text: BetweenTagData.debugLine(err)
                });
            }
        }
        ResCode = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, result));
    }
    catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: BetweenTagData.debugLine(err)
        });
    }
    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<script${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${ResCode}</script>`
    };
}
//# sourceMappingURL=server.js.map