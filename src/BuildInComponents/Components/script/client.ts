import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { Options as TransformOptions, transform } from 'sucrase';
import { minify } from "terser";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import { SessionInfo } from '../../../CompileCode/XMLHelpers/CompileTypes';

export default async function BuildCode(language: string, tagData: tagDataObjectArray, BetweenTagData: StringTracker, pathName: string, InsertComponent: any, sessionInfo: SessionInfo): Promise<BuildInComponent> {
    const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.getValue('type') == 'module', isModelStringCache = isModel ? 'scriptModule': 'script';

    if (sessionInfo.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);

    let resultCode = '';

    const AddOptions: TransformOptions = {
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

        resultCode = transform(BetweenTagData.eq, AddOptions).code;

        if (InsertComponent.SomePlugins("Min" + language.toUpperCase()) || InsertComponent.SomePlugins("MinAll")){
            try {
                resultCode = (await minify(resultCode, { module: false, format: { comments: 'all' } })).code;
            } catch (err) {
                PrintIfNew({
                    errorName: 'minify',
                    text: BetweenTagData.debugLine(err)
                });
            }
        }
    } catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: BetweenTagData.debugLine(err)
        });
    }


    if (isModel)
        sessionInfo.scriptModule.addStringTracker(BetweenTagData, {text: resultCode});
    else
        sessionInfo.script.addStringTracker(BetweenTagData, {text: resultCode});

    return {
        compiledString: new StringTracker()
    };
}