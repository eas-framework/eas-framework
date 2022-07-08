import PPath from '../../Settings/PPath';
import importAlias, { aliasNames } from './Alias';
import importByExtension, { customTypes } from './Extension/index';

export function isCustomPackage(name: string){
    return aliasNames.includes(name) 
}

export function isCustomFile(file: PPath){
    return customTypes.includes(
        file.ext.substring(1)
    )
}

export function customImportPackage(name: string) {
        return importAlias(name)
}

export function customImportFile(location: PPath){
    return importByExtension(location);
} 