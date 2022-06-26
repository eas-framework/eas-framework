import { SourceMapGenerator, RawSourceMap, SourceMapConsumer } from "source-map"
import path from 'node:path'
import { fileURLToPath } from "node:url"
import { ScriptExtension } from "../../Settings/ProjectConsts"
import { toURLComment } from "./utils"
import PPath from "../../Settings/PPath"
import StringTracker from "../StringTracker/StringTracker"
import { backToOriginal } from "./SourceMapLoad"
import { GlobalSettings } from "../../Settings/GlobalSettings"
import STToSourceMapCompute from "./StringTrackerToSourceMap"
import SourceComputeTrack from "./SourceComputeTrack"

export default class SourceMapTracker {
    private mainTracer = new StringTracker()

    constructor() {

    }

    addST(st: StringTracker) {
        this.mainTracer.plus(st)
    }

    addText(text: string) {
        this.mainTracer.addTextAfter(text)
    }


    async addSTWithMap(st: StringTracker, map: RawSourceMap, code: string) {
        if (!GlobalSettings.development) {
            return this.addText(code)
        }

        this.addST(
            await backToOriginal(st, code, map)
        )
    }

    computeData(file: PPath){
        return STToSourceMapCompute(this.mainTracer, file)
    }

    clone(){
        const clone = new SourceMapTracker()
        clone.mainTracer = this.mainTracer.clone()
        return clone
    }

}