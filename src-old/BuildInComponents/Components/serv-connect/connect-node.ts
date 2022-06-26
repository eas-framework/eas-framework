import { connectorInfo, SessionBuild } from "../../../CompileCode/Session";
import StringTracker from "../../../EasyDebug/StringTracker";
import { Capitalize } from "../../../ImportFiles/ForStatic/Svelte/preprocess";

export function addFinalizeBuildAnyConnection(connectName: string, connectorCall: string, connectionType: string, pageData: StringTracker, sessionInfo: SessionBuild, buildArguments: (info: connectorInfo) => string, {returnData}: {returnData?: boolean} = {}) {
    if (!sessionInfo.connectorArray.find(x => x.type == connectionType))
        return pageData;

    for (const i of sessionInfo.connectorArray) {
        if (i.type != connectionType)
            continue;

        const sendToUnicode = new StringTracker(null, i.name).unicode.eq
        const connect = new RegExp(`@${connectName}\\([ ]*${sendToUnicode}[ ]*\\)(;?)`), connectDefault = new RegExp(`@\\?${connectName}\\([ ]*${sendToUnicode}[ ]*\\)`);

        let hadReplacement = false;

        const scriptData = () => {
            hadReplacement = true
            return new StringTracker(null, `if(Post?.${connectorCall} == "${i.name}"){
                ${returnData ? 'return ': ''}await handelConnector("${connectionType}", page, 
                    ${buildArguments(i)}
                );
            }`)
        };

        pageData = pageData.replacer(connect, scriptData);

        if (hadReplacement)
            pageData = pageData.replace(connectDefault, ''); // deleting default
        else
            pageData = pageData.replacer(connectDefault, scriptData);

    }

    return pageData;
}