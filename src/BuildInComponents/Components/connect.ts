import StringTracker from '../../EasyDebug/StringTracker';
import type { tagDataObjectArray, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { compileValues, makeValidationJSON, parseTagDataStringBoolean } from './serv-connect/index';
import { SessionBuild } from '../../CompileCode/Session';

const serveScript = '/serv/connect.js';

function template(name: string) {
    return `function ${name}(...args){return connector("${name}", args)}`;
}

export default async function BuildCode(type: StringTracker, dataTag: tagDataObjectArray, BetweenTagData: StringTracker, { SomePlugins }, sessionInfo: SessionBuild): Promise<BuildInComponent> {
    const name = dataTag.getValue('name'),
        sendTo = dataTag.getValue('sendTo'),
        validator: string = dataTag.getValue('validate'),
        notValid: string = dataTag.remove('notValid');

    let message = parseTagDataStringBoolean(dataTag, 'message'); // show error message
    if (message === null)
        message = sessionInfo.debug && !SomePlugins("SafeDebug");

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

    return {
        compiledString: BetweenTagData,
        checkComponents: true
    }
}

export function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild) {
    if (!sessionInfo.connectorArray.length)
        return pageData;

    let buildObject = '';

    for (const i of sessionInfo.connectorArray) {
        if (i.type != 'connect')
            continue;

        buildObject += `,
        {
            name:"${i.name}",
            sendTo:${i.sendTo},
            notValid: ${i.notValid || 'null'},
            message:${typeof i.message == 'string' ? `"${i.message}"` : i.message},
            validator:[${(i.validator && i.validator.map(compileValues).join(',')) || ''}]
        }`;
    }

    buildObject = `[${buildObject.substring(1)}]`;

    const addScript = `
        if(Post?.connectorCall){
            if(await handelConnector("connect", page, ${buildObject})){
                return;
            }
        }`;

    if (pageData.includes("@ConnectHere"))
        pageData = pageData.replacer(/@ConnectHere(;?)/, () => new StringTracker(null, addScript));
    else
        pageData.AddTextAfterNoTrack(addScript);

    return pageData;
}

export async function handelConnector(thisPage: any, connectorArray: any[]) {
    if (!thisPage.Post?.connectorCall)
        return false;


    const have = connectorArray.find(x => x.name == thisPage.Post.connectorCall.name);

    if (!have)
        return false;


    const values = thisPage.Post.connectorCall.values;
    const isValid = have.validator.length && await makeValidationJSON(values, have.validator);

    thisPage.setResponse('');

    const betterJSON = (obj: any) => {
        thisPage.Response.setHeader('Content-Type', 'application/json');
        thisPage.Response.end(JSON.stringify(obj));
    }

    if (!have.validator.length || isValid === true)
        betterJSON(await have.sendTo(...values));

    else if (have.notValid)
        betterJSON(await have.notValid(...<any>isValid));

    else if (have.message)
        betterJSON({
            error: typeof have.message == 'string' ? have.message : (<any>isValid).shift()
        });
    else
        thisPage.Response.status(400);

    return true;
}