import PPath from '../../../../Settings/PPath.js';
import {ScriptExtension} from '../../../../Settings/ProjectConsts.js';
import RequestWrapper from '../../../ProcessURL/RequestWrapper.js';
import {GlobalSettings} from '../../../../Settings/GlobalSettings.js';
import {getFileExtension} from '../../../../Settings/utils.js';
import EasyFS from '../../../../Util/EasyFS.js';
import {cacheFunc} from '../utils.js';

const INDEX_FILE = 'index';
function createApiPath(path: PPath){
    path.nested += '.' + ScriptExtension.script['api-' + getFileExtension()];
    return path;
}
async function findApiPath(path: PPath): Promise<{file: PPath, original: PPath} | null>{
    const apiPath = createApiPath(path.clone());
    const apiPathIndex = createApiPath(path.clone().join(INDEX_FILE));

    if(await EasyFS.existsFile(apiPathIndex.full)){ // with index file
        return {file: apiPathIndex, original: path};
    }

    if(path.nested == path.dirname.nested) { // we at the start of the path '/' === '/'
        return null; // we scan all the path but did not find api path
    }

    if(await EasyFS.existsFile(apiPath.full)){
        return {file: apiPath, original: path};
    }

    return findApiPath(path.dirname.join('.')); // get as file
}

export default async function findApiPathAndCache(wrapper: RequestWrapper){
    const findApiCache = cacheFunc(findApiPath, (path: PPath) => !GlobalSettings.development && path.nested);
    return await findApiCache(wrapper.path);
}