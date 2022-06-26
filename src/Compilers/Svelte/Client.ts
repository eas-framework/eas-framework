import DepCreator from "../../ImportSystem/Dependencies/DepCreator"
import PPath from "../../Settings/PPath"
import * as svelte from 'svelte/compiler'
import { GlobalSettings } from "../../Settings/GlobalSettings"
import STToSourceMapCompute from "../../SourceTracker/SourceMap/StringTrackerToSourceMap"
import { logSvelteError, logSvelteWarn } from "./Errors"
import { hasPlugin } from "../../Settings/utils"
import { transform } from "@swc/core"
import { TransformJSC } from "../SWC/Settings"
import { mergeSourceMap, toURLComment } from "../../SourceTracker/SourceMap/utils"
import { RawSourceMap } from "source-map"
import { SWCPrintErrorSourceMap } from "../SWC/Errors"
import EasyFS from "../../Util/EasyFS"
import { preprocess } from "./preprocess"
import { addSourceMapComment, updateSourcesForWeb } from "./utils"

async function minify(script: { code: string, map: RawSourceMap }, scriptLang: string) {
    if (!hasPlugin('minify')) {
        return
    }
    try {
        const { code, map } = await transform(script.code, {
            jsc: TransformJSC({
                parser: {
                    syntax: scriptLang == 'js' ? 'ecmascript' : 'typescript'
                }
            }, null, true),
            minify: true,
            sourceMaps: GlobalSettings.development
        })

        script.code = code
        if (map) {
            script.map = (await mergeSourceMap(JSON.parse(map), script.map)).toJSON()
        }
    } catch (err) {
        await SWCPrintErrorSourceMap(err, script.map)
    }
}

function addSourceMap(output: { js: any, css: any }) {
    if (!GlobalSettings.development) {
        return
    }

    updateSourcesForWeb(output.js.map)
    addSourceMapComment(output.js)

    updateSourcesForWeb(output.css.map)
    addSourceMapComment(output.css, true)
}

async function writeSvelteContent({js, css}, file: PPath) {
    await EasyFS.mkdirIfNotExists(file.dirname.compile, {recursive: true})

    await Promise.all([
        await EasyFS.writeFile(file.compile + '.js', js.code),
        await EasyFS.writeFile(file.compile + '.css', css.code)
    ])
}

export default async function compileSvelte(file: PPath, deps: DepCreator) {
    const { output, scriptLang } = await preprocess(file, deps), sourcemap = STToSourceMapCompute(output, file).map

    let compileSvelte: any

    try {
        compileSvelte = svelte.compile(output.eq, {
            filename: file.name,
            dev: GlobalSettings.development,
            sourcemap,
            css: false,
            hydratable: true,
            sveltePath: '/serv/svelte'
        })
        logSvelteWarn(compileSvelte.warnings, file, sourcemap)
    } catch (err) {
        logSvelteError(err, file, sourcemap)
    }

    await minify(compileSvelte.js, scriptLang)
    addSourceMap(compileSvelte)

    await writeSvelteContent(compileSvelte, file)
    await deps.updateDep(file)
}