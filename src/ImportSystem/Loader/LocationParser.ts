import path from "node:path";
import {GlobalSettings} from "../../Settings/GlobalSettings.js";
import PPath from "../../Settings/PPath.js";
import {directories} from "../../Settings/ProjectConsts.js";
import {startSep} from "../unit.js";

export type location = { type: 'package', location: string } | { type: 'file', location: PPath }

const DEFAULT_LOCATION = directories.Locate.static;

export function locationParser(file: string, lastLocation: PPath, baseLocation = DEFAULT_LOCATION): location {
    file = addPathAlias(file);

    if (file.at(0) == '.') {
        return {
            type: 'file',
            location: lastLocation.clone().join('..', file)
        };
    } else if (startSep(file)) {
        return {
            type: 'file',
            location: new PPath(
                path.join(baseLocation.virtualName, file.slice(1))
            )
        };
    }

    return {
        type: 'package',
        location: file
    };
}


/**
 * It takes a file path and replaces any path aliases with their actual path
 * @param {string} file - The file path to be converted.
 * @returns The file path with the alias replaced with the value.
 */
function addPathAlias(file: string) {
    for (const alias in GlobalSettings.general.pathAlias) {
        if (file.startsWith(alias)) {
            const value = GlobalSettings.general.pathAlias[alias];
            file = path.join(value, file.slice(alias.length));
        }
    }

    return file;
}