import StringTracker from '../../../EasyDebug/StringTracker';
import { BuildInComponent } from '../../../CompileCode/XMLHelpers/CompileTypes';
import { Options as TransformOptions, transform } from 'sucrase';
import { minify } from "terser";
import { PrintIfNew } from '../../../OutputInput/PrintNew';
import { StringAnyMap } from '../../../CompileCode/XMLHelpers/CompileTypes';

export default async function BuildCode(language: string, BetweenTagData: StringTracker, pathName: string, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent> {

    let result = '';

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

        result = transform(BetweenTagData.eq, AddOptions).code;

        if (InsertComponent.SomePlugins("Min" + language.toUpperCase()) || InsertComponent.SomePlugins("MinAll"))
            result = (await minify(result, { module: false, format: { comments: 'all' } })).code;

    } catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: `${err.message}, on file -> ${pathName}:${BetweenTagData.getLine(err?.loc?.line ?? 0).DefaultInfoText.line}:${err.loc.column}`
        });
    }

    sessionInfo.script += result;

    return {
        compiledString: new StringTracker()
    };
}