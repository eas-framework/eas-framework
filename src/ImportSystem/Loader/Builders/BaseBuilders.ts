import { defaultVariables, GetScriptSettings, TransformJSC } from "../../../Compilers/SWC/Settings";
import { GlobalSettings } from "../../../Settings/GlobalSettings";
import PPath from "../../../Settings/PPath";
import { StringMap } from "../../../Settings/types";
import StringTracker from "../../../SourceTracker/StringTracker/StringTracker";
import { Options as TransformOptions, transform } from '@swc/core';
import { getPlugin, hasPlugin } from "../../../Settings/utils";
import EasySyntax from "../../../Compilers/EasySyntax/EasySyntax";
import { SWCPrintError } from "../../../Compilers/SWC/Errors";
import { ScriptExtension } from "../../../Settings/ProjectConsts";
import { backToOriginal } from "../../../SourceTracker/SourceMap/SourceMapLoad";
import STToSourceMapCompute from "../../../SourceTracker/SourceMap/StringTrackerToSourceMap";
import { DEFAULT_EXPORT_STRING, SOURCE_MAP_SUPPORT } from "../Imports/FileImporter/NodeImporter";

const CREATE_VARS = 'var '

function createVars(vars: StringMap) {
    let buildVars = CREATE_VARS
    for (const v in vars) {
        buildVars += `${v}=${vars[v]},`
    }

    buildVars = buildVars.slice(0, -1) + ';'
    if (buildVars == CREATE_VARS) {
        buildVars = ''
    }

    return buildVars
}

function createTemplate(code: string, vars: StringMap, params: string[]) {
    params.unshift('require')

    const buildVars = createVars(vars)
    return `${GlobalSettings.development ? SOURCE_MAP_SUPPORT + ';' : ''};${DEFAULT_EXPORT_STRING} (async (${params.join(',')})=>{var module={exports:{}},exports=module.exports;${buildVars + code}\nreturn module.exports;});`;
}


export async function transpileCode(content: string, templatePath: PPath, params: string[], isTypescript: boolean) {
    const Options: TransformOptions = {

        jsc: TransformJSC({
            parser: GetScriptSettings(isTypescript),
        }, defaultVariables(), true),

        minify: hasPlugin('minify'),
        filename: templatePath.name,
        sourceMaps: GlobalSettings.development ? 'inline' : false,
        outputPath: templatePath.relativeCompile(templatePath.compile)
    };


    const CommonJSScript = await EasySyntax.BuildAndExportImports(content)
    const scriptWithTemplate = createTemplate(CommonJSScript, {
        __filename: templatePath.full,
        __dirname: templatePath.dirname.full
    }, params)

    let result: string;

    try {
        const { code } = await transform(scriptWithTemplate, Options);
        result = code
    } catch (err) {
        SWCPrintError(err)
    }

    return result
}

export async function transpileStringTracker(content: StringTracker, templatePath: PPath, params: string[], isTypescript: boolean) {
    const Options: TransformOptions = {

        jsc: TransformJSC({
            parser: GetScriptSettings(isTypescript),
        }, defaultVariables(), true),

        filename: templatePath.name,
        sourceMaps: true,
        outputPath: templatePath.relativeCompile(templatePath.compile)
    };


    const CommonJSScript = await EasySyntax.BuildAndExportImports(content.eq)
    const scriptWithTemplate = createTemplate(CommonJSScript, {
        __filename: templatePath.full,
        __dirname: templatePath.dirname.full
    }, params)

    let result: string;

    try {
        const { code, map } = await transform(scriptWithTemplate, Options);
        const tracker = await backToOriginal(content, code, map)
        
        result = STToSourceMapCompute(tracker, templatePath).dataWithSourceMap()
    } catch (err) {
        SWCPrintError(err)
    }

    return result
}


export function addExtension(file: PPath): PPath {
    file = file.clone()
    const ext = file.ext.substring(1)
    
    if (ScriptExtension.partExtensions.includes(ext)){
        file.nested += `.${GlobalSettings.compile.typescript ? 'ts' : 'js'}`
    } else if(ext == '') {
        file.nested +=  "." + ScriptExtension.script[GlobalSettings.compile.typescript ? "ts" : "js"];
    }

  return file;
}