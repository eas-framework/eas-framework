import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { TransformOptions, transform } from 'esbuild-wasm';
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';
import InsertComponent from '../../../CompileCode/InsertComponent';
import { GetPlugin, SomePlugins } from '../../../CompileCode/InsertModels';
import { ESBuildPrintErrorStringTracker, ESBuildPrintWarningsStringTracker } from '../../../CompileCode/esbuild/printMessage';
import SourceMapToStringTracker from '../../../EasyDebug/SourceMapLoad';

export default async function BuildCode(language: string, pathName: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, InsertComponent: InsertComponent): Promise<BuildInComponent> {

    let ResCode = BetweenTagData;

    const SaveServerCode = new EnableGlobalReplace("serv");
    await SaveServerCode.load(BetweenTagData, pathName);

    const BetweenTagDataExtracted = await SaveServerCode.StartBuild();

    const AddOptions: TransformOptions = {
        sourcefile: BetweenTagData.extractInfo(),
        minify: SomePlugins("Min" + language.toUpperCase()) || SomePlugins("MinAll"),
        sourcemap: 'external',
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

        const {map, code, warnings} = await transform(BetweenTagDataExtracted, AddOptions);
        ESBuildPrintWarningsStringTracker(BetweenTagData, warnings);
        
        ResCode = SaveServerCode.RestoreCode(await SourceMapToStringTracker(code, map));
    } catch (err) {
        ESBuildPrintErrorStringTracker(BetweenTagData, err)
    }


    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<script${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${ResCode}</script>`
    };
}