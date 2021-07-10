import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { Options as TransformOptions, transform, TransformResult } from 'sucrase';
import { minify } from "terser";
import sass from 'sass';
import { PrintIfNew } from '../../OutputInput/PrintNew';
import EasyFs from '../../OutputInput/EasyFs';
import { CreateFilePath, PathTypes } from './../../CompileCode/XMLHelpers/CodeInfoAndDebug';
import { BasicSettings } from '../../RunTimeBuild/SearchFileSystem';
import { EnableGlobalReplace } from '../../CompileCode/JSParser';

export default async function BuildCode(path: string, pathName: string, LastSmallPath: string, type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, dependenceObject: StringNumberMap, isDebug: boolean, InsertComponent: any): Promise<BuildInComponent> {
    const lang = dataTag.find(x => x.n.eq == 'lang');

    let result = { code: '' }, ResCode = BetweenTagData;

    const SaveServerCode = new EnableGlobalReplace(BetweenTagData, pathName);
    const BetweenTagDataExtracted = SaveServerCode.StartBuild();

    const langName = lang?.v?.eq || 'js';
    const AddOptions: TransformOptions = {
        transforms: [],
        ...InsertComponent.GetPlugin("transformOptions")
    };

    const firstChar = BetweenTagDataExtracted[0];

    try {
        switch (langName) {
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

        result = transform(BetweenTagDataExtracted, AddOptions);

        const mini = InsertComponent.SomePlugins("Min" + langName.toUpperCase()) || InsertComponent.SomePlugins("MinAll");

        if (mini) {
            result.code = (await minify(result.code, { module: false, format: { comments: 'all' } })).code;
        } else if (result.code[0] != firstChar) {
            result.code = firstChar + result.code;
        }

        ResCode = SaveServerCode.RestoreCode(new StringTracker(BetweenTagData.StartInfo, result.code));
    } catch (err) {
        PrintIfNew({
            errorName: 'compilation-error',
            text: `${err.message}, on file -> ${pathName}:${BetweenTagData.getLine(err.loc.line).DefaultInfoText.line}:${err.loc.column}`
        });
    }

    if (lang) {
        dataTag.splice(dataTag.findIndex(x => x.n.eq == 'lang'), 1); // remove lang from tags
    }

    return {
        compiledString: new StringTracker(type.DefaultInfoText).Plus$`<script${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${ResCode}</script>`
    };
}