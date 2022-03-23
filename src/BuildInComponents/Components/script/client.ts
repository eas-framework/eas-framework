import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent, tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { TransformOptions, transform } from 'esbuild-wasm';
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import { SessionBuild } from '../../../CompileCode/Session';
import { parseTagDataStringBoolean } from '../serv-connect/index';
import InsertComponent from '../../../CompileCode/InsertComponent';
import { GetPlugin, SomePlugins } from '../../../CompileCode/InsertModels';
import { ESBuildPrintErrorStringTracker, ESBuildPrintWarningsStringTracker } from '../../../CompileCode/esbuild/printMessage';

export default async function BuildCode(language: string, tagData: tagDataObjectArray, BetweenTagData: StringTracker,  sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const BetweenTagDataEq = BetweenTagData.eq, BetweenTagDataEqAsTrim = BetweenTagDataEq.trim(), isModel = tagData.getValue('type') == 'module', isModelStringCache = isModel ? 'scriptModule' : 'script';

    if (sessionInfo.cache[isModelStringCache].includes(BetweenTagDataEqAsTrim))
        return {
            compiledString: new StringTracker()
        };
    sessionInfo.cache[isModelStringCache].push(BetweenTagDataEqAsTrim);

    let resultCode = '', resultMap: string;

    const AddOptions: TransformOptions = {
        sourcefile: BetweenTagData.extractInfo(),
        minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
        sourcemap: sessionInfo.debug ? 'external' : false,
        ...GetPlugin("transformOptions")
    };

    try {
        switch (language) {
            case 'ts':
                AddOptions.loader = 'ts';
                break;

            case 'jsx':
                AddOptions.loader = 'jsx';
                Object.assign(AddOptions, GetPlugin("JSXOptions") ?? {});
                break;

            case 'tsx':
                AddOptions.loader = 'tsx';
                Object.assign(AddOptions, GetPlugin("TSXOptions") ?? {});
                break;
        }

        const { map, code, warnings } = await transform(BetweenTagData.eq, AddOptions);
        ESBuildPrintWarningsStringTracker(BetweenTagData, warnings);

        resultCode = code;
        resultMap = map;
    } catch (err) {
        ESBuildPrintErrorStringTracker(BetweenTagData, err)
    }


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