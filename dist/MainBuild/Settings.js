import * as fileByUrl from '../RunTimeBuild/GetPages.js';
import { v4 as uuidv4 } from 'uuid';
import { BasicSettings, workingDirectory, SystemData } from '../RunTimeBuild/SearchFileSystem.js';
import * as BuildServer from '../RunTimeBuild/SearchPages.js';
import { cookieParser } from '@tinyhttp/cookie-parser';
import cookieEncrypter from 'cookie-encrypter';
import { allowPrint } from '../OutputInput/Console.js';
import session from 'express-session';
import { Settings as InsertModelsSettings } from '../CompileCode/InsertModels.js';
import bodyParser from 'body-parser';
import { StartRequire, GetSettings } from './ImportModule.js';
import { Settings as PrintIfNewSettings } from '../OutputInput/PrintNew.js';
import MemorySession from 'memorystore';
const CookiesSecret = uuidv4().substring(0, 32), SessionSecret = uuidv4(), MemoryStore = MemorySession(session), CookiesMiddleware = cookieParser(CookiesSecret), CookieEncrypterMiddleware = cookieEncrypter(CookiesSecret, {}), CookieSettings = { httpOnly: true, signed: true, maxAge: 86400000 * 30 };
fileByUrl.Settings.Cookies = CookiesMiddleware;
fileByUrl.Settings.CookieEncrypter = CookieEncrypterMiddleware;
fileByUrl.Settings.CookieSettings = CookieSettings;
let DevMode_ = true, compilationScan, SessionStore;
let formidableServer, bodyParserServer;
;
const serveLimits = {
    sessionTotalRamMB: 150,
    sessionTimeMinutes: 40,
    sessionCheckPeriodMinutes: 30,
    fileLimitMB: 10,
    requestLimitMB: 4
};
let pageInRamActivate;
export function pageInRamActivateFunc() {
    return pageInRamActivate;
}
const baseRoutingIgnoreTypes = [...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray, ...BasicSettings.pageCodeFileArray];
export const Export = {
    get settingsPath() {
        return workingDirectory + BasicSettings.WebSiteFolder + "/Settings";
    },
    set development(value) {
        if (DevMode_ == value)
            return;
        DevMode_ = value;
        if (!value) {
            compilationScan = BuildServer.compileAll();
            process.env.NODE_ENV = "production";
        }
        fileByUrl.Settings.DevMode = value;
        allowPrint(value);
    },
    get development() {
        return DevMode_;
    },
    middleware: {
        get cookies() {
            return CookiesMiddleware;
        },
        get cookieEncrypter() {
            return CookieEncrypterMiddleware;
        },
        get session() {
            return SessionStore;
        },
        get formidable() {
            return formidableServer;
        },
        get bodyParser() {
            return bodyParserServer;
        }
    },
    secret: {
        get cookies() {
            return CookiesSecret;
        },
        get session() {
            return SessionSecret;
        },
    },
    general: {
        importOnLoad: [],
        set pageInRam(value) {
            if (fileByUrl.Settings.PageRam != value) {
                pageInRamActivate = async () => (await compilationScan)?.();
                return;
            }
            fileByUrl.Settings.PageRam = value;
            pageInRamActivate = async () => {
                const preparations = await compilationScan;
                await preparations?.();
                if (!fileByUrl.Settings.PageRam) {
                    await fileByUrl.LoadAllPagesToRam();
                }
                else if (!value) {
                    fileByUrl.ClearAllPagesFromRam();
                }
            };
        },
        get pageInRam() {
            return fileByUrl.Settings.PageRam;
        }
    },
    compile: {
        set compileSyntax(value) {
            InsertModelsSettings.AddCompileSyntax = value;
        },
        get compileSyntax() {
            return InsertModelsSettings.AddCompileSyntax;
        },
        set ignoreError(value) {
            PrintIfNewSettings.PreventErrors = value;
        },
        get ignoreError() {
            return PrintIfNewSettings.PreventErrors;
        },
        set plugins(value) {
            InsertModelsSettings.plugins.length = 0;
            InsertModelsSettings.plugins.push(...value);
        },
        get plugins() {
            return InsertModelsSettings.plugins;
        }
    },
    routing: {
        rules: [],
        urlStop: [],
        ignoreTypes: baseRoutingIgnoreTypes,
        ignorePaths: [],
        get errorPages() {
            return fileByUrl.Settings.ErrorPages;
        },
        set errorPages(value) {
            fileByUrl.Settings.ErrorPages = value;
        }
    },
    serveLimits: {
        cacheDays: 3,
        cookiesExpiresDays: 1,
        set sessionTotalRamMB(value) {
            if (serveLimits.sessionTotalRamMB == value)
                return;
            serveLimits.sessionTotalRamMB = value;
            buildSession();
        },
        get sessionTotalRamMB() {
            return serveLimits.sessionTotalRamMB;
        },
        set sessionTimeMinutes(value) {
            if (serveLimits.sessionTimeMinutes == value)
                return;
            serveLimits.sessionTimeMinutes = value;
            buildSession();
        },
        get sessionTimeMinutes() {
            return serveLimits.sessionTimeMinutes;
        },
        set sessionCheckPeriodMinutes(value) {
            if (serveLimits.sessionCheckPeriodMinutes == value)
                return;
            serveLimits.sessionCheckPeriodMinutes = value;
            buildSession();
        },
        get sessionCheckPeriodMinutes() {
            return serveLimits.sessionCheckPeriodMinutes;
        },
        set fileLimitMB(value) {
            if (serveLimits.fileLimitMB == value)
                return;
            serveLimits.fileLimitMB = value;
            buildFormidable();
        },
        get fileLimitMB() {
            return serveLimits.fileLimitMB;
        },
        set requestLimitMB(value) {
            if (serveLimits.requestLimitMB == value)
                return;
            serveLimits.requestLimitMB = value;
            buildFormidable();
            buildBodyParser();
        },
        get requestLimitMB() {
            return serveLimits.requestLimitMB;
        }
    },
    serve: {
        port: 8080,
        http2: false,
        greenLock: {
            staging: null,
            cluster: null,
            email: null,
            agent: null,
            agreeToTerms: false,
            sites: []
        }
    }
};
export function buildFormidable() {
    formidableServer = {
        maxFileSize: Export.serveLimits.fileLimitMB * 1048576,
        uploadDir: SystemData + "/UploadFiles/",
        multiples: true,
        maxFieldsSize: Export.serveLimits.requestLimitMB * 1048576
    };
}
export function buildBodyParser() {
    bodyParserServer = bodyParser.json({ limit: Export.serveLimits.requestLimitMB + 'mb' });
}
export function buildSession() {
    if (!Export.serveLimits.sessionTimeMinutes || !Export.serveLimits.sessionTotalRamMB) {
        SessionStore = (req, res, next) => next();
        return;
    }
    SessionStore = session({
        cookie: { maxAge: Export.serveLimits.sessionTimeMinutes * 60 * 1000, sameSite: true },
        secret: SessionSecret,
        resave: false,
        saveUninitialized: false,
        store: new MemoryStore({
            checkPeriod: Export.serveLimits.sessionCheckPeriodMinutes * 60 * 1000,
            max: Export.serveLimits.sessionTotalRamMB * 1048576
        })
    });
}
function copyJSON(to, json, rules = [], rulesType = 'ignore') {
    if (!json)
        return false;
    let hasImpleated = false;
    for (const i in json) {
        const include = rules.includes(i);
        if (rulesType == 'only' && include || rulesType == 'ignore' && !include) {
            hasImpleated = true;
            to[i] = json[i];
        }
    }
    return hasImpleated;
}
// read the settings of the website
export async function requireSettings() {
    const Settings = await GetSettings(Export.settingsPath, DevMode_);
    if (Settings == null)
        return;
    if (Settings.development)
        Object.assign(Settings, Settings.implDev);
    else
        Object.assign(Settings, Settings.implProd);
    copyJSON(Export.compile, Settings.compile);
    copyJSON(Export.routing, Settings.routing, ['ignoreTypes']);
    if (Settings.routing?.ignoreTypes)
        Export.routing.ignoreTypes = Settings.routing.ignoreTypes.concat(baseRoutingIgnoreTypes);
    copyJSON(Export.serveLimits, Settings.serveLimits, ['cacheDays', 'cookiesExpiresDays'], 'only');
    if (copyJSON(serveLimits, Settings.serveLimits, ['sessionTotalRamMB', 'sessionTimeMinutes', 'sessionCheckPeriodMinutes'], 'only')) {
        buildSession();
    }
    if (copyJSON(serveLimits, Settings.serveLimits, ['fileLimitMB', 'requestLimitMB'], 'only')) {
        buildFormidable();
    }
    if (copyJSON(serveLimits, Settings.serveLimits, ['requestLimitMB'], 'only')) {
        buildBodyParser();
    }
    copyJSON(Export.serve, Settings.serve);
    /* --- problematic updates --- */
    Export.development = Settings.development;
    if (Settings.general?.importOnLoad) {
        Export.general.importOnLoad = await StartRequire(Settings.general.importOnLoad, DevMode_);
    }
    //need to down lasted so it won't interfere with 'importOnLoad'
    if (!copyJSON(Export.general, Settings.general, ['pageInRam'], 'only') && Settings.development) {
        pageInRamActivate = await compilationScan;
    }
}
export function buildFirstLoad() {
    buildSession();
    buildFormidable();
    buildBodyParser();
}
//# sourceMappingURL=Settings.js.map