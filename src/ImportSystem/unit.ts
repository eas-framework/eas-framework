import path from "node:path"
import PPath from "../Settings/PPath"

type location = {type: 'package', location: string} | {type: 'file', location: string, ext: string}

export function locationParser(file: string, relative: string, addExt: string): location {
 
}

function locationConnector(file: string, lastLocation: string, startLocation: string){
    if(file.at(0) == '.'){
        return path.join(lastLocation, '..', file)
    }
    return path.join(startLocation, file)
}

export function locationConnectorPPath(file: string, lastLocation: PPath){
    const location = locationConnector(file, lastLocation.full, lastLocation.locate.source)
    return PPath.fromFull(location)
}