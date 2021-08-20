import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, BuildInComponent, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';
import { compileValues, makeValidationJSON } from './serv-connect/index';

const serveScript = '/serv/connect.js';

function template(name: string) {
    return `function ${name}(...args){return connector("${name}", args)}`;
}

export default async function BuildCode(type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, isDebug: boolean, { parseDataTagFunc, SomePlugins }, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    const { getValue } = parseDataTagFunc(dataTag),
        name = getValue('name'),
        sendTo = getValue('sendTo'),
        validator: string = getValue('validate');

    let message = getValue('message');

    if (message == null) {
        message = isDebug && !SomePlugins("SafeDebug");
    }

    sessionInfo.scriptURLSet.add(serveScript);

    sessionInfo.script += template(name);

    sessionInfo.connectorArray.push({
        type: 'connect',
        name,
        sendTo,
        message: message != null,
        validator: validator && validator.split(',').map(x => x.trim())
    });

    return {
        compiledString: BetweenTagData,
        checkComponents: true
    }
}

export function addFinalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap) {
    if (!sessionInfo.connectorArray.length)
        return pageData;

    let buildObject = '';

    for (const i of sessionInfo.connectorArray) {
        if (i.type != 'connect')
            continue;

        buildObject += `,{name:"${i.name}",sendTo:${i.sendTo},message:${Boolean(i.message)},validator:[${(i.validator && i.validator.map(compileValues).join(',')) ?? ''}]}`;
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

export async function handelConnector(thisPage: any, connectorArray: any[]) {
    if (!thisPage.Post?.connectorCall)
        return false;


    const have = connectorArray.find(x => x.name == thisPage.Post.connectorCall.name);

    if (!have)
        return false;


    const values = thisPage.Post.connectorCall.values;
    const isValid = have.validator && await makeValidationJSON(values, have.validator);

    thisPage.setResponse('');

    if (!have.validator || isValid === true) {
        const obj = await have.sendTo(...values);

        thisPage.Response.setHeader('Content-Type', 'application/json');
        thisPage.Response.end(JSON.stringify(obj));

    } else if (have.message)
        thisPage.Response.json({
            error: (<any>isValid).shift()
        });
    else
        thisPage.Response.status(400);

    return true;
}