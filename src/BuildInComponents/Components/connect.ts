import StringTracker from '../../EasyDebug/StringTracker';
import { tagDataObject, StringNumberMap, BuildInComponent, BuildScriptWithoutModule, StringAnyMap } from '../../CompileCode/XMLHelpers/CompileTypes';

const serveScript = `<script src="/serv/connect.js"></script>`;

function template(name: string) {
    return `
    <script defer>
        function ${name}(...args){
            return connector("${name}", args);
        }
    </script>
    `;
}


export default async function BuildCode(type: StringTracker, dataTag: tagDataObject[], BetweenTagData: StringTracker, isDebug:boolean, InsertComponent: any, sessionInfo: StringAnyMap): Promise<BuildInComponent> {
    const name = InsertComponent.getFromDataTag(dataTag, 'name'),
    sendTo = InsertComponent.getFromDataTag(dataTag, 'sendTo'),
    validator: string = InsertComponent.getFromDataTag(dataTag, 'validate');

    let message = InsertComponent.getFromDataTag(dataTag, 'message');

    if(message == null){
        message = isDebug && !InsertComponent.SomePlugins("SafeDebug");
    }

    let tagScript = BetweenTagData.eq + template(name);

    if (!sessionInfo.clientServeConnection) {
        sessionInfo.clientServeConnection = true;

        tagScript = serveScript + tagScript;
    }

    sessionInfo.connectorArray.push({
        name,
        sendTo,
        message: message != null,
        validator: validator && validator.split(',').map(x=> x.trim())
    });

    return {
        compiledString: new StringTracker(type.DefaultInfoText, tagScript),
        checkComponents: true
    }
}

const builtInConnection = ['string', 'text', 'number', 'num', 'integer', 'int', 'boolean', 'bool'];

export function addFinalizeBuild(pageData: StringTracker, sessionInfo: StringAnyMap) {
    if (sessionInfo.connectorArray.length) {
        let buildObject = '';

        for(const i of sessionInfo.connectorArray){
            buildObject += `,{name:"${i.name}",sendTo:${i.sendTo},message:${Boolean(i.message)},validator:[${i.validator.map(validFunc => {
                return builtInConnection.includes(validFunc) ? `"${validFunc}"`: validFunc
            })}]}`;
        }

        buildObject =  `[${buildObject.substring(1)}]`;

        const addScript = `
        if(Post?.connectorCall){
            if(await handelConnector(this, ${buildObject})){
                return;
            }
        }`;
        
        if(pageData.includes("@ConnectHere")){
            pageData = pageData.replacer(/@ConnectHere(;?)/, () => new StringTracker(StringTracker.emptyInfo, addScript));
        } else {
            pageData.AddTextAfter(addScript);
        }
    }

    return pageData;
}

async function makeValidation(args: any[], validatorArray: any[]): Promise<boolean | string> {

    for (const i in validatorArray) {
        const element = validatorArray[i];
        let returnNow = false;

        let isDefault = false;
        switch (element.toLowerCase()) {
            case 'string':
            case 'text':
                returnNow = typeof args[i] !== 'string';
                break;
            case 'number':
            case 'num':
                returnNow = typeof args[i] !== 'number';
                break;
            case 'boolean':
            case 'bool':
                returnNow = typeof args[i] !== 'boolean';
                break;
            case 'integer':
            case 'int':
                returnNow = !Number.isInteger(args[i]);
                break;
            default:
                isDefault = true;
                returnNow = !await element(args[i]);
                break;
        }

        if (returnNow) {
            return `failed at ${i} filed - ${isDefault ? returnNow: 'expected ' + element}`;
        }
    }

    return true;
}

export async function handelConnector(thisPage: any, connectorArray: any[]) {
    if (!thisPage.Post?.connectorCall) {
        return false;
    }

    const have = connectorArray.find(x => x.name == thisPage.Post.connectorCall.name);

    if(!have){
        return false;
    }

    const values = thisPage.Post.connectorCall.values;
    const isValid = have.validator && await makeValidation(values, have.validator);

    thisPage.setResponse('');

    if(!have.validator || isValid === true){
        const obj = await have.sendTo(...values);
        thisPage.Response.setHeader('Content-Type', 'application/json');
        thisPage.Response.end(JSON.stringify(obj));
    } else if(have.message) {
        thisPage.Response.json({
            error: isValid
        });
    } else {
        thisPage.Response.status(400);
    }

    return true;
}