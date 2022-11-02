import DepCreator from "../../ImportSystem/Dependencies/DepCreator.js";
import PPath from "../../Settings/PPath.js";
import * as svelte from 'svelte/compiler';
import {GlobalSettings} from "../../Settings/GlobalSettings.js";
import STToSourceMapCompute from "../../SourceTracker/SourceMap/StringTrackerToSourceMap.js";
import {logSvelteError, logSvelteWarn} from "./Errors.js";
import {hasPlugin} from "../../Settings/utils.js";
import {transform} from "@swc/core";
import {TransformJSC} from "../SWC/Settings.js";
import {mergeSourceMap} from "../../SourceTracker/SourceMap/utils.js";
import {RawSourceMap} from "source-map";
import {SWCPrintErrorSourceMap} from "../SWC/Errors.js";
import EasyFS from "../../Util/EasyFS.js";
import {preprocess} from "./Preprocess.js";
import {addSourceMapComment, updateSourcesForWeb} from "./utils.js";

async function minify(script: { code: string, map: RawSourceMap }, scriptLang: string) {
    if (!hasPlugin('minify')) {
        return;
    }
    try {
        const {code, map} = await transform(script.code, {
            jsc: TransformJSC({
                parser: {
                    syntax: scriptLang == 'js' ? 'ecmascript' : 'typescript'
                }
            }, null, true),
            minify: true,
            sourceMaps: GlobalSettings.development
        });

        script.code = code;
        if (map) {
            script.map = (await mergeSourceMap(JSON.parse(map), script.map)).toJSON();
        }
    } catch (err) {
        await SWCPrintErrorSourceMap(err, script.map);
    }
}

function addSourceMap(output: { js: any, css: any }) {
    if (!GlobalSettings.development) {
        return;
    }

    updateSourcesForWeb(output.js.map);
    addSourceMapComment(output.js);

    updateSourcesForWeb(output.css.map);
    addSourceMapComment(output.css, true);
}

async function writeSvelteContent({js, css}, file: PPath) {
    await EasyFS.mkdirIfNotExists(file.dirname.compile, {recursive: true});

    await Promise.all([
        await EasyFS.writeFile(file.compile, js.code),
        await EasyFS.writeFile(file.compile + '.css', css.code)
    ]);
}

export default async function compileSvelte(file: PPath, deps: DepCreator) {
    const {output, scriptLang} = await preprocess(file, deps), sourcemap = STToSourceMapCompute(output, file).map;

    let compileSvelte: any;

    try {
        compileSvelte = svelte.compile(output.eq, {
            filename: file.name,
            dev: GlobalSettings.development,
            sourcemap,
            css: false,
            hydratable: true,
            sveltePath: '/serv/svelte'
        });
        logSvelteWarn(compileSvelte.warnings, file, sourcemap);

        await minify(compileSvelte.js, scriptLang);
        addSourceMap(compileSvelte);

        await writeSvelteContent(compileSvelte, file);
        await deps.updateDep(file);

        return true;
    } catch (err) {
        logSvelteError(err, file, sourcemap);
    }
}