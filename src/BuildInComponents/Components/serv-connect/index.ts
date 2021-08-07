const numbers = ['number', 'num', 'integer', 'int'], booleans = ['boolean', 'bool'];
const builtInConnectionString = ['email', 'string', 'text'].concat(numbers).concat(booleans);

const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const builtInConnectionRegex = {
    "number-range": [
        /^[0-9]+\-[0-9]+$/,
        (validator: string) => validator.split('-').map(x => Number(x)),
        ([min, max], text: string) => text.length >= min && text.length <= max
    ]
};

export function compileValues(value: string): string {
    value = value.toLowerCase().trim();

    if (builtInConnectionString.includes(value))
        return `["${value}"]`;

    for (const [name, [test, getArgs]] of Object.entries(builtInConnectionRegex))
        if ((<RegExp>test).test(value))
            return `["${name}", ${(<any>getArgs)(value)}]`;
    
    return `[${value}]`;
}


export async function makeValidationJSON(args: any[], validatorArray: any[]): Promise<boolean | string> {

    for (const i in validatorArray) {
        const [element, ...elementArgs] = validatorArray[i], value = args[i];
        let returnNow = false;

        let isDefault = false;
        switch (element) {
            case 'string':
            case 'text':
                returnNow = typeof value !== 'string';
                break;
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
            case 'email':
                returnNow = emailValidator.test(value);
                break;
            case "number-range":
                returnNow = builtInConnectionRegex[element][2](elementArgs,value);
                break;
            default:
                isDefault = true;

                if (element instanceof RegExp)
                    returnNow = element.test(value);
                else if (typeof element == 'function')
                    returnNow = !await element(value);

                break;
        }

        if (returnNow) {
            return `failed at ${i} filed - ${isDefault ? returnNow : 'expected ' + element}`;
        }
    }

    return true;
}

export function parseValues(args: any[], validatorArray: any[]): any[] {
    const parsed = [];


    for (const i in validatorArray) {
        const [element] = validatorArray[i], value = args[i];

        if (numbers.includes(element))
            parsed.push(parseFloat(value));

        else if (booleans.includes(element))
            parsed.push(value === 'true' ? true : false);

        else
            parsed.push(value);
    }

    return parsed;
}