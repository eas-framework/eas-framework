import path from "node:path";
import PPath from "../Settings/PPath.js";

/**
 * It returns true if the first character of the given string is a path separator
 * @param {string} file - The file path to check.
 * @returns A boolean value.
 */
export function startSep(file: string) {
    return file.at(0) == path.sep || file.at(0) == path.win32.sep || file.at(0) == '~';
}

function locationConnector(file: string, lastLocation: string, startLocation: string) {
    if (file.at(0) == '.') {
        return path.join(lastLocation, '..', file);
    }

    if (startSep(file)) {
        file = file.substring(1);
    }

    return path.join(startLocation, file);
}

export function locationConnectorPPath(file: string, lastLocation: PPath) {
    const location = locationConnector(file, lastLocation.full, lastLocation.locate.source);
    return PPath.fromFull(location);
}