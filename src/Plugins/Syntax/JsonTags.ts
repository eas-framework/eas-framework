import * as extricate from '../../CompileCode/XMLHelpers/Extricate';

export default function extricateToTags(code, {types = ["style"]}){

    if(!Array.isArray(types)){
        types = [types];
    }

    for(const i of types){
        code = extricate.replaceTages(code, '@' + i, i);
    }

    return code;
}