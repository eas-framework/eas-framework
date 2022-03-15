import StringTracker from '../../EasyDebug/StringTracker';
import { RazorToEJS, RazorToEJSMini } from '../../CompileCode/BaseReader/Reader';


const addWriteMap = {
    "include": "await ",
    "import": "await ",
    "transfer": "return await "
}

export default async function ConvertSyntax(text: StringTracker, options?: any) {
    const values = await RazorToEJS(text.eq);
    const build = new StringTracker();

    for (const i of values) {
        const substring = text.substring(i.start, i.end);
        switch (i.name) {
            case "text":
                build.Plus(substring);
                break;
            case "script":
                build.Plus$`<%${substring}%>`;
                break;
            case "print":
                build.Plus$`<%=${substring}%>`;
                break;
            case "escape":
                build.Plus$`<%:${substring}%>`;
                break;
            default:
                build.Plus$`<%${addWriteMap[i.name]}${substring}%>`;
        }
    }

    return build;
}

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