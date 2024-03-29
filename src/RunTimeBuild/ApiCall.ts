import RequireFile from './ImportFileRuntime';
import { getTypes } from './SearchFileSystem';
import { CutTheLast, trimType, SplitFirst } from '../StringMethods/Splitting';
import path from 'path';
import EasyFs from '../OutputInput/EasyFs';
import { GetPlugin } from '../CompileCode/InsertModels';
import { print } from '../OutputInput/Console';
import http from 'http';

// -- start of fetch file + cache --

type apiInfo = {
    pathSplit: number,
    depsMap: { [key: string]: any }
}

const apiStaticMap: { [key: string]: apiInfo } = {};

/**
 * Given a url, return the static path and data info if the url is in the static map
 * @param {string} url - The url that the user is requesting.
 * @param {number} pathSplit - the number of slashes in the url.
 * @returns The return value is an object with two properties:
 */
function getApiFromMap(url: string, pathSplit: number) {
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

/**
 * Find the API file for a given URL
 * @param {string} url - The url of the API.
 * @returns The path to the API file.
 */
async function findApiPath(url: string) {

    while (url.length) {
        const startPath = path.join(getTypes.Static[0], url + '.api');
        const makePromise = async (type: string) => (await EasyFs.existsFile(startPath + '.' + type) && type);

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

export default async function (Request: any, Response: any, url: string, isDebug: boolean, nextPrase: () => Promise<any>): Promise<boolean> {
    const pathSplit = url.split('/').length;
    let { staticPath, dataInfo } = getApiFromMap(url, pathSplit);

    if (!dataInfo) {
        staticPath = await findApiPath(url);

        if (staticPath) {
            dataInfo = {
                pathSplit,
                depsMap: {}
            }

            apiStaticMap[staticPath] = dataInfo;
        }
    }

    if (dataInfo) {
        return await MakeCall(
            await RequireFile('/' + staticPath, 'api-call', '', getTypes.Static, dataInfo.depsMap, isDebug),
            Request,
            Response,
            url.substring(staticPath.length - 6),
            isDebug,
            nextPrase
        );
    }
}
// -- end of fetch file --
const banWords = ['validateURL', 'validateFunc', 'func', 'define', ...http.METHODS];
/**
 * Find the Best Path
 */
function findBestUrlObject(obj: any, urlFrom: string) {
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
async function parseURLData(validate: any, value: any, Request: any, Response: any, makeMassage: (e: any) => string) {
    let pushData = value, resData = true, error: string;

    switch (validate) {
        case Number:
        case parseFloat:
        case parseInt:
            pushData = (<any>validate)(value);
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
                    } else
                        resData = makeValid;

                } catch (e) {
                    error = 'Error on function validator, field - ' + makeMassage(e);
                }
            }


            if (validate instanceof RegExp)
                resData = validate.test(value);
    }

    if (!resData)
        error = 'Validation error with value "' + value + '"';

    return [error, pushData];
}

/**
 * It takes the URL data and parses it into an object.
 * @param {any} obj - the object that contains the URL definition
 * @param {string} urlFrom - The URL that was passed to the server.
 * @param {any} defineObject - All the definitions that has been found
 * @param {any} Request - The request object.
 * @param {any} Response - The response object.
 * @param makeMassage - Create an error message
 * @returns A string or an object with an error property.
 */
async function makeDefinition(obj: any, urlFrom: string, defineObject: any, Request: any, Response: any, makeMassage: (e: any) => string) {
    if (!obj.define)
        return urlFrom;

    const validateFunc = obj.define.validateFunc;
    obj.define.validateFunc = null;
    delete obj.define.validateFunc;

    for (const name in obj.define) {
        const [dataSlash, nextUrlFrom] = SplitFirst('/', urlFrom);
        urlFrom = nextUrlFrom;

        const [error, newData] = await parseURLData(obj.define[name], dataSlash, Request, Response, makeMassage);

        if(error)
            return {error};
        
        defineObject[name] = newData;
    }

    if (validateFunc) {
        let validate: any;
        try {
            validate = await validateFunc(defineObject, Request, Response);
        } catch (e) {
            validate = 'Error on function validator' + makeMassage(e);
        }

        if(!validate || typeof validate == 'string'){
            return {error: typeof validate == 'string' ? validate: 'Error validating URL'};
        }
    }

    return urlFrom || '';
}
/**
 * The function will parse the url and find the best match for the url
 * @param {any} fileModule - the module that contains the method that you want to call.
 * @param {any} Request - The request object.
 * @param {any} Response - The response object.
 * @param {string} urlFrom - the url that the user requested.
 * @param {boolean} isDebug - boolean,
 * @param nextPrase - () => Promise<any>
 * @returns a boolean value. If the function returns true, the request is processed. If the function
 * returns false, the request is not processed.
 */
async function MakeCall(fileModule: any, Request: any, Response: any, urlFrom: string, isDebug: boolean, nextPrase: () => Promise<any>) {
    const allowErrorInfo = !GetPlugin("SafeDebug") && isDebug, makeMassage = (e: any) => (isDebug ? print.error(e) : null) + (allowErrorInfo ? `, message: ${e.message}` : '');
    
    const method = Request.method;
    let methodObj = fileModule[method] || fileModule.default[method]; //Loading the module by method
    let haveMethod = true;

    if(!methodObj){
        haveMethod = false;
        methodObj = fileModule.default || fileModule;
    }

    const baseMethod = methodObj;
    const defineObject = {};

    let nestedURL: string;

    do { //parse the url path
        if(nestedURL){
            methodObj = methodObj[nestedURL];
            urlFrom = trimType('/', urlFrom.substring(nestedURL.length));
        }
        
        const dataDefine = await makeDefinition(methodObj, urlFrom, defineObject, Request, Response, makeMassage);
        if((<any>dataDefine).error) return Response.json(dataDefine);

        urlFrom = <string>dataDefine;
    } while(nestedURL = findBestUrlObject(methodObj, urlFrom));

    methodObj = methodObj?.func && methodObj || baseMethod; // if there is an 'any' method
    if (!methodObj?.func)
        return false;

    const leftData = urlFrom ? urlFrom.split('/'): [];
    const urlData = [];

    let error: string;
    if (methodObj.validateURL) {
        for (const [index, validate] of Object.entries(methodObj.validateURL)) {
            const [errorURL, pushData] = await parseURLData(validate, leftData[index], Request, Response, makeMassage);

            if (errorURL) {
                error = <string>errorURL;
                break;
            }

            urlData.push(pushData);
        }
    } else
        urlData.push(...leftData);


    if (!error && methodObj.validateFunc) {
        let validate: any;
        try {
            validate = await methodObj.validateFunc(leftData, Request, Response, urlData);
        } catch (e) {
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
    let apiResponse: any;
    try {
        apiResponse = await methodObj.func(Request, Response, urlData, defineObject, leftData);
    } catch (e) {
        if (allowErrorInfo)
            apiResponse = { error: e.message }
        else
            apiResponse = { error: '500 - Internal Server Error' };
    }

    if (typeof apiResponse == 'string')
            apiResponse = { text: apiResponse };

    finalStep();  // save cookies + code

    if (apiResponse != null) // the response handled on the method
        Response.json(apiResponse);
    else if(!Response.finished) // the response is already sent
        Response.end()

    return true;
}