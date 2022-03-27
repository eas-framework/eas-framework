import StringTracker from '../../EasyDebug/StringTracker';
import { StringNumberMap, BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import { v4 as uuid } from 'uuid';
import { compileValues, makeValidationJSON, parseValues } from './serv-connect/index';
import { SplitFirst } from '../../StringMethods/Splitting';
import { SessionBuild } from '../../CompileCode/Session';
import InsertComponent from '../../CompileCode/InsertComponent';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

export default async function BuildCode(pathName: string, type: StringTracker, dataTag: TagDataParser, BetweenTagData: StringTracker, InsertComponent: InsertComponent, sessionInfo: SessionBuild): Promise<BuildInComponent> {

    const sendTo = dataTag.popAnyDefault('sendTo','').trim();

    if (!sendTo)  // special action not found
        return {
            compiledString: new StringTracker(type.DefaultInfoText).Plus$`<form${dataTag.rebuildSpace()}>${await InsertComponent.StartReplace(BetweenTagData, pathName,  sessionInfo)
                }</form>`,
            checkComponents: false
        }


    const name = dataTag.popAnyDefault('name',uuid()).trim(), validator: string = dataTag.popHaveDefault('validate'), orderDefault: string = dataTag.popHaveDefault('order'), notValid: string = dataTag.popHaveDefault('notValid'), responseSafe = dataTag.popBoolean('safe');

    const message = dataTag.popAnyDefault('message', sessionInfo.debug && !InsertComponent.SomePlugins("SafeDebug")); // show error message
    let order = [];

    const validatorArray = validator && validator.split(',').map(x => { // Checking if there is an order information, for example "prop1: string, prop3: num, prop2: bool"
        const split = SplitFirst(':', x.trim());

        if (split.length > 1)
            order.push(split.shift());

        return split.pop();
    });

    if (orderDefault)
        order = orderDefault.split(',').map(x => x.trim());

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

    dataTag.pushValue('method', 'post');

    const compiledString = new StringTracker(type.DefaultInfoText).Plus$
        `<%!
@?ConnectHereForm(${sendTo});
%><form${dataTag.rebuildSpace()}>
    <input type="hidden" name="connectorFormCall" value="${name}"/>${await InsertComponent.StartReplace(BetweenTagData, pathName, sessionInfo)}</form>`;

    return {
        compiledString,
        checkComponents: false
    }
}


export function addFinalizeBuild(pageData: StringTracker, sessionInfo: SessionBuild) {
    if (!sessionInfo.connectorArray.length)
        return pageData;

    for (const i of sessionInfo.connectorArray) {
        if (i.type != 'form')
            continue;

        const sendToUnicode = new StringTracker(null, i.sendTo).unicode.eq
        const connect = new RegExp(`@ConnectHereForm\\([ ]*${sendToUnicode}[ ]*\\)(;?)`), connectDefault = new RegExp(`@\\?ConnectHereForm\\([ ]*${sendToUnicode}[ ]*\\)(;?)`);

        let counter = 0;

        const scriptData = data => {
            counter++;
            return new StringTracker(data[0].StartInfo).Plus$
                `
                if(Post?.connectorFormCall == "${i.name}"){
                    await handelConnector("form", page, 
                        {
                            sendTo:${i.sendTo},
                            notValid: ${i.notValid || 'null'},
                            validator:[${i.validator?.map?.(compileValues)?.join(',') ?? ''}],
                            order: [${i.order?.map?.(item => `"${item}"`)?.join(',') ?? ''}],
                            message:${typeof i.message == 'string' ? `"${i.message}"` : i.message},
                            safe:${i.responseSafe}
                        }
                    );
                }`
        };

        pageData = pageData.replacer(connect, scriptData);

        if (counter)
            pageData = pageData.replace(connectDefault, ''); // deleting default
        else
            pageData = pageData.replacer(connectDefault, scriptData);

    }

    return pageData;
}

export async function handelConnector(thisPage: any, connectorInfo: any) {

    delete thisPage.Post.connectorFormCall;

    let values = [];

    if (connectorInfo.order.length) // push values by specific order
        for (const i of connectorInfo.order)
            values.push(thisPage.Post[i]);
    else
        values.push(...Object.values(thisPage.Post));


    let isValid: boolean | string[] = true;

    if (connectorInfo.validator.length) { // validate values
        values = parseValues(values, connectorInfo.validator);
        isValid = await makeValidationJSON(values, connectorInfo.validator);
    }

    let response: any;

    if (isValid === true)
        response = await connectorInfo.sendTo(...values);
    else if (connectorInfo.notValid)
        response = await connectorInfo.notValid(...<any>isValid);

    if (!isValid && !response)
        if (connectorInfo.message === true)
            thisPage.writeSafe(connectorInfo.message);
        else
            response = connectorInfo.message;

    if (response)
        if (connectorInfo.safe)
            thisPage.writeSafe(response);
        else
            thisPage.write(response);
}