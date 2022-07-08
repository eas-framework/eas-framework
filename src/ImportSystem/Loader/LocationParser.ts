import path from "node:path"
import PPath from "../../Settings/PPath"
import { directories } from "../../Settings/ProjectConsts"
import { startSep } from "../unit"

export type location = { type: 'package', location: string } | { type: 'file', location: PPath }

const DEFAULT_LOCATION = directories.Locate.Static
export function locationParser(file: string, lastLocation: PPath): location {
    if (file.at(0) == '.') {
        return {
            type: 'file',
            location: new PPath(
                path.join(DEFAULT_LOCATION.virtualName, lastLocation.nested, '..', file)
            )
        }
    } else if (startSep(file)) {
        return {
            type: 'file',
            location: new PPath(
                path.join(DEFAULT_LOCATION.virtualName, file.substring(1))
            )
        }
    }

    return {
        type: 'package',
        location: file
    }
}