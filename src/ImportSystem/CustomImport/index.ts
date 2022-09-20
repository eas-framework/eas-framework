import PPath from '../../Settings/PPath.js';
import { StringAnyMap } from '../../Settings/types.js';
import importAlias, { aliasNames } from './Alias/index.js';
import importByExtension, { customTypes } from './Extension/index.js';

export function isCustomPackage(name: string){
    return aliasNames.includes(name) 
}

export function isCustomFile(file: PPath, options: StringAnyMap){
    return customTypes.includes(
        file.ext.substring(1)
    )
}

export function customImportPackage(name: string) {
        return importAlias(name)
}

export function customImportFile(location: PPath, options: StringAnyMap){
    return importByExtension(location, options);
} 