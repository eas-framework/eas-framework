import {Options as TransformOptions, transform} from '@swc/core';
import {normalizeText} from '../../CompilePage/Templating/utils.js';
import StringTracker from '../../SourceTracker/StringTracker/StringTracker.js';
import {SessionBuild} from '../../CompilePage/Session.js';
import {defaultVariables, GetScriptSettings, TransformJSC} from '../SWC/Settings.js';
import {GlobalSettings} from '../../Settings/GlobalSettings.js';
import {backToOriginal} from '../../SourceTracker/SourceMap/SourceMapLoad.js';
import {SWCPrintErrorStringTracker} from '../SWC/Errors.js';
import {relative} from '../../Settings/ProjectConsts.js';
import {addEASPlugin} from './EASSyntax.js';
import {EXPORT_STRING_EAS_SYNTAX} from '../../ImportSystem/Loader/Imports/FileImporter/NodeImporter.js';

function ErrorTemplate(info: string) {
    return `${EXPORT_STRING_EAS_SYNTAX} = () => (DataObject) => DataObject.out_run_script.text += \`${normalizeText(`Syntax Error: ${info}`)}\``;
}

export async function PluginScript(text: StringTracker, sessionInfo: SessionBuild) {
    text = text.trim();

    const options: TransformOptions = {
        jsc: TransformJSC({
            parser: GetScriptSettings(true)
        }),

        filename: sessionInfo.file.small,
        sourceMaps: true
    };
    addEASPlugin(options);

    let result: StringTracker;

    try {
        const {code, map} = await transform(text.eq, options);
        result = map ? await backToOriginal(text, code, map) : new StringTracker(code);
    } catch (err) {
        SWCPrintErrorStringTracker(text, err);
        return new StringTracker(`/*Error -> ${text.topCharStack.toString()}*/`);
    }

    return result;
}

/**
 * It takes a script and transform to 'Framework' script
 * @param {StringTracker} text - The text to be transformed.
 * @param {SessionBuild} sessionInfo - SessionBuild
 * @returns A function that takes a StringTracker, a boolean, and a SessionBuild and returns a Promise
 * of a StringTracker.
 */
export async function ScriptToEASScriptLastProcesses(text: StringTracker, sessionInfo: SessionBuild): Promise<StringTracker> {
    text = text.trim();
    const options: TransformOptions = {
        jsc: TransformJSC({
            parser: GetScriptSettings(GlobalSettings.compile.typescript),
        }, {
            ...defaultVariables()
        }, true),

        minify: !GlobalSettings.development,
        filename: sessionInfo.file.small,
        sourceMaps: true
    };
    addEASPlugin(options, {transformStopToReturn: true});

    let result: StringTracker;

    try {
        const {code, map} = await transform(text.eq, options);
        result = map ? await backToOriginal(text, code, map) : new StringTracker(code);
    } catch (err) {
        const parse = SWCPrintErrorStringTracker(text, err);

        if (GlobalSettings.development) {
            parse.errorFile = relative(parse.errorFile);
            result = new StringTracker(ErrorTemplate(parse.simpleMessage));
        }
    }

    return result;
}