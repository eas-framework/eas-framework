import StringTracker from '../../EasyDebug/StringTracker';
import { ParseBlocks, RazorToEJS, RazorToEJSMini } from '../../CompileCode/BaseReader/Reader';
import JSParser from '../../CompileCode/JSParser';
import { StringMap } from '../../CompileCode/XMLHelpers/CompileTypes';


/**
 * It takes a string, a list of blocks, a map of names to strings, and a string to add to the beginning
 * of each block, and returns a string
 * @param {StringTracker} text - The text to be parsed.
 * @param {ParseBlocks} values - The values that were parsed from the Razor file.
 * @param {StringMap} addWriteMap - This is a map of the names of the blocks to the script that will be add
 * @param [addToEJSSign] - This is the sign that will be added to the beginning of the EJS code.
 * @returns A string
 */
function RazorToEJSBuilder(text: StringTracker, values: ParseBlocks, addWriteMap: StringMap, addToEJSSign = ''){
    const build = new StringTracker();

    for (const i of values) {
        const substring = text.substring(i.start, i.end);
        switch (i.name) {
            case "text":
                build.Plus(substring);
                break;
            case "script":
                build.Plus$`<%${addToEJSSign}${substring}%>`;
                break;
            case "print":
                build.Plus$`<%${addToEJSSign}=${substring}%>`;
                break;
            case "escape":
                build.Plus$`<%${addToEJSSign}:${substring}%>`;
                break;
            default:
                build.Plus$`<%${addToEJSSign + addWriteMap[i.name]}${substring}%>`;
        }
    }

    return build;
}

const addWriteMap = {
    "include": "await ",
    "import": "await ",
    "transfer": "return await "
}

export default async function ConvertSyntax(text: StringTracker, options?: any) {
    const values = await RazorToEJS(text.eq);
    return RazorToEJSBuilder(text, values, addWriteMap);
}

/**
 * ConvertSyntaxMini takes the code and a search string and convert curly brackets
 * @param {StringTracker} text - The string to be converted.
 * @param {string} find - The string to search for.
 * @param {string} addEJS - The string to add to the start of the ejs.
 * @returns A string.
 */
export async function ConvertSyntaxMini(text: StringTracker, find: string, addEJS: string) {
    const values = await RazorToEJSMini(text.eq, find);
    const build = new StringTracker();

    for (let i = 0; i < values.length; i += 4) {
        if (values[i] != values[i + 1])
            build.Plus(text.substring(values[i], values[i + 1]));
        const substring = text.substring(values[i + 2], values[i + 3]);
        build.Plus$`<%${addEJS}${substring}%>`;
    }

    build.Plus(text.substring((values.at(-1)??-1) + 1));

    return build;
}


const addWriteCompileMap = {
    "default": "attr"
}

export async function ConvertSyntaxCompile(text: StringTracker, smallPath: string, options?: any) {

    const values  = await RazorToEJS(text.eq, true);

    text = RazorToEJSBuilder(text, values, addWriteCompileMap, '*');

    const parser = new JSParser(text, smallPath, '<%*', '%>');
    await parser.findScripts();

    return parser;
}