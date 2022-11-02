import RequestWrapperAPI from './ApiRequestWrapper.js';

const BOOLEAN_OPTIONS = ['true', 'false'];

export async function URLValidateStep(validate, value, wrapper: RequestWrapperAPI) {
    let thisError: false | string;
    let parsedValue = value;
    let otherValue = false;

    switch (validate) {
        case 'any':
            break;
        case Number:
        case parseFloat:
        case parseInt:
            parsedValue = (<any>validate)(value);
            thisError = isNaN(parsedValue) && 'Value is not a number';
            break;
        case Boolean:
            value = value.toLowerCase();
            thisError = !BOOLEAN_OPTIONS.includes(value) && `Boolean can be only 'true' of 'false'`;
            value = value === 'true';
            break;
        default:
            otherValue = true;
    }

    if (otherValue) {
        if (Array.isArray(validate)) {
            thisError = !validate.includes(value) && `Value dos not one of: ${JSON.stringify(validate)}`;
        }

        if (validate instanceof RegExp) {
            thisError = !validate.test(value) && `Value dos not math the regex: ${validate}`;
        }

        if (typeof validate === 'function') {
            const {parsedValue: valueReturn, thisError: error} = await funcValidation(validate, value, wrapper);
            parsedValue = valueReturn;
            thisError = error;
        }
    }

    return {thisError, parsedValue};
}


export async function funcTryCatch(func: Function, value: any, wrapper: RequestWrapperAPI){
    try {
        const validateResponse = await func(value, wrapper.request.req, wrapper.request.res);
        return {value: validateResponse};
    } catch (error) {
        return {error};
    }
}

export async function funcValidation(func: Function, value: any, wrapper: RequestWrapperAPI){
    let thisError: false | string;
    let parsedValue = value;

    const {value: validateResponse, error} = await funcTryCatch(func, value, wrapper);
    if(error){
        thisError = 'Error on validator function';
    } else {

        if ((validateResponse.value || validateResponse?.error) !== null) {
            thisError = validateResponse?.error ?? false;
            parsedValue = validateResponse.value;
        } else {
            thisError = typeof validateResponse === 'boolean' ? !validateResponse : validateResponse;
        }
    }

    return {thisError, parsedValue};
}

