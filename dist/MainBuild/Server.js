import http from 'http';
import http2 from 'http2';
import * as createCert from 'selfsigned';
import * as Greenlock from 'greenlock-express';
import { App as TinyApp } from '@tinyhttp/app';
import compression from 'compression';
import { Export as Settings, requireSettings, ReformidableServer, RebodyParserServer, ReSessionStore } from './Settings.js';
import * as fileByUrl from '../RunTimeBuild/GetPages.js';
import * as path from 'path';
import EasyFs from '../OutputInput/EasyFs.js';
import { print } from '../OutputInput/Console.js';
import { DeleteInDirectory, workingDirectory, SystemData, BasicSettings } from '../RunTimeBuild/SearchFileSystem.js';
import formidable from 'formidable';
async function getPageData(req, res) {
    if (Settings.DevMode) {
        await requireSettings();
    }
    return await getPageDataByUrl(req, res);
}
async function getPageDataByUrl(req, res) {
    let url = fileByUrl.urlFix(req.url);
    for (let i of Settings.Routing.StopCheckUrls) {
        if (url.startsWith(i)) {
            if (i.endsWith('/')) {
                i = i.substring(0, i.length - 1);
            }
            return await getPageWithoutRules(req, res, i);
        }
    }
    const RuleIndex = Object.keys(Settings.Routing.RuleObject).find(i => url.startsWith(i));
    if (RuleIndex) {
        url = await Settings.Routing.RuleObject[RuleIndex](req, res, url);
    }
    await getPageWithoutRules(req, res, url);
}
async function getPageWithoutRules(req, res, url) {
    if (Settings.Routing.IgnorePaths.findIndex(i => url.startsWith(i)) != -1 || Settings.Routing.IgnoreTypes.includes(path.extname(url).substring(1))) {
        const ErrorPage = fileByUrl.GetErrorPage(404, 'NotFound');
        return await fileByUrl.DynamicPage(req, res, ErrorPage.url, ErrorPage.arrayType, ErrorPage.code);
    }
    await fileByUrl.DynamicPage(req, res, url.substring(1));
}
let appOnline;
async function StartApp(Server) {
    const app = new TinyApp();
    if (!Settings.Serve.http2) {
        app.use(compression());
    }
    fileByUrl.Settings.SessionStore = async (req, res, next) => Settings.SessionMiddleware(req, res, next);
    const OpenListing = await StartListing(app, Server);
    app.all("*", ParseRequest);
    for (const i of Settings.Routing.arrayFuncServer) {
        await i(app, appOnline.server, Settings);
    }
    await OpenListing(Settings.Serve.AppPort);
    console.log("App listing at port: " + Settings.Serve.AppPort);
}
async function ParseRequest(req, res) {
    if (req.method == 'POST') {
        if (req.headers['content-type'].startsWith('application/json')) {
            Settings.bodyParser(req, res, () => getPageData(req, res));
        }
        else {
            new formidable.IncomingForm(Settings.formidable).parse(req, (err, fields, files) => {
                if (err) {
                    print.error(err);
                }
                req.fields = fields;
                req.files = files;
                getPageData(req, res);
            });
        }
    }
    else {
        getPageData(req, res);
    }
}
//CreateInNotExits = {name, value}
async function TouchSystemFolder(foName, CreateInNotExits) {
    let fopath = workingDirectory + "/SystemSave/";
    await EasyFs.mkdirIfNotExists(fopath);
    fopath += foName;
    await EasyFs.mkdirIfNotExists(fopath);
    if (CreateInNotExits) {
        fopath += '/';
        const filePath = fopath + CreateInNotExits.name;
        if (!await EasyFs.existsFile(filePath)) {
            await EasyFs.writeFile(filePath, CreateInNotExits.value);
        }
        else if (CreateInNotExits.exits) {
            await EasyFs.writeFile(filePath, await CreateInNotExits.exits(await EasyFs.readFile(filePath, 'utf8'), filePath, fopath));
        }
    }
}
async function GetDemoCertificate() {
    let Certificate;
    const CertificatePath = SystemData + '/Certificate.json';
    if (await EasyFs.existsFile(CertificatePath)) {
        Certificate = EasyFs.readJsonFile(CertificatePath);
    }
    else {
        Certificate = await new Promise(res => {
            createCert.generate(null, { days: 36500 }, (err, keys) => {
                if (err)
                    throw err;
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
    if (!(Settings.Serve.http2 || Settings.Serve.greenlock && Settings.Serve.greenlock.agreeToTerms)) {
        return await DefualtListen(app);
    }
    if (!Settings.Serve.greenlock.agreeToTerms) {
        const server = http2.createSecureServer({ ...await GetDemoCertificate(), allowHTTP1: true }, app.attach);
        return {
            server,
            listen(port) {
                server.listen(port);
            },
            stop() {
                server.close();
            }
        };
    }
    await TouchSystemFolder("greenlock", {
        name: "config.json", value: JSON.stringify({
            sites: Settings.Serve.greenlock.sites
        }),
        async exits(file, _, folder) {
            file = JSON.parse(file);
            for (const i in file.sites) {
                const e = file.sites[i];
                let have;
                for (const b of Settings.Serve.greenlock.sites) {
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
            const newSites = Settings.Serve.greenlock.sites.filter((x) => !file.sites.find(b => b.subject == x.subject));
            file.sites.push(...newSites);
            return JSON.stringify(file);
        }
    });
    const packageInfo = await EasyFs.readJsonFile(workingDirectory + "package.json");
    const greenlockObject = await new Promise(res => Greenlock.init({
        packageRoot: workingDirectory,
        configDir: "SystemSave/greenlock",
        packageAgent: Settings.Serve.greenlock.agent || packageInfo.name + '/' + packageInfo.version,
        maintainerEmail: Settings.Serve.greenlock.email,
        cluster: Settings.Serve.greenlock.cluster,
        staging: Settings.Serve.greenlock.staging
    }).ready(res));
    function CreateServer(type, func, options) {
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
        };
    }
    if (Settings.Serve.http2) {
        return CreateServer('http2Server', app.attach, { allowHTTP1: true });
    }
    else {
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
                server.listen(port, res);
            });
        },
        close() {
            server.close();
        }
    };
}
export default async function StartServer({ SitePath = 'Website', HttpServer = UpdateGreenloak } = {}) {
    BasicSettings.WebSiteFolder = SitePath;
    ReformidableServer();
    await requireSettings();
    await ReSessionStore();
    RebodyParserServer();
    StartApp(HttpServer);
}
export { Settings };
//# sourceMappingURL=Server.js.map