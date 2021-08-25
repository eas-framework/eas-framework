import * as fileByUrl from '../RunTimeBuild/GetPages.js';
import { v4 as uuidv4 } from 'uuid';
import { BasicSettings, workingDirectory, SystemData } from '../RunTimeBuild/SearchFileSystem.js';
import * as BuildServer from '../RunTimeBuild/SearchPages.js';
import { cookieParser } from '@tinyhttp/cookie-parser';
import cookieEncrypter from 'cookie-encrypter';
import { SetDevMode } from '../OutputInput/Console.js';
import session from 'express-session';
import { Settings as InsertModelsSettings } from '../CompileCode/InsertModels.js';
import bodyParser from 'body-parser';
import { StartRequire, GetSettings, SettingsExsit } from './ImportModule.js';
import { Settings as PrintIfNewSettings } from '../OutputInput/PrintNew.js';
import BetterSqlite3 from 'better-sqlite3';
import ConnectSession from 'better-sqlite3-session-store';
const CookiesSecret = uuidv4().substring(0, 32), SessionSecret = uuidv4(), SequelizeStore = ConnectSession(session), CookiesMiddleware = cookieParser(CookiesSecret), CookieEncrypterMiddleware = cookieEncrypter(CookiesSecret, {}), CookieSettings = { httpOnly: true, signed: true, maxAge: 86400000 * 30 };
fileByUrl.Settings.Cookies = CookiesMiddleware;
fileByUrl.Settings.CookieEncrypter = CookieEncrypterMiddleware;
fileByUrl.Settings.CookieSettings = CookieSettings;
let DevMode_ = true, ComilationEnded, SessionStore;
let formidableServer, bodyParserServer;
;
export const Export = {
    set DevMode(value) {
        DevMode_ = value;
        if (!value) {
            ComilationEnded = BuildServer.compileAll();
            process.env.NODE_ENV = "production";
        }
        fileByUrl.Settings.DevMode = value;
        SetDevMode(value);
    },
    get DevMode() {
        return DevMode_;
    },
    get SettingsPath() {
        return workingDirectory + BasicSettings.WebSiteFolder + "/Settings";
    },
    set CacheDays(value) {
        fileByUrl.Settings.CacheDays = value;
    },
    get CacheDays() {
        return fileByUrl.Settings.CacheDays;
    },
    set PageRam(value) {
        fileByUrl.Settings.PageRam = value;
    },
    get PageRam() {
        return fileByUrl.Settings.PageRam;
    },
    set CookiesExpiresDays(value) {
        CookieSettings.maxAge = 86400000 * value;
    },
    get CookiesExpiresDays() {
        return CookieSettings.maxAge / 86400000;
    },
    get CookiesSecret() {
        return CookiesSecret;
    },
    get SessionSecret() {
        return SessionSecret;
    },
    get CookiesMiddleware() {
        return CookiesMiddleware;
    },
    get CookieEncrypterMiddleware() {
        return CookieEncrypterMiddleware;
    },
    get SessionMiddleware() {
        return SessionStore;
    },
    get formidable() {
        return formidableServer;
    },
    get bodyParser() {
        return bodyParserServer;
    },
    set AddCompileSyntax(value) {
        InsertModelsSettings.AddCompileSyntax = value;
    },
    get AddCompileSyntax() {
        return InsertModelsSettings.AddCompileSyntax;
    },
    set plugins(value) {
        InsertModelsSettings.plugins.length = 0;
        InsertModelsSettings.plugins.push(...value);
    },
    get plugins() {
        return InsertModelsSettings.plugins;
    },
    set preventCompilationError(value) {
        PrintIfNewSettings.PreventErrors = value;
    },
    get preventCompilationError() {
        return PrintIfNewSettings.PreventErrors;
    },
    get ErrorPages() {
        return fileByUrl.Settings.ErrorPages;
    },
    set ErrorPages(value) {
        fileByUrl.Settings.ErrorPages = value;
    },
    RequestLimitMB: 5,
    MaxFileUploadMB: 100,
    SessionTimeMinutes: 60,
    ReapIntervalSessionMinutes: 30,
    Serve: {
        AppPort: 8080,
        http2: false,
        greenlock: {
            staging: null,
            cluster: null,
            email: null,
            agent: null,
            agreeToTerms: false,
            sites: []
        }
    },
    Routing: {
        RuleObject: [],
        StopCheckUrls: [],
        IgnoreTypes: [...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray],
        IgnorePaths: [],
        arrayFuncServer: []
    },
    OnDev: {},
    OnProduction: {}
};
let firstLoad = true;
export function ReformidableServer() {
    formidableServer = {
        maxFileSize: Export.MaxFileUploadMB * 1024 * 1024,
        uploadDir: SystemData + "/UploadFiles/",
        multiples: true,
        maxFieldsSize: Export.RequestLimitMB * 1024 * 1024
    };
}
export function RebodyParserServer() {
    bodyParserServer = bodyParser.json({ limit: Export.RequestLimitMB + 'mb' });
}
function CheckChange(o, Settings) {
    let re = false;
    for (const i in o) {
        if (Settings[i] != null && Settings[i] != Export[o[i]]) {
            re = true;
        }
        Export[o[i]] = Settings[i];
    }
    return re;
}
export async function ReSessionStore() {
    if (!Export.SessionTimeMinutes) {
        SessionStore = (req, res, next) => next();
        return;
    }
    const sequelize = new BetterSqlite3(SystemData + '/RuntimeBuild/Session.db');
    SessionStore = session({
        cookie: { maxAge: Export.SessionTimeMinutes * 60 * 1000, sameSite: true },
        secret: SessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore({
            client: sequelize,
            expired: {
                clear: true,
                intervalMs: Export.ReapIntervalSessionMinutes * 60 * 1000
            }
        })
    });
}
const ReserverChange = {
    'request-limit-mb': 'RequestLimitMB',
    'upload-files-size-limit-mb': 'MaxFileUploadMB'
};
// read the settings of the website
export async function requireSettings() {
    if (await SettingsExsit(Export.SettingsPath)) {
        const Settings = await GetSettings(Export.SettingsPath, DevMode_);
        if (Settings.development) {
            Object.assign(Settings, Settings.OnDev);
        }
        else {
            Object.assign(Settings, Settings.OnProduction);
        }
        if (Settings['add-compile-syntax']) {
            Export.AddCompileSyntax = Settings['add-compile-syntax'];
        }
        if (Settings['plugins']) {
            Export.plugins = Settings['plugins'];
        }
        if (Settings["prevent-compilation-error"]) {
            Export.preventCompilationError = Settings["prevent-compilation-error"];
        }
        if (firstLoad || Settings.development != null && Settings.development !== DevMode_) {
            Export.DevMode = Settings.development;
            await ComilationEnded;
        }
        if (Settings["save-page-ram"] != null) {
            if (!Export.PageRam && Settings["save-page-ram"]) {
                await fileByUrl.LoadAllPagesToRam();
            }
            Export.PageRam = Settings["save-page-ram"];
            if (!Export.PageRam) {
                fileByUrl.ClearAllPagesFromRam();
            }
        }
        if (Settings["error-pages"]) {
            Export.ErrorPages = Settings["error-pages"];
        }
        if (Settings["cache-days"]) {
            Export.CacheDays = Settings["cache-days"];
        }
        if (Settings.rules) {
            Export.Routing.RuleObject = Settings.rules;
        }
        if (Settings["stop-url-check"]) {
            Export.Routing.StopCheckUrls = Settings["stop-url-check"];
        }
        if (Settings["cookies-expires-days"]) {
            Export.CookiesExpiresDays = Settings["cookies-expires-days"];
        }
        if (Settings['request-limit-mb'] && Settings['request-limit-mb'] != Export.RequestLimitMB) {
            Export.RequestLimitMB = Settings['request-limit-mb'];
            if (!firstLoad) {
                RebodyParserServer();
            }
        }
        if (firstLoad) {
            firstLoad = false;
        }
        if (Settings['session-time-minutes'] !== undefined && Settings['session-time-minutes'] != Export.SessionTimeMinutes) {
            Export.SessionTimeMinutes = Settings['session-time-minutes'];
            await ReSessionStore();
        }
        if (Settings['ignore-types']) {
            Export.Routing.IgnoreTypes = Settings['ignore-types'];
            Export.Routing.IgnoreTypes.push(...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray);
        }
        if (Settings['ignore-start-paths']) {
            Export.Routing.IgnorePaths = Settings['ignore-start-paths'];
        }
        if (Settings['require-on-start']) {
            Export.Routing.arrayFuncServer = await StartRequire(Settings['require-on-start'], DevMode_);
        }
        if (CheckChange(ReserverChange, Settings)) {
            ReformidableServer();
        }
        if (Settings.serve) {
            if (Settings.serve.port) {
                Export.Serve.AppPort = Settings.serve.port;
            }
            if (Settings.serve.http2) {
                Export.Serve.http2 = Settings.serve.http2;
            }
            if (Settings.serve.greenlock) {
                Export.Serve.greenlock = Settings.serve.greenlock;
            }
        }
    }
    else {
        Export.DevMode = DevMode_;
        await ComilationEnded;
    }
}
