import {locationParser} from "../ImportSystem/Loader/LocationParser.js";
import PPath from "../Settings/PPath.js";
import {directories, LocateDir} from "../Settings/ProjectConsts.js";

export function findFileImport(file: string, lastLocation: PPath, baseLocation: LocateDir, hasExtension?: string) {
    const {location, type} = locationParser(file, lastLocation, baseLocation);
    let fileLocation = location;

    if (type === 'package' || typeof fileLocation === 'string') {
        fileLocation = PPath.fromNested(directories.Locate.node_modules, fileLocation.toString());
    }

    if (hasExtension && !fileLocation.ext) {
        fileLocation.nested += '.' + hasExtension;
    }

    return fileLocation;
}