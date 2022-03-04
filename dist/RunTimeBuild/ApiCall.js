import RequireFile from './ImportFileRuntime.js';
import { getTypes } from './SearchFileSystem.js';
import { CutTheLast, trimType, SplitFirst } from '../StringMethods/Splitting.js';
import path from 'path';
import EasyFs from '../OutputInput/EasyFs.js';
import { GetPlugin } from '../CompileCode/InsertModels.js';
import { print } from '../OutputInput/Console.js';
import http from 'http';
const apiStaticMap = {};
function getApiFromMap(url, pathSplit) {
    const keys = Object.keys(apiStaticMap);
    for (const i of keys) {
        const e = apiStaticMap[i];
        if (url.startsWith(i) && e.pathSplit == pathSplit)
            return {
                staticPath: i,
                dataInfo: e
            };
    }
    return {};
}
async function findApiPath(url) {
    while (url.length) {
        const startPath = path.join(getTypes.Static[0], url + '.api');
        const makePromise = async (type) => (await EasyFs.existsFile(startPath + '.' + type) && type);
        const fileType = (await Promise.all([
            makePromise('ts'),
            makePromise('js')
        ])).filter(x => x).shift();
        if (fileType)
            return url + '.api.' + fileType;
        url = CutTheLast('/', url);
    }
    return url;
}
export default async function (Request, Response, url, isDebug, nextPrase) {
    const pathSplit = url.split('/').length;
    let { staticPath, dataInfo } = getApiFromMap(url, pathSplit);
    if (!dataInfo) {
        staticPath = await findApiPath(url);
        if (staticPath) {
            dataInfo = {
                pathSplit,
                depsMap: {}
            };
            apiStaticMap[staticPath] = dataInfo;
        }
    }
    if (dataInfo) {
        return await MakeCall(await RequireFile('/' + staticPath, 'api-call', '', getTypes.Static, dataInfo.depsMap, isDebug), Request, Response, url.substring(staticPath.length - 6), isDebug, nextPrase);
    }
}
// -- end of fetch file --
const banWords = ['validateURL', 'validateFunc', 'func', 'define', ...http.METHODS];
/**
 * Find the Best Path
 */
function findBestUrlObject(obj, urlFrom) {
    let maxLength = 0, url = '';
    for (const i in obj) {
        const length = i.length;
        if (maxLength < length && urlFrom.startsWith(i) && !banWords.includes(i)) {
            maxLength = length;
            url = i;
        }
    }
    return url;
}
/**
 * Parse And Validate URL
 */
async function parseURLData(validate, value, Request, Response, makeMassage) {
    let pushData = value, resData = true, error;
    switch (validate) {
        case Number:
        case parseFloat:
        case parseInt:
            pushData = validate(value);
            resData = !isNaN(pushData);
            break;
        case Boolean:
            pushData = value != 'false';
            value = value.toLowerCase();
            resData = value == 'true' || value == 'false';
            break;
        case 'any':
            break;
        default:
            if (Array.isArray(validate))
                resData = validate.includes(value);
            if (typeof validate == 'function') {
                try {
                    const makeValid = await validate(value, Request, Response);
                    if (makeValid && typeof makeValid == 'object') {
                        resData = makeValid.valid;
                        pushData = makeValid.parse ?? value;
                    }
                    else
                        resData = makeValid;
                }
                catch (e) {
                    error = 'Error on function validator, filed - ' + makeMassage(e);
                }
            }
            if (validate instanceof RegExp)
                resData = validate.test(value);
    }
    if (!resData)
        error = 'Error validate filed - ' + value;
    return [error, pushData];
}
async function makeDefinition(obj, urlFrom, defineObject, Request, Response, makeMassage) {
    if (!obj.define)
        return urlFrom;
    const validateFunc = obj.define.validateFunc;
    obj.define.validateFunc = null;
    delete obj.define.validateFunc;
    for (const name in obj.define) {
        const [dataSlash, nextUrlFrom] = SplitFirst('/', urlFrom);
        urlFrom = nextUrlFrom;
        const [error, newData] = await parseURLData(obj.define[name], dataSlash, Request, Response, makeMassage);
        if (error)
            return { error };
        defineObject[name] = newData;
    }
    if (validateFunc) {
        let validate;
        try {
            validate = await validateFunc(defineObject, Request, Response);
        }
        catch (e) {
            validate = 'Error on function validator' + makeMassage(e);
        }
        return { error: typeof validate == 'string' ? validate : 'Error validating URL' };
    }
    return urlFrom;
}
async function MakeCall(fileModule, Request, Response, urlFrom, isDebug, nextPrase) {
    const allowErrorInfo = !GetPlugin("SafeDebug") && isDebug, makeMassage = (e) => (isDebug ? print.error(e) : null) + (allowErrorInfo ? `, message: ${e.message}` : '');
    const method = Request.method;
    let methodObj = fileModule[method] || fileModule.default[method]; //Loading the module by method
    let haveMethod = true;
    if (!methodObj) {
        haveMethod = false;
        methodObj = fileModule.default || fileModule;
    }
    const baseMethod = methodObj;
    const defineObject = {};
    const dataDefine = await makeDefinition(methodObj, urlFrom, defineObject, Request, Response, makeMassage); // root level definition
    if (dataDefine.error)
        return Response.json(dataDefine);
    urlFrom = dataDefine;
    let nestedURL = findBestUrlObject(methodObj, urlFrom);
    //parse the url path
    for (let i = 0; i < 2; i++) {
        while ((nestedURL = findBestUrlObject(methodObj, urlFrom))) {
            const dataDefine = await makeDefinition(methodObj, urlFrom, defineObject, Request, Response, makeMassage);
            if (dataDefine.error)
                return Response.json(dataDefine);
            urlFrom = dataDefine;
            urlFrom = trimType('/', urlFrom.substring(nestedURL.length));
            methodObj = methodObj[nestedURL];
        }
        if (!haveMethod) { // check if that a method
            haveMethod = true;
            methodObj = methodObj[method];
        }
    }
    methodObj = methodObj?.func && methodObj || baseMethod; // if there is an 'any' method
    if (!methodObj?.func)
        return false;
    const leftData = urlFrom.split('/');
    const urlData = [];
    let error;
    if (methodObj.validateURL) {
        for (const [index, validate] of Object.entries(methodObj.validateURL)) {
            const [errorURL, pushData] = await parseURLData(validate, leftData[index], Request, Response, makeMassage);
            if (errorURL) {
                error = errorURL;
                break;
            }
            urlData.push(pushData);
        }
    }
    else
        urlData.push(...leftData);
    if (!error && methodObj.validateFunc) {
        let validate;
        try {
            validate = await methodObj.validateFunc(leftData, Request, Response, urlData);
        }
        catch (e) {
            validate = 'Error on function validator' + makeMassage(e);
        }
        if (typeof validate == 'string')
            error = validate;
        else if (!validate)
            error = 'Error validating URL';
    }
    if (error)
        return Response.json({ error });
    const finalStep = await nextPrase(); // parse data from methods - post, get... + cookies, session...
    let apiResponse, newResponse;
    try {
        apiResponse = await methodObj.func(Request, Response, urlData, defineObject, leftData);
    }
    catch (e) {
        if (allowErrorInfo)
            newResponse = { error: e.message };
        else
            newResponse = { error: '500 - Internal Server Error' };
    }
    if (typeof apiResponse == 'string')
        newResponse = { text: apiResponse };
    else
        newResponse = apiResponse;
    finalStep(); // save cookies + code
    if (newResponse != null)
        Response.json(newResponse);
    return true;
}
//# sourceMappingURL=ApiCall.js.map