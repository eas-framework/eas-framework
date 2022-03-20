import StringTracker from '../../EasyDebug/StringTracker';

function unicodeMe(value: string) {
    let a = "";
    for (const v of value) {
        a += "\\u" + ("000" + v.charCodeAt(0).toString(16)).substr(-4);
    }
    return a;
}

function searchForCutMain(data: StringTracker, array:string[], sing:string, bigTag?:boolean, searchFor?:boolean): SearchCutOutput {
    let out = "";
    for (const e of array) {
        out += unicodeMe(sing) + e + "|";
    }
    out = out.substring(0, out.length - 1);
    out = `<(${out})${searchFor ? "([\\p{L}0-9_\\-\\.]+)": ""}(\\u0020)*\\u002F?>`
    return searchForCut(data, new RegExp(out, 'u'), sing, bigTag)
}

function outTagName(data: string) {
    const end = data.indexOf(">");
    data = data.substring(0, end);
    while (data.endsWith(" ") || data.endsWith("/")) {
        data = data.substring(0, data.length - 1);
    }
    return data;
}

interface SearchCutData {
    tag: string,
    data: StringTracker,
    loc: number,
}

interface SearchCutOutput {
    data?: StringTracker,
    error?: boolean,
    found?: SearchCutData[]
}

/**
 * It searches for a specific tag and returns the data inside of it.
 * @param {StringTracker} data - The string you want to search through.
 * @param {RegExp} findArray - The regular expression to search for.
 * @param {string} sing - The string that you want to search for.
 * @param [bigTag=true] - If true, the function will search for the end of the tag. If false, it will
 * search for the next instance of the tag.
 * @param output - The output of the search.
 * @param {SearchCutData[]} returnArray - An array of objects that contain the tag name, the data
 * inside the tag, and the location of the tag in the original string.
 * @returns A string of the data that was found, and an array of the data that was found.
 */
function searchForCut(data:StringTracker, findArray:RegExp, sing:string, bigTag = true, output = new StringTracker(), returnArray: SearchCutData[] = []): SearchCutOutput {
    const dataCopy = data;
    const be = data.search(findArray);
    if (be == -1) {
        return {
            data: output.Plus(data), found: returnArray
        };
    }

    output.Plus(data.substring(0, be));

    data = data.substring(be + 1);

    const tag = outTagName(data.eq);

    data = data.substring(findStart(">", data));

    let inTagData;

    if (bigTag) {
        const end = findEnd(["<" + tag, "</" + tag], data);
        if (end != -1) {
            inTagData = data.substring(0, end);
            data = data.substring(end);
            data = data.substring(findStart(">", data));
        }
        else {
            const findNext = data.search(findArray);
            if (findNext == -1) {
                inTagData = data;
                data = new StringTracker();
            }
            else {
                inTagData = data.substring(0, findNext);
                data = data.substring(findNext);
            }
        }
    }

    returnArray.push({
        tag: tag,
        data: inTagData,
        loc: be
    });

    if (dataCopy == data) {
        return {
            error: true
        }
    }

    return searchForCut(data, findArray, sing, bigTag, output, returnArray);
}

function findStart(type:string, data:StringTracker) {
    return data.indexOf(type) + type.length;
}

function findEnd(types: string[], data:StringTracker) {

    let _0 = data.indexOf(types[0]);

    const _1 = data.indexOf(types[1]);

    if (_1 == -1) {
        return -1;
    }

    if (_0 < _1 && _0 != -1) {
        _0++;
        const next = _0 + findEnd(types, data.substring(_0)) + types[0].length;
        return next + findEnd(types, data.substring(next));
    }
    else {
        return _1;
    }
}


export {
    searchForCutMain as getDataTages
}
