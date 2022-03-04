import StringTracker from '../../EasyDebug/StringTracker';
import { RazorToEJS } from '../../CompileCode/BaseReader/Reader';

const addWriteMap = {
    "include": "await ",
    "import": "await "
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