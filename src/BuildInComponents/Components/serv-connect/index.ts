import TagDataParser from '../../../CompileCode/XMLHelpers/TagDataParser';


const numbers = ['number', 'num', 'integer', 'int'], booleans = ['boolean', 'bool'];
const builtInConnection = ['email', 'string', 'text', ...numbers, ...booleans];

const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;



const builtInConnectionRegex = {
    "string-length-range": [
        /^[0-9]+-[0-9]+$/,
        (validator: string) => validator.split('-').map(x => Number(x)),
        ([min, max], text: string) => text.length >= min && text.length <= max,
        "string"
    ],
    "number-range-integer": [
        /^[0-9]+..[0-9]+$/,
        (validator: string) => validator.split('..').map(x => Number(x)),
        ([min, max], num: number) => Number.isInteger(num) && num >= min && num <= max,
        "number"
    ],
    "number-range-float": [
        /^[0-9]+\.[0-9]+..[0-9]+\.[0-9]+$/,
        (validator: string) => validator.split('..').map(x => Number(x)),
        ([min, max], num: number) => num >= min && num <= max,
        "number"
    ],
    "multiple-choice-string": [
        /^string|text+[ ]*=>[ ]*(\|?[^|]+)+$/,
        (validator: string) => validator.split('=>').pop().split('|').map(x => `"${x.trim().replace(/"/gi, '\\"')}"`),
        (options: string[], text: string) => options.includes(text),
        "string"
    ],
    "multiple-choice-number": [
        /^number|num|integer|int+[ ]*=>[ ]*(\|?[^|]+)+$/,
        (validator: string) => validator.split('=>').pop().split('|').map(x => parseFloat(x)),
        (options: number[], num: number) => options.includes(num),
        "number"
    ]
};

const builtInConnectionNumbers = [...numbers];

for (const i in builtInConnectionRegex) {
    const type = builtInConnectionRegex[i][3];

    if (builtInConnectionNumbers.includes(type))
        builtInConnectionNumbers.push(i);
}


export function compileValues(value: string): string {
    const fixedValue = value.trim();
    const lowerValue = fixedValue.toLowerCase()


    if (builtInConnection.includes(lowerValue))
        return `["${lowerValue}"]`;

    for (const [name, [test, getArgs]] of Object.entries(builtInConnectionRegex))
        if ((<RegExp>test).test(fixedValue))
            return `["${name}", ${(<any>getArgs)(fixedValue)}]`;

    return `[${fixedValue}]`;
}


export async function makeValidationJSON(args: any[], validatorArray: any[]): Promise<boolean | string[]> {

    for (const i in validatorArray) {
        const [element, ...elementArgs] = validatorArray[i], value = args[i];
        let returnNow: boolean | string = false;

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
                const haveRegex = builtInConnectionRegex[element];

                if (haveRegex) {
                    returnNow = value == null || !haveRegex[2](elementArgs, value);
                    break;
                }

                isDefault = true;
                if (element instanceof RegExp)
                    returnNow = (!element.test(value)) && 'regex - ' + element.toString();
                else if (typeof element == 'function')
                    returnNow = (!await element(value)) && 'function - ' + (element.name || 'anonymous');
            }
        }

        if (returnNow) {
            let info = `Validation failed at filed ${Number(i) + 1} - ${isDefault ? returnNow : 'expected ' + element}`;

            if (elementArgs.length)
                info += `, arguments: ${JSON.stringify(elementArgs)}`;

            info += `, input: ${JSON.stringify(value)}`;

            return [info, element, elementArgs, value];
        }
    }

    return true;
}

export function parseValues(args: any[], validatorArray: any[]): any[] {
    const parsed = [];


    for (const i in validatorArray) {
        const [element] = validatorArray[i], value = args[i];

        if (builtInConnectionNumbers.includes(element))
            parsed.push(parseFloat(value));

        else if (booleans.includes(element))
            parsed.push(value === 'true' || value === 'on' ? true : false);

        else
            parsed.push(value);
    }

    return parsed;
}