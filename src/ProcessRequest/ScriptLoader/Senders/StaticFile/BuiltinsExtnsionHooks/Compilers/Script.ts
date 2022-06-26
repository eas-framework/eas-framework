import { Options as TransformOptions, transform, ParserConfig } from '@swc/core'
import { SWCPrintError } from '../../../../../../Compilers/SWC/Errors'
import { TransformJSC } from '../../../../../../Compilers/SWC/Settings'
import DepCreator from '../../../../../../ImportSystem/Dependencies/DepCreator'
import { GlobalSettings } from '../../../../../../Settings/GlobalSettings'
import PPath from '../../../../../../Settings/PPath'
import { getPlugin, hasPlugin } from '../../../../../../Settings/utils'
import { makeWebURLSourceStaticFile } from '../../../../../../SourceTracker/SourceMap/SourceComputeTrack'
import EasyFS from '../../../../../../Util/EasyFS'


async function compileScript(file: PPath, deps: DepCreator, config?: ParserConfig, optionsName?: string) {
    const AddOptions: TransformOptions = {
        filename: file.full,
        sourceFileName: makeWebURLSourceStaticFile(file.nested),
        jsc: TransformJSC({
            parser: {
                ...config,
                ...getPlugin("transformOptions"),
                ...getPlugin(optionsName)
            }
        }, { __DEBUG__: '' + GlobalSettings.development }),
        minify: hasPlugin('minify'),
        sourceMaps: GlobalSettings.development ? 'inline' : false
    }

    let result = await EasyFS.readFile(file.full)

    try {
        result = (await transform(result, AddOptions)).code
    } catch (err) {
        SWCPrintError(err)
    }

    await EasyFS.writeFileAndPath(file.full, result)
    await deps.updateDep(file)
}

export function compileJS(file: PPath, deps: DepCreator) {
    return compileScript(file, deps)
}

export function compileTS(file: PPath, deps: DepCreator) {
    return compileScript(file, deps, { syntax: 'typescript', decorators: true })
}

export function compileJSX(file: PPath, deps: DepCreator) {
    return compileScript(file, deps, { syntax: 'ecmascript', jsx: true }, 'JSXOptions')
}

export function compileTSX(file: PPath, deps: DepCreator) {
    return compileScript(file, deps, { syntax: 'typescript', tsx: true, decorators: true }, 'TSXOptions')
}