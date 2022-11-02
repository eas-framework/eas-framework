import {defaultVariables, GetScriptSettings, TRANSFORM_MODULE, TransformJSC} from "../../../Compilers/SWC/Settings.js";
import {GlobalSettings} from "../../../Settings/GlobalSettings.js";
import PPath from "../../../Settings/PPath.js";
import {StringMap} from "../../../Settings/types.js";
import StringTracker from "../../../SourceTracker/StringTracker/StringTracker.js";
import {Options as TransformOptions, transform} from '@swc/core';
import {hasPlugin} from "../../../Settings/utils.js";
import {SWCPrintError} from "../../../Compilers/SWC/Errors.js";
import {ScriptExtension} from "../../../Settings/ProjectConsts.js";
import {backToOriginal} from "../../../SourceTracker/SourceMap/SourceMapLoad.js";
import STToSourceMapCompute from "../../../SourceTracker/SourceMap/StringTrackerToSourceMap.js";
import {DEFAULT_EXPORT_STRING, SOURCE_MAP_SUPPORT} from "../Imports/FileImporter/NodeImporter.js";
import {addEASPlugin} from "../../../Compilers/EASSyntax/EASSyntax.js";
import {injectionParamText} from "../../../Compilers/EASSyntax/InjectScripts.js";
import {pathToFileURL} from 'node:url';
import {normalizeTextSimpleQuotes} from "../../../CompilePage/Templating/utils.js";
import {toURLComment as toURLCommentSourceMap} from "../../../SourceTracker/SourceMap/utils.js";

const CREATE_VARS = 'var ';

function createVars(vars: StringMap) {
    let buildVars = CREATE_VARS;
    for (const v in vars) {
        buildVars += `${v}=${vars[v]},`;
    }

    buildVars = buildVars.slice(0, -1) + ';';
    if (buildVars == CREATE_VARS) {
        buildVars = '';
    }

    return buildVars;
}

export type TranspilerTemplate = (text: string) => string

function createTemplate(code: string, vars: StringMap, params: string[]) {
    params.unshift(injectionParamText, 'require', 'module');

    const buildVars = createVars({
        exports: 'module.exports',
        ...vars
    });
    return `${GlobalSettings.development ? SOURCE_MAP_SUPPORT + ';' : ''}${DEFAULT_EXPORT_STRING} (async (${params.join(',')})=>{${buildVars + code}});`;
}

export function createTranspileEnvironment(script: string, path: PPath, params: string[], vars = {}) {
    script = `require.url = "${
        normalizeTextSimpleQuotes(
            pathToFileURL(path.full).href
        )
    }";` + script;

    const scriptWithTemplate = createTemplate(script, {
        __filename: `"${normalizeTextSimpleQuotes(path.full)}"`,
        __dirname: `"${normalizeTextSimpleQuotes(path.dirname.full)}"`,
        ...vars
    }, params);

    return scriptWithTemplate;
}

/**
 * Use for current source map with string templates
 * @param text
 * @returns
 */
function padNewLites(text: StringTracker) {
    text.addTextBefore('\n');
    text.addTextAfter('\n');
    return text;
}


export async function transpileCode(content: string, templatePath: PPath, {
    params = [],
    isTypescript = false,
    template: codeTemplate
}: { params?: string[], isTypescript?: boolean, template?: TranspilerTemplate }) {
    const options: TransformOptions = {

        jsc: TransformJSC({
            parser: GetScriptSettings(isTypescript),
        }, defaultVariables(), true),

        minify: hasPlugin('minify'),
        ...(<any>TRANSFORM_MODULE),
        filename: templatePath.small,
        sourceMaps: GlobalSettings.development,
        outputPath: templatePath.relativeCompile(templatePath.compile)
    };
    addEASPlugin(options);

    let result: string;

    try {
        const {code, map} = await transform(content, options);
        const templateCode = codeTemplate?.(code) ?? code;
        result = createTranspileEnvironment(templateCode, templatePath, params) + toURLCommentSourceMap(map);
    } catch (err) {
        SWCPrintError(err);
    }

    return result;
}

export async function transpileStringTracker(content: StringTracker, templatePath: PPath, {
    easSyntax = true,
    params = [],
    isTypescript = false,
    template: codeTemplate
}: { easSyntax?: boolean, params?: string[], isTypescript?: boolean, template?: TranspilerTemplate }) {
    const options: TransformOptions = {

        jsc: TransformJSC({
            parser: GetScriptSettings(isTypescript),
        }, defaultVariables(), true),
        ...(<any>TRANSFORM_MODULE),

        filename: templatePath.small,
        sourceMaps: true,
        outputPath: templatePath.relativeCompile(templatePath.compile)
    };
    easSyntax && addEASPlugin(options);
    padNewLites(content);

    let result: string;

    try {
        const {code, map} = await transform(content.eq, options);
        const templateCode = codeTemplate?.(code) ?? code;
        const transpileCode = createTranspileEnvironment(templateCode, templatePath, params);

        const tracker = await backToOriginal(content, transpileCode, map);

        result = STToSourceMapCompute(tracker, templatePath).dataWithSourceMap();
    } catch (err) {
        SWCPrintError(err);
    }

    return result;
}


export function addExtension(file: PPath): PPath {
    file = file.clone();
    const ext = file.ext.substring(1);

    if (ScriptExtension.partExtensions.includes(ext)) {
        file.nested += `.${GlobalSettings.compile.typescript ? 'ts' : 'js'}`;
    } else if (ext == '') {
        file.nested += '.' + ScriptExtension.script[GlobalSettings.compile.typescript ? "ts" : "js"];
    }

    return file;
}