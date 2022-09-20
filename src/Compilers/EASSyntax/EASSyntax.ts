import { Options as TransformOptions } from '@swc/core';
import path from 'node:path';
import { SystemData } from '../../Settings/ProjectConsts.js';

const PLUGIN_URL = path.join(SystemData, '..', 'static', 'wasm', 'easSyntax', 'build.wasm')
export async function addEASPlugin(options: TransformOptions, {transformStopToReturn = false} = {}) {
    options.jsc.experimental = {
        keepImportAssertions: true,
        plugins: [
            [
                PLUGIN_URL,
                {
                    importMethod: "require",
                    stopMethod: transformStopToReturn ? "stop": "",
                    stopMethodToKeyword: "return"
                }
            ]
        ]
    }
}