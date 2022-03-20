import http from 'http';
import http2 from 'http2';
import * as createCert from 'selfsigned';
import * as Greenlock from 'greenlock-express';
import {Export as Settings} from './Settings'
import EasyFs from '../OutputInput/EasyFs';
import { DeleteInDirectory, workingDirectory, SystemData } from '../RunTimeBuild/SearchFileSystem';
import { GreenLockSite } from './SettingsTypes';

/**
 * If the folder doesn't exist, create it. If the file doesn't exist, create it. If the file does
 * exist, update it
 * @param {string} foName - The name of the folder to create.
 * @param CreateInNotExits - {
 */
async function TouchSystemFolder(foName: string, CreateInNotExits: {name: string, value: string, exits?: any}) {
    let savePath = workingDirectory + "/SystemSave/";

    await EasyFs.mkdirIfNotExists(savePath);

    savePath += foName;

    await EasyFs.mkdirIfNotExists(savePath);

    if (CreateInNotExits) {
        savePath += '/';
        const filePath = savePath + CreateInNotExits.name;

        if (!await EasyFs.existsFile(filePath)) {
            await EasyFs.writeFile(filePath, CreateInNotExits.value);
        } else if (CreateInNotExits.exits) {
            await EasyFs.writeFile(filePath, await CreateInNotExits.exits(await EasyFs.readFile(filePath, 'utf8'), filePath, savePath));
        }
    }
}

/**
 * It generates a self-signed certificate and stores it in a file.
 * @returns The certificate and key are being returned.
 */
async function GetDemoCertificate() {
    let Certificate: any;
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

function DefaultListen(app) {
    const server = http.createServer(app.attach);
    return {
        server,
        listen(port: number) {
            return new Promise(res => {
                server.listen(port, <any>res);
            });
        },
        close() {
            server.close();
        }
    }
}
/**
 * If you want to use greenlock, it will create a server that will serve your app over https
 * @param app - The tinyHttp application object.
 * @returns A promise that resolves the server methods
 */

export async function UpdateGreenLock(app) {

    if (!(Settings.serve.http2 || Settings.serve.greenLock?.agreeToTerms)) {
        return await DefaultListen(app);
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
