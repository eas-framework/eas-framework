import StringTracker from '../../EasyDebug/StringTracker.js';
import { compileValues, makeValidationJSON, parseTagDataStringBoolean } from './serv-connect/index.js';
const serveScript = '/serv/connect.js';
function template(name) {
    return `function ${name}(...args){return connector("${name}", args)}`;
}
export default async function BuildCode(type, dataTag, BetweenTagData, isDebug, { SomePlugins }, sessionInfo) {
    const name = dataTag.getValue('name'), sendTo = dataTag.getValue('sendTo'), validator = dataTag.getValue('validate'), notValid = dataTag.remove('notValid');
    let message = parseTagDataStringBoolean(dataTag, 'message'); // show error message
    if (message === null)
        message = isDebug && !SomePlugins("SafeDebug");
    sessionInfo.scriptURLSet.push({
        url: serveScript,
        attributes: { async: null }
    });
    sessionInfo.script.addText(template(name));
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
    };
}
export function addFinalizeBuild(pageData, sessionInfo) {
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
        pageData.AddTextAfter(addScript);
    return pageData;
}
export async function handelConnector(thisPage, connectorArray) {
    if (!thisPage.Post?.connectorCall)
        return false;
    const have = connectorArray.find(x => x.name == thisPage.Post.connectorCall.name);
    if (!have)
        return false;
    const values = thisPage.Post.connectorCall.values;
    const isValid = have.validator.length && await makeValidationJSON(values, have.validator);
    thisPage.setResponse('');
    const betterJSON = (obj) => {
        thisPage.Response.setHeader('Content-Type', 'application/json');
        thisPage.Response.end(JSON.stringify(obj));
    };
    if (!have.validator.length || isValid === true)
        betterJSON(await have.sendTo(...values));
    else if (have.notValid)
        betterJSON(await have.notValid(...isValid));
    else if (have.message)
        betterJSON({
            error: typeof have.message == 'string' ? have.message : isValid.shift()
        });
    else
        thisPage.Response.status(400);
    return true;
}
//# sourceMappingURL=connect.js.map