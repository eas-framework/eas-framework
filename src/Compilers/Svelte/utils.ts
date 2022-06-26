import { RawSourceMap } from "source-map";
import PPath from "../../Settings/PPath";
import { makeWebURLSourceStaticFile } from "../../SourceTracker/SourceMap/SourceComputeTrack";
import { toURLComment } from "../../SourceTracker/SourceMap/utils";

export function updateSourcesForWeb(map: RawSourceMap){
    map.sources = map.sources.map(file => makeWebURLSourceStaticFile(file))
}

export function updateSourcesForLocal(map: RawSourceMap, originalFile: PPath){
    map.sources = map.sources.map(file => originalFile.relativeCompile(new PPath(file).full))
}

export function addSourceMapComment(data: {map: RawSourceMap, code: string}, isCss?: boolean){
    if(data?.code && data?.map){
        data.code += toURLComment(data.map.toString(), isCss)
    }
}