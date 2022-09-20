function _exportStar(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) Object.defineProperty(to, k, {
            enumerable: true,
            get: () => from[k]
        });
    });
    return from;
}


function _export(target, all) {
    for(const name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}

export const injectionParamText = `{_exportStar, _export}`
export const injectionParamObject = {_exportStar, _export}