import * as svelte from 'svelte/compiler'
import { CompileOptions } from "svelte/types/compiler/interfaces"
import DepCreator from "../../ImportSystem/Dependencies/DepCreator"
import { GlobalSettings } from "../../Settings/GlobalSettings"
import PPath from "../../Settings/PPath"
import { makeWebURLSourceStaticFile } from '../../SourceTracker/SourceMap/SourceComputeTrack'
import STToSourceMap from "../../SourceTracker/SourceMap/StringTrackerToSourceMap"
import { toURLComment } from '../../SourceTracker/SourceMap/utils'
import EasyFS from '../../Util/EasyFS'
import { Capitalize } from "../../Util/Strings"
import { logSvelteError, logSvelteWarn } from "./Errors"
import { preprocess } from "./preprocess"
import { addSourceMapComment, updateSourcesForLocal, updateSourcesForWeb } from './utils'

function makeValidName(name: string){
    return name.replace(/^\d/, '_$&') // if name start with a digit add '_' on start
    .replace(/[^a-zA-Z0-9_$]/g, '') // allow only letters, numbers and '_', '$'
}

function createSourceMap(css:any, js: any, file: PPath){
    if (!GlobalSettings.development) {
        return
    }

    if(css.code){
        updateSourcesForWeb(css.map)
        addSourceMapComment(css, true)
    }

    updateSourcesForLocal(js.map, file)
    addSourceMapComment(js)
}

function savePathJS(file: PPath){
    return  file.compile + '.ssr.cjs'
}
function savePathCSS(file: PPath){
    return  file.compile + '.css'
}

async function writeSvelteContent({js, css}, file: PPath) {
    await EasyFS.mkdirIfNotExists(file.dirname.compile, {recursive: true})

    await Promise.all([
        await EasyFS.writeFile(savePathJS(file), js.code),
        await EasyFS.writeFile(savePathCSS(file), css.code)
    ])
}

export default async function registerExtension(file: PPath, deps: DepCreator) {
    const name = makeValidName(file.name)

    const options: CompileOptions = {
        filename: file.name,
        name: Capitalize(name),
        generate: 'ssr',
        format: 'cjs',
        dev: GlobalSettings.development,
        errorMode: 'warn'
    }

    const {svelteFiles, output} = await preprocess(file, deps, '.ssr.cjs'), sourcemap = STToSourceMap(output, file).map
    options.sourcemap = sourcemap

    const promises = []
    for(const file of svelteFiles){
        promises.push(
            registerExtension(file, deps.nestedDepFile(file))
        )
    }
    await Promise.all(promises)


    try {
        const { js, css, warnings } = svelte.compile(output.eq, <any>options)
        logSvelteWarn(warnings, file, sourcemap)
        createSourceMap(css, js, file)
    
        await Promise.all([
            writeSvelteContent({js,css}, file),
            deps.updateDep(file)
        ])
    } catch (err) {
        logSvelteError(err, file, sourcemap)
    }

    return savePathJS(file)
}
