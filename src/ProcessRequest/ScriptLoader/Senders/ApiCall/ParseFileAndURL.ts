import PPath from '../../../../Settings/PPath.js';
import {FileImporter} from '../../../../ImportSystem/Loader/index.js';
import RequestWrapperAPI from './ApiRequestWrapper.js';
import {extractValue} from '../utils.js';
import {funcTryCatch, funcValidation, URLValidateStep} from './Validate.js';
import {GlobalSettings} from '../../../../Settings/GlobalSettings.js';
import RequestParser from '../../RequestParser.js';

function importFile(file: PPath) {
    return new FileImporter(file).createImport();
}

type APIURLInfo = { file: PPath, original: PPath };
export default async function parseFileAndURL(parser: RequestParser, {file, original}: APIURLInfo) {
    const module = await importFile(file);
    const wrapperAPI = new RequestWrapperAPI(parser.wrapper, module.default ?? module);
    wrapperAPI.setWorkingPath(original);

    let counter = 0;
    while (!wrapperAPI.APIError && !wrapperAPI.APIResponse && wrapperAPI.module) {
        await processDefine(wrapperAPI);
        if (await executeAPI(wrapperAPI, parser)) {
            break;
        }

        tryToGetMethod(wrapperAPI) || getNextURLStep(wrapperAPI);
    }

    if (wrapperAPI.APIError || wrapperAPI.APIResponse) {
        parser.wrapper.res.json(wrapperAPI.APIError || wrapperAPI.APIResponse);
        return true;
    }
    return false;
}

function tryToGetMethod(wrapper: RequestWrapperAPI) {
    const method = wrapper.request.req.method;
    const value = wrapper.module[method];

    if (value) {
        wrapper.module = value;
        return true;
    }
}

function getNextURLStep(wrapper: RequestWrapperAPI) {
    const step = wrapper.nextPathStep();
    wrapper.module = wrapper.module[step];
}

const VALIDATE_METHOD = 'validateFunc';

async function processDefine(wrapper: RequestWrapperAPI) {
    const define = wrapper.module?.define;
    if (!define) {
        return;
    }

    const validateFunc = extractValue(define, VALIDATE_METHOD);
    for (const name in define) {
        const validate = define[name];
        const pathStepValue = wrapper.nextPathStep();
        const {thisError, parsedValue} = await URLValidateStep(validate, pathStepValue, wrapper);

        if (thisError) {
            return processAPIError(thisError, pathStepValue, wrapper);
        }

        wrapper.defineObject[name] = parsedValue;
    }

    if (validateFunc) {
        const {thisError} = await funcValidation(validateFunc, wrapper.defineObject, wrapper);
        if (thisError) {
            return processAPIError(thisError, 'General validator: ' + VALIDATE_METHOD, wrapper);
        }
    }
}

const EXECUTE_API_METHOD = 'func';

async function executeAPI(wrapper: RequestWrapperAPI, parser: RequestParser) {
    const func = wrapper.module?.[EXECUTE_API_METHOD];
    if (!func) {
        return false;
    }

    await parser.parse();
    const {error, value} = await funcTryCatch(func, wrapper.defineObject, wrapper);
    await parser.finish();

    if (error) {
        processAPIError(GlobalSettings.development ? error.message : '500 - Server Error', 'API method', wrapper);
    }

    if (typeof value === 'string') {
        wrapper.APIResponse = {message: value};
    } else {
        wrapper.APIResponse = value ?? {message: 'ok'};
    }

    return true;
}

function processAPIError(textError: string, value: string, wrapper: RequestWrapperAPI) {
    wrapper.APIError = {
        error: textError || true,
        value,
        urlStep: wrapper.workingPathCount
    };
}