const numbers = ['number', 'num', 'integer', 'int'], booleans = ['boolean', 'bool'];
const builtInConnection = ['email', 'string', 'text', ...numbers, ...booleans];
const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const builtInConnectionRegex = {
    "string-length-range": [
        /^[0-9]+:[0-9]+$/,
        (validator) => validator.split(':').map(x => Number(x)),
        ([min, max], text) => text.length >= min && text.length <= max,
        "string"
    ],
    "number-range": [
        /^[0-9]+..[0-9]+$/,
        (validator) => validator.split('..').map(x => Number(x)),
        ([min, max], num) => num >= min && num <= max,
        "number"
    ],
    "multiple-choice-string": [
        /^string|text+[ ]*=>[ ]*(\|?[^|]+)+$/,
        (validator) => validator.split('=>').pop().split('|').map(x => `"${x.trim().replace(/"/gi, '\\"')}"`),
        (options, text) => options.includes(text),
        "string"
    ],
    "multiple-choice-number": [
        /^number|num|integer|int+[ ]*=>[ ]*(\|?[^|]+)+$/,
        (validator) => validator.split('=>').pop().split('|').map(x => parseFloat(x)),
        (options, num) => options.includes(num),
        "number"
    ]
};
const builtInConnectionNumbers = [...numbers];
for (const i in builtInConnectionRegex) {
    const type = builtInConnectionRegex[i][3];
    if (builtInConnectionNumbers.includes(type))
        builtInConnectionNumbers.push(i);
}
export function compileValues(value) {
    value = value.toLowerCase().trim();
    if (builtInConnection.includes(value))
        return `["${value}"]`;
    for (const [name, [test, getArgs]] of Object.entries(builtInConnectionRegex))
        if (test.test(value))
            return `["${name}", ${getArgs(value)}]`;
    return `[${value}]`;
}
export async function makeValidationJSON(args, validatorArray) {
    for (const i in validatorArray) {
        const [element, ...elementArgs] = validatorArray[i], value = args[i];
        let returnNow = false;
        let isDefault = false;
        switch (element) {
            case 'number':
            case 'num':
                returnNow = typeof value !== 'number';
                break;
            case 'boolean':
            case 'bool':
                returnNow = typeof value !== 'boolean';
                break;
            case 'integer':
            case 'int':
                returnNow = !Number.isInteger(value);
                break;
            case 'string':
            case 'text':
                returnNow = typeof value !== 'string';
                break;
            case 'email':
                returnNow = !emailValidator.test(value);
                break;
            default: {
                const haveRegex = value != null && builtInConnectionRegex[element];
                if (haveRegex) {
                    returnNow = !haveRegex[2](elementArgs, value);
                    break;
                }
                isDefault = true;
                if (element instanceof RegExp)
                    returnNow = element.test(value);
                else if (typeof element == 'function')
                    returnNow = !await element(value);
            }
        }
        if (returnNow) {
            let info = `failed at ${i} filed - ${isDefault ? returnNow : 'expected ' + element}`;
            if (elementArgs.length)
                info += `, arguments: ${JSON.stringify(elementArgs)}`;
            info += `, input: ${JSON.stringify(value)}`;
            return [info, element, elementArgs, value];
        }
    }
    return true;
}
export function parseValues(args, validatorArray) {
    const parsed = [];
    for (const i in validatorArray) {
        const [element] = validatorArray[i], value = args[i];
        if (builtInConnectionNumbers.includes(element))
            parsed.push(parseFloat(value));
        else if (booleans.includes(element))
            parsed.push(value === 'true' ? true : false);
        else
            parsed.push(value);
    }
    return parsed;
}
//# sourceMappingURL=index.js.map