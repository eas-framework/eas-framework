import {GlobalSettings} from '../../Settings/GlobalSettings.js';
import PPath from '../../Settings/PPath.js';
import {directories} from '../../Settings/ProjectConsts.js';
import {Request, Response} from '../types.js';
import RequestWrapper from './RequestWrapper.js';
import URLHooks from './URLHooks.js';
import URLRewrite from 'express-urlrewrite';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';

export default async function processURL(req: Request, res: Response) {
    const urlPath = PPath.fromNested(directories.Locate.static, req.path);
    const wrapper = new RequestWrapper(urlPath, req, res);

    const basicURLHooks = () => {
        URLHooks(wrapper); // basic hook to change the path
        ignorePath(wrapper); // ignore the url if it starts with an ignore path
    };
    basicURLHooks();


    if (wrapper.notError) {
        await URLRewriteRules(wrapper);

        basicURLHooks();// doing again in case the url change...
    }

    return wrapper;
}

function ignorePath(wrapper: RequestWrapper) {
    const notValid = GlobalSettings.routing.ignorePaths.find(i => wrapper.path.nested.startsWith(i));

    if (notValid) {
        wrapper.makeNotFound();
    }
}

export async function URLRewriteRules(wrapper: RequestWrapper) {
    for (const source in GlobalSettings.routing.rewriteURL) {
        const dest = GlobalSettings.routing.rewriteURL[source];

        await promisify(URLRewrite(source, dest))(wrapper.req, wrapper.res);
    }

    wrapper.path.nested = pathToFileURL(wrapper.req.url).pathname;
}