import findApiPathAndCache from './FindPath.js';
import parseFileAndURL from './ParseFileAndURL.js';
import RequestParser from '../../RequestParser.js';

export default async function createApiCall(parser: RequestParser) {
    const apiPath = await findApiPathAndCache(parser.wrapper);
    if (apiPath == null) {
        return false; // not an api call
    }

    return await parseFileAndURL(parser, apiPath);
}