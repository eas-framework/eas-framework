import StringTracker from '../../../EasyDebug/StringTracker';
import { tagDataObjectArray, StringNumberMap, BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { Options as TransformOptions, transform } from 'sucrase';
import { minify } from "terser";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import { EnableGlobalReplace } from '../../../CompileCode/JSParser';

export default async function BuildCode(language: string, path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any): Promise<BuildInComponent> {

    let result = '', ResCode = BetweenTagData;

    const SaveServerCode = new EnableGlobalReplace("serv");
    await SaveServerCode.load(BetweenTagData, pathName);

    const BetweenTagDataExtracted = SaveServerCode.StartBuild();

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

        result = transform(BetweenTagDataExtracted, AddOptions).code;

        if (InsertComponent.SomePlugins("Min" + language.toUpperCase()) || InsertComponent.SomePlugins("MinAll"))
            result = (await minify(result, { module: false, format: { comments: 'all' } })).code;

        ResCode = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, result));
    } catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: `${err.message}, on file -> ${pathName}:${BetweenTagData.getLine(err?.loc?.line ?? 0).DefaultInfoText.line}:${err.loc.column}`
        });
    }


    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<script${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${ResCode}</script>`
    };
}