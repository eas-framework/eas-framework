import StringTracker from '../../EasyDebug/StringTracker';
import type { BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { compileValues, makeValidationJSON } from './serv-connect/index';
import { connectorInfo, SessionBuild } from '../../CompileCode/Session';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';
import { addFinalizeBuildAnyConnection } from './serv-connect/connect-node';

const serveScript = '/serv/connect.js';

function template(name: string) {
    return `function ${name}(...args){return connector("${name}", args)}`;
}

export default async function BuildCode(type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, { SomePlugins }, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const name = dataTag.popHaveDefault('name'),
        sendTo = dataTag.popHaveDefault('sendTo'),
        validator = dataTag.popHaveDefault('validate'),
        notValid = dataTag.popHaveDefault('notValid');

    const message = dataTag.popAnyDefault('message', sessionInfo.debug && !SomePlugins("SafeDebug")); // show error message

    sessionInfo.script(serveScript, { async: null })
    sessionInfo.addScriptStylePage('script', dataTag, type).addText(template(name)); // add script

    sessionInfo.connectorArray.push({
        type: 'connect',
        name,
        sendTo,
        message,
        notValid,
        validator: validator && validator.split(',').map(x => x.trim())
    });

    const compiledString = BetweenTagData || new StringTracker()
    compiledString.AddTextBeforeNoTrack(`<%!@@?ConnectHere(${name})%>`)

    return {
        compiledString,
        checkComponents: true
    }
}

export function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild) {
    return addFinalizeBuildAnyConnection('ConnectHere', 'connectorCall?.name', 'connect', pageData, sessionInfo, i => {
        return `
        {
            name:"${i.name}",
            sendTo:${i.sendTo},
            notValid: ${i.notValid || 'null'},
            message:${typeof i.message == 'string' ? `"${i.message}"` : i.message},
            validator:[${(i.validator && i.validator.map(compileValues).join(',')) || ''}]
        }`
    }, {returnData: true})
}

export async function handelConnector(thisPage: any, connector: any) {
    const values = thisPage.Post.connectorCall.values;
    const isValid = connector.validator.length && await makeValidationJSON(values, connector.validator);

    thisPage.setResponse('');

    const betterJSON = (obj: any) => {
        thisPage.Response.setHeader('Content-Type', 'application/json');
        thisPage.Response.end(JSON.stringify(obj));
    }

    if (!connector.validator.length || isValid === true)
        betterJSON(await connector.sendTo(...values));

    else if (connector.notValid)
        betterJSON(await connector.notValid(...<any>isValid));

    else if (connector.message)
        betterJSON({
            error: typeof connector.message == 'string' ? connector.message : (<any>isValid).shift()
        });
    else
        thisPage.Response.status(400);

    return true;
}