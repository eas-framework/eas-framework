import RazorSyntax from './RazorSyntax.js';
import JTags from './JsonTags.js';
export default async function GetSyntax(CompileType) {
    let func;
    switch (CompileType.name || CompileType) {
        case "Razor":
            func = RazorSyntax;
            break;
        case "JTags":
            func = JTags;
            break;
    }
    return func;
}
