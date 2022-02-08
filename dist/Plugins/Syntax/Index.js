import RazorSyntax from './RazorSyntax.js';
export default async function GetSyntax(CompileType) {
    let func;
    switch (CompileType.name || CompileType) {
        case "Razor":
            func = RazorSyntax;
            break;
    }
    return func;
}
//# sourceMappingURL=Index.js.map