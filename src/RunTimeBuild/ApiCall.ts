import RequireFile from './ImportFileRuntime';
import { getTypes } from './SearchFileSystem';
import { CutTheLast, trimType } from '../StringMethods/Splitting';
import path from 'path';
import EasyFs from '../OutputInput/EasyFs';
import { GetPlugin } from '../CompileCode/InsertModels';
import { print } from '../OutputInput/Console';

type apiInfo = {
    pathSplit: number,
    depsMap: { [key: string]: any }
}

const apiStaticMap: { [key: string]: apiInfo } = {};

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
        await nextPrase();


        return await MakeCall(
            await RequireFile('/' + staticPath, '', getTypes.Static, dataInfo.depsMap, isDebug),
            Request,
            Response,
            url.substring(staticPath.length - 6),
            isDebug
        );
    }
}

const banWords = ['validateURL', 'validateFunc', 'func'];
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

async function MakeCall(fileModule: any, Request: any, Response: any, urlFrom: string, isDebug: boolean) {
    const method = Request.method.toLowerCase();
    let methodObj = fileModule[method] || fileModule.default[method];
    let nestedURL = findBestUrlObject(methodObj, urlFrom);

    while ((nestedURL = findBestUrlObject(methodObj, urlFrom))) {
        urlFrom = trimType('/', urlFrom.substring(nestedURL.length));
        methodObj = methodObj[nestedURL];
    }

    if (!methodObj.func)
        return false;

    const leftData = urlFrom.split('/');
    const urlData = [];

    const allowErrorInfo = !GetPlugin("SafeDebug") && isDebug, makeMassage = (e: any) => (isDebug ? print.error(e): null)  + (allowErrorInfo ? `, message: ${e.message}` : '');

    let error: string;
    if (methodObj.validateURL) {
        for (const [index, validate] of Object.entries(methodObj.validateURL)) {
            let value = leftData[index];

            let pushData = value, resData = true;
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
                    if (typeof validate == 'function') {
                        try {
                            const makeValid = await validate(value, Request, Response);
                            if (makeValid && typeof makeValid == 'object') {
                                resData = makeValid.valid;
                                pushData = makeValid.parse ?? value;
                            } else
                                resData = makeValid;

                        } catch (e) {
                            error = 'Error on function validator, filed - ' + makeMassage(e);
                        }
                    }


                    if (validate instanceof RegExp)
                        resData = validate.test(value);
            }

            if (error || !resData) {
                error = 'Error validate filed - ' + value
                break;
            }

            urlData.push(pushData);
        }
    } else
        urlData.push(...leftData);

    if (methodObj.validateFunc) {
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

    let apiResponse: any;
    let newResponse: any = {};
    try {
        apiResponse = await methodObj.func(Request, Response, urlData, leftData);
    } catch (e) {
        if (allowErrorInfo)
            newResponse = { error: e.message }
        else
            newResponse = { error: '500 - Internal Server Error' };
    }

    if (apiResponse) {
        if (typeof apiResponse == 'object')
            newResponse = apiResponse;
        else if (typeof apiResponse == 'string')
            newResponse = { text: apiResponse };
    }

    return Response.json(newResponse);
}