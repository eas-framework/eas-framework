import RazorSyntax from './RazorSyntax'
import JTags from './JsonTags'

export default async function GetSyntax(CompileType: any) {
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