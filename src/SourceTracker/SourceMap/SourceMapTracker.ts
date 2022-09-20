import { SourceMapGenerator, RawSourceMap, SourceMapConsumer } from "source-map"
import PPath from "../../Settings/PPath.js"
import StringTracker from "../StringTracker/StringTracker.js"
import { backToOriginal } from "./SourceMapLoad.js"
import { GlobalSettings } from "../../Settings/GlobalSettings.js"
import STToSourceMapCompute from "./StringTrackerToSourceMap.js"

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