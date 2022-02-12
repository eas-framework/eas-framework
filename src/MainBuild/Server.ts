import http from 'http';
import http2 from 'http2';
import * as createCert from 'selfsigned';
import * as Greenlock from 'greenlock-express';
import { App as TinyApp } from '@tinyhttp/app';
import type {Request, Response} from './Types';
import compression from 'compression';
import {Export as Settings, requireSettings, GreenLockSite, buildFirstLoad, pageInRamActivateFunc} from './Settings'
import * as fileByUrl from '../RunTimeBuild/GetPages';
import EasyFs from '../OutputInput/EasyFs';
import { print } from '../OutputInput/Console';
import { DeleteInDirectory, workingDirectory, SystemData, BasicSettings } from '../RunTimeBuild/SearchFileSystem';
import formidable from 'formidable';

async function getPageData(req: Request, res: Response) {
    if (Settings.development) {
        await requireSettings();
    }

    return await getPageDataByUrl(req, res);
}

async function getPageDataByUrl(req: Request, res: Response) {
    let url = fileByUrl.urlFix(req.url);

    
    for (let i of Settings.routing.urlStop) {
        if (url.startsWith(i)) {
            if (i.endsWith('/')) {
                i = i.substring(0, i.length - 1);
            }
            return await getPageWithoutRules(req, res, i);
        }
    }

    const RuleIndex = Object.keys(Settings.routing.rules).find(i => url.startsWith(i));

    if (RuleIndex) {
        url = await Settings.routing.rules[RuleIndex](req, res, url);
    }

    await getPageWithoutRules(req, res, url);
}

async function getPageWithoutRules(req: Request, res: Response, url: string) {
    if (Settings.routing.ignorePaths.find(i => url.startsWith(i)) || Settings.routing.ignoreTypes.find(i => url.endsWith('.'+i))) {
        const ErrorPage = fileByUrl.GetErrorPage(404, 'NotFound');
        return await fileByUrl.DynamicPage(req, res, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
    }

    await fileByUrl.DynamicPage(req, res, url.substring(1));
}

let appOnline

async function StartApp(Server?) {
    const app = new TinyApp();
    if (!Settings.serve.http2) {
        app.use(<any>compression());
    }
    fileByUrl.Settings.SessionStore = async (req, res, next) => Settings.middleware.session(req, res, next);

    const OpenListing = await StartListing(app, Server);

    app.all("*", ParseRequest);

    for (const func of Settings.general.importOnLoad) {
        await func(app, appOnline.server, Settings);
    }
    await pageInRamActivateFunc()?.()

    await OpenListing(Settings.serve.port);

    console.log("App listing at port: " + Settings.serve.port);
}

async function ParseRequest(req: Request, res: Response) {
    if (req.method == 'POST') {
        if (req.headers['content-type']?.startsWith?.('application/json')) {
            Settings.middleware.bodyParser(req, res, () => getPageData(req, res));
        } else {
            new formidable.IncomingForm(Settings.middleware.formidable).parse(req, (err, fields, files) => {
                if (err) {
                    print.error(err);
                }
                req.fields = fields;
                req.files = files;
                getPageData(req, res);
            });
        }
    } else {
        getPageData(req, res);
    }
}
//CreateInNotExits = {name, value}
async function TouchSystemFolder(foName: string, CreateInNotExits: {name: string, value: string, exits?: any}) {
    let fopath = workingDirectory + "/SystemSave/";

    await EasyFs.mkdirIfNotExists(fopath);

    fopath += foName;

    await EasyFs.mkdirIfNotExists(fopath);

    if (CreateInNotExits) {
        fopath += '/';
        const filePath = fopath + CreateInNotExits.name;

        if (!await EasyFs.existsFile(filePath)) {
            await EasyFs.writeFile(filePath, CreateInNotExits.value);
        } else if (CreateInNotExits.exits) {
            await EasyFs.writeFile(filePath, await CreateInNotExits.exits(await EasyFs.readFile(filePath, 'utf8'), filePath, fopath));
        }
    }
}

async function GetDemoCertificate() {
    let Certificate;
    const CertificatePath = SystemData + '/Certificate.json';

    if (await EasyFs.existsFile(CertificatePath)) {
        Certificate = EasyFs.readJsonFile(CertificatePath);
    } else {
        Certificate = await new Promise(res => {
            createCert.generate(null, { days: 36500 }, (err, keys) => {
                if (err) throw err;
                res({
                    key: keys.private,
                    cert: keys.cert
                });
            });
        });

        EasyFs.writeJsonFile(CertificatePath, Certificate);
    }
    return Certificate;
}

async function UpdateGreenloak(app) {

    if (!(Settings.serve.http2 || Settings.serve.greenLock?.agreeToTerms)) {
        return await DefualtListen(app);
    }

    if (!Settings.serve.greenLock.agreeToTerms) {
        const server = http2.createSecureServer({ ...await GetDemoCertificate(), allowHTTP1: true }, app.attach);

        return {
            server,
            listen(port) {
                server.listen(port);
            },
            stop() {
                server.close();
            }
        }
    }

    await TouchSystemFolder("greenlock", {
        name: "config.json", value: JSON.stringify({
            sites: Settings.serve.greenLock.sites
        }),
        async exits(file, _, folder) {
            file = JSON.parse(file);
            for (const i in file.sites) {
                const e = file.sites[i];
                let have;
                for (const b of <GreenLockSite[]> Settings.serve.greenLock.sites) {
                    if (b.subject == e.subject) {
                        have = true;
                        if (b.altnames.length != e.altnames.length || b.altnames.some(v => e.altnames.includes(v))) {
                            e.altnames = b.altnames;
                            delete e.renewAt;
                        }
                        break;
                    }
                }
                if (!have) {
                    file.sites.splice(i, i);
                    const path = folder + "live/" + e.subject;

                    if (await EasyFs.exists(path)) {
                        await DeleteInDirectory(path);
                        await EasyFs.rmdir(path);
                    }
                }
            }

            const newSites = Settings.serve.greenLock.sites.filter((x) => !file.sites.find(b => b.subject == x.subject));

            file.sites.push(...newSites);

            return JSON.stringify(file);
        }
    });

    const packageInfo = await EasyFs.readJsonFile(workingDirectory + "package.json");

    const greenlockObject:any = await new Promise(res => Greenlock.init({
        packageRoot: workingDirectory,
        configDir: "SystemSave/greenlock",
        packageAgent: Settings.serve.greenLock.agent || packageInfo.name + '/' + packageInfo.version,
        maintainerEmail: Settings.serve.greenLock.email,
        cluster: Settings.serve.greenLock.cluster,
        staging: Settings.serve.greenLock.staging
    }).ready(res));

    function CreateServer(type, func, options?) {
        let ClosehttpServer = () => { };
        const server = greenlockObject[type](options, func);
        const listen = (port) => {
            const httpServer = greenlockObject.httpServer();
            ClosehttpServer = () => httpServer.close();
            return Promise.all([new Promise(res => server.listen(443, "0.0.0.0", res)), new Promise(res => httpServer.listen(port, "0.0.0.0", res))]);
        };
        const close = () => { server.close(); ClosehttpServer(); };
        return {
            server,
            listen,
            close
        }
    }

    if (Settings.serve.http2) {
        return CreateServer('http2Server', app.attach, { allowHTTP1: true });
    } else {
        return CreateServer('httpsServer', app.attach);
    }
}

async function StartListing(app, Server) {
    if (appOnline && appOnline.close) {
        await appOnline.close();
    }

    const { server, listen, close } = await Server(app);

    appOnline = { server, close };

    return listen;
}

function DefualtListen(app) {
    const server = http.createServer(app.attach);
    return {
        server,
        listen(port) {
            return new Promise(res => {
                server.listen(port, <any>res);
            });
        },
        close() {
            server.close();
        }
    }
}

export default async function StartServer({ SitePath = 'Website', HttpServer = UpdateGreenloak } = {}) {
    BasicSettings.WebSiteFolder = SitePath;
    buildFirstLoad();
    await requireSettings();
    StartApp(HttpServer);
}

export { Settings };