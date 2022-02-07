import RazorSyntax from './RazorSyntax'

export default async function GetSyntax(CompileType: any) {
    let func: any;
    switch (CompileType.name || CompileType) {
        case "Razor":
            func = RazorSyntax;
            break;
    }
    return func;
}