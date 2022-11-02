import {fileURLToPath, pathToFileURL} from 'node:url';

export function getFullPath(relative: string, fromPath: string){
    const fullURL = new URL(relative, pathToFileURL(fromPath));
    return fileURLToPath(fullURL);
}
