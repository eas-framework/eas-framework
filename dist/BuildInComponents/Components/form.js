import StringTracker from '../../EasyDebug/StringTracker.js';
import { v4 as uuid } from 'uuid';
import { compileValues, makeValidationJSON, parseValues } from './serv-connect/index.js';
import { SplitFirst } from '../../StringMethods/Splitting.js';
export default async function BuildCode(path, pathName, LastSmallPath, type, dataTag, BetweenTagData, dependenceObject, isDebug, InsertComponent, buildScript, sessionInfo) {
    const sendTo = dataTag.remove('sendTo').trim();
    if (!sendTo) // special action not found
        return {
            compiledString: new StringTracker(type.DefaultInfoText).Plus$ `<form${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)}</form>`,
            checkComponents: true
        };
    const name = dataTag.remove('name').trim() || uuid(), validator = dataTag.remove('validate'), notValid = dataTag.remove('notValid'), responseSafe = dataTag.have('safe');
    let message = dataTag.have('message'); // show error message
    if (!message)
        message = isDebug && !InsertComponent.SomePlugins("SafeDebug");
    const order = [];
    const validatorArray = validator && validator.split(',').map(x => {
        const split = SplitFirst(':', x.trim());
        if (split.length > 1)
            order.push(split.shift());
        return split.pop();
    });
    sessionInfo.connectorArray.push({
        type: "form",
        name,
        sendTo,
        validator: validatorArray,
        order: order.length && order,
        notValid,
        message,
        responseSafe
    });
    if (!dataTag.have('method')) {
        dataTag.push({
            n: new StringTracker(null, 'method'),
            v: new StringTracker(null, 'post')
        });
    }
    const compiledString = new StringTracker(type.DefaultInfoText).Plus$ `<%
@?ConnectHereForm(${sendTo});
%><form${InsertComponent.ReBuildTagData(BetweenTagData.DefaultInfoText, dataTag)}>
    <input type="hidden" name="connectorFormCall" value="${name}"/>${await InsertComponent.StartReplace(BetweenTagData, pathName, path, LastSmallPath, isDebug, dependenceObject, buildScript, sessionInfo)}</form>`;
    return {
        compiledString,
        checkComponents: false
    };
}
export function addFinalizeBuild(pageData, sessionInfo) {
    if (!sessionInfo.connectorArray.length)
        return pageData;
    for (const i of sessionInfo.connectorArray) {
        if (i.type != 'form')
            continue;
        const sendToUnicode = new StringTracker(null, i.sendTo).unicode.eq;
        const connect = new RegExp(`@ConnectHereForm\\([ ]*${sendToUnicode}[ ]*\\)(;?)`), connectDefault = new RegExp(`@\\?ConnectHereForm\\([ ]*${sendToUnicode}[ ]*\\)(;?)`);
        let counter = 0;
        const scriptData = data => {
            counter++;
            return new StringTracker(data[0].StartInfo).Plus$ `
                if(Post?.connectorFormCall == "${i.name}"){
                    await handelConnector("form", page, 
                        {
                            sendTo:${i.sendTo},
                            notValid: ${i.notValid || 'null'},
                            validator:[${i.validator?.map?.(compileValues)?.join(',') ?? ''}],
                            order: [${i.order?.map?.(item => `"${item}"`)?.join(',') ?? ''}],
                            message:${i.message},
                            safe:${i.responseSafe}
                        }
                    );
                }`;
        };
        pageData = pageData.replacer(connect, scriptData);
        if (counter)
            pageData = pageData.replace(connectDefault, ''); // deleting default
        else
            pageData = pageData.replacer(connectDefault, scriptData);
    }
    return pageData;
}
export async function handelConnector(thisPage, connectorInfo) {
    delete thisPage.Post.connectorFormCall;
    let values = [];
    if (connectorInfo.order.length) // push values by specific order
        for (const i of connectorInfo.order)
            values.push(thisPage.Post[i]);
    else
        values.push(...Object.values(thisPage.Post));
    let isValid = true;
    if (connectorInfo.validator.length) { // validate values
        values = parseValues(values, connectorInfo.validator);
        isValid = await makeValidationJSON(values, connectorInfo.validator);
    }
    let response;
    if (isValid === true)
        response = await connectorInfo.sendTo(...values);
    else if (connectorInfo.notValid)
        response = await connectorInfo.notValid(...isValid);
    if (response)
        if (connectorInfo.safe)
            thisPage.writeSafe(response);
        else
            thisPage.write(response);
    else if (connectorInfo.message)
        thisPage.writeSafe(isValid[0]);
}
//# sourceMappingURL=form.js.map