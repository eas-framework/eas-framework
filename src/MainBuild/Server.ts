import { App as TinyApp } from '@tinyhttp/app';
import type {Request, Response} from './Types';
import compression from 'compression';
import {Export as Settings, requireSettings, buildFirstLoad, pageInRamActivateFunc} from './Settings'
import * as fileByUrl from '../RunTimeBuild/GetPages';
import { print } from '../OutputInput/Console';
import { BasicSettings } from '../RunTimeBuild/SearchFileSystem';
import formidable from 'formidable';
import { UpdateGreenLock } from './ListenGreenLock';
import http from 'http';
import updateRequestAttributes from '../Plugins/HTTP';


async function requestAndSettings(req: Request, res: Response) {
    if (Settings.development) {
        await requireSettings();
    }

    return await changeURLRules(req, res);
}

async function changeURLRules(req: Request, res: Response) {
    let url = fileByUrl.urlFix(req.path);

    
    for (let i of Settings.routing.urlStop) {
        if (url.startsWith(i)) {
            if (i.endsWith('/')) {
                i = i.substring(0, i.length - 1);
            }
            return await filerURLRules(req, res, i);
        }
    }

    const RuleIndex = Object.keys(Settings.routing.rules).find(i => url.startsWith(i));

    if (RuleIndex) {
        url = await Settings.routing.rules[RuleIndex](url, req, res);
    }

    await filerURLRules(req, res, url);
}

async function filerURLRules(req: Request, res: Response, url: string) {
    let notValid: any = Settings.routing.ignorePaths.find(i => url.startsWith(i)) || Settings.routing.ignoreTypes.find(i => url.endsWith('.'+i));
    
    if(!notValid) {
        for(const valid of Settings.routing.validPath){ // check if url isn't valid
            if(!await valid(url, req, res)){
                notValid = true;
                break;
            }
        }
    }

    if (notValid) {
        const ErrorPage = fileByUrl.GetErrorPage(404, 'notFound');
        return await fileByUrl.DynamicPage(req, res, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
    }

    await fileByUrl.DynamicPage(req, res, url.substring(1));
}

let appOnline: {close: () => void, server: http.Server}

/**
 * It starts the server and then calls StartListing
 * @param [Server] - The server object that is passed in by the caller.
 */
async function StartApp(Server?) {
    const app = new TinyApp();
    if (!Settings.serve.http2) {
        app.use(<any>compression());
    }
    fileByUrl.Settings.SessionStore = async (req, res, next) => Settings.middleware.session(req, res, next);

    const OpenListing = await StartListing(app, Server);

    for (const func of Settings.general.importOnLoad) {
        await func(app, appOnline.server, Settings);
    }
    await pageInRamActivateFunc()?.()

    app.all("*", ParseRequest);

    await OpenListing(Settings.serve.port);

    console.log("App listing at port: " + Settings.serve.port);
}

/**
 * If the request is a POST request, then parse the request body, then send it to routing settings
 * @param {Request} req - The incoming request.
 * @param {Response} res - Response
 */
function ParseRequest(req: Request, res: Response) {
    updateRequestAttributes(req, res);

    return new Promise(async (resolve: any) => {
        if (req.method === 'POST') {

            if (req.headers['content-type']?.startsWith?.('application/json')) {
                Settings.middleware.bodyParser(req, res, async () => {
                    await requestAndSettings(req, res)
                    resolve();
                });
                return;
            }


            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    print.error(err);
                }
                req.body = fields;
                req.files = files;
                await requestAndSettings(req, res);
                resolve();
            });

            return;
        }
        
        await requestAndSettings(req, res);
        resolve();
    })
}

async function StartListing(app, Server) {
    if (appOnline && appOnline.close) {
        await appOnline.close();
    }

    const { server, listen, close } = await Server(app);

    appOnline = { server, close };

    return listen;
}

export default async function StartServer({ SitePath = './', HttpServer = UpdateGreenLock } = {}) {
    BasicSettings.WebSiteFolder = SitePath;
    buildFirstLoad();
    await requireSettings();
    await StartApp(HttpServer);
    return appOnline
}

export { Settings };