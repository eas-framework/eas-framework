import path from "node:path"
import { RawSourceMap } from "source-map"
import PPath from "../../Settings/PPath.js"
import { ScriptExtension } from "../../Settings/ProjectConsts.js"
import { toURLComment } from "./utils.js"

export function makeWebURLSourceStaticFile(file: string){
    return `/${file}?source=true`
}

export function makeWebURLSourcePage(file: string){
    return `/${file}.source`
}

export default class SourceComputeTrack {
    private hadOutput = false
    constructor(private content: string, public map: RawSourceMap) {
    }

    private checkOutput(){
        if(this.hadOutput){
            throw Error('You can only compute output once')
        }
        this.hadOutput = true
    }

    httpOutput() {
        this.checkOutput()
        for(const [key, source] of Object.entries(this.map.sources)){
            const ext = path.extname(source).substring(1)
            const webSource = new PPath(source).nested

            if(ScriptExtension.pagesArray.includes(ext)){ // page
                this.map.sources[key] = makeWebURLSourcePage(webSource)
            } else { // compile by extension -> sass, ts, jsx...
                this.map.sources[key] = makeWebURLSourceStaticFile(webSource)
            }
        }

        return this
    }

    localFile(saveFile: PPath){
        this.checkOutput()
        for(const [key, source] of Object.entries(this.map.sources)){
            const localSave = new PPath(source).relativeFull(saveFile.full)
            this.map.sources[key] = localSave
        }

        return this
    }

    private createMapComment(isCss?: boolean){
        return toURLComment(JSON.stringify(this.map), isCss)
    }

    dataWithSourceMap(isCss?: boolean): string {
        return this.content + this.createMapComment(isCss)
    }
}