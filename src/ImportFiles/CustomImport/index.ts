import ImportAlias, { aliasNames } from './Alias';
import ImportByExtension, { customTypes } from './Extension/index';

export function isPathCustom(originalPath: string, extension: string) {
    return customTypes.includes(extension) || aliasNames.includes(originalPath);
}

export default async function CustomImport(originalPath: string, fullPath: string, extension: string, require: (p: string) => Promise<any>) {
    const aliasExport = await ImportAlias(originalPath);
    if (aliasExport) return aliasExport;
    return ImportByExtension(fullPath, extension);
}