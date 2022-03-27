/**
 * Given a file name and an extension, return true if the file name ends with the extension
 * @param {string} name - The name of the file.
 * @param {string} extname - the extension to check for.
 * @returns A boolean value.
 */
export function extensionIs(name: string, extname: string){
    return name.endsWith('.' + extname);
}

/**
 * Check if the file name ends with one of the given file types.
 * @param {string[]} types - an array of file extensions to match.
 * @param {string} name - The name of the file.
 * @returns A boolean value.
 */
export function isFileType(types: string[], name: string) {
    name = name.toLowerCase();

    for (const type of types) {
        if (extensionIs(name,type)) {
            return true;
        }
    }
    return false;
}

/**
 * Remove the last dot and everything after it from a string
 * @param {string} string - The string to remove the end type from.
 * @returns The string without the last character.
 */
export function RemoveEndType(string: string) {
    return string.substring(0, string.lastIndexOf('.'));
}