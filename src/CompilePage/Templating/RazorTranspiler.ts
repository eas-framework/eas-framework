import { StringMap } from "../../Settings/types";
import StringTracker from "../../SourceTracker/StringTracker/StringTracker";
import { RazorToEJS, RazorToEJSCompile } from "../ConnectRust/Razor";
import { ParseBlocks } from "../ConnectRust/utils";
import EJSParser from "./EJSParser";



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
        const substring = text.slice(i.start, i.end);
        switch (i.name) {
            case "text":
                build.plus(substring);
                break;
            case "script":
                build.plus$`<%${addToEJSSign}${substring}%>`;
                break;
            case "print":
                build.plus$`<%${addToEJSSign}=${substring}%>`;
                break;
            case "escape":
                build.plus$`<%${addToEJSSign}:${substring}%>`;
                break;
            default:
                build.plus$`<%${addToEJSSign + addWriteMap[i.name]}${substring}%>`;
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


const addWriteCompileMap = {
    "default": "attr"
}

export async function ConvertSyntaxCompile(text: StringTracker, options?: any) {

    const values  = await RazorToEJSCompile(text.eq);

    text = RazorToEJSBuilder(text, values, addWriteCompileMap, '*');

    const parser = new EJSParser(text, '<%*', '%>');
    await parser.findScripts();

    return parser;
}