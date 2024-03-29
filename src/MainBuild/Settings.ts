import * as fileByUrl from '../RunTimeBuild/GetPages';
import {v4 as uuidv4} from 'uuid';
import {BasicSettings, SystemData, workingDirectory} from '../RunTimeBuild/SearchFileSystem';
import * as BuildServer from '../RunTimeBuild/SearchPages';
import {cookieParser} from '@tinyhttp/cookie-parser';
import cookieEncrypter from 'cookie-encrypter';
import {allowPrint} from '../OutputInput/Console';
import session from 'express-session';
import {Settings as InsertModelsSettings} from '../CompileCode/InsertModels';
import bodyParser from 'body-parser';
import {GetSettings, StartRequire} from './ImportModule';
import {NextFunction, Request, Response} from '@tinyhttp/app';
import {Settings as createNewPrintSettings} from '../OutputInput/Logger';
import MemorySession from 'memorystore';
import {ExportSettings} from './SettingsTypes';
import {settings as defineSettings} from '../CompileCode/CompileScript/PageBase';
import {Export as ExportRam} from '../RunTimeBuild/FunctionScript';
import {TransformSettings} from '../CompileCode/transform/Script';
import {SyntaxSettings} from '../CompileCode/transform/EasySyntax';
import {DevAllowWebsiteExtensions, DevIgnoredWebsiteExtensions, updateDevAllowWebsiteExtensions, updateDevIgnoredWebsiteExtensions} from '../ImportFiles/StaticFiles';
import {cacheSitemap, GlobalSitemapBuilder} from '../CompileCode/XMLHelpers/SitemapBuilder';

export const MB_IN_BYTES = 1048576;

export const MINUIT_MILLISECONDS = 60 * 1000;
export const HOUR_MILLISECONDS = MINUIT_MILLISECONDS * 60;
export const DAY_MILLISECONDS = 86400000;

const MemoryStore = MemorySession(session);
let CookiesSecret = uuidv4().substring(0, 32);
let SessionSecret = uuidv4();
let sessionStore: any = null;

function updateCookiesMiddleware(cookiesSecret: string) {
    fileByUrl.Settings.Cookies = <any>cookieParser(cookiesSecret);
    fileByUrl.Settings.CookieEncrypter = <any>cookieEncrypter(cookiesSecret, {});
}

fileByUrl.Settings.CookieSettings = {httpOnly: true, signed: true, maxAge: DAY_MILLISECONDS * 30};

let DevMode_ = true, compilationScan: Promise<() => Promise<void>>, SessionStore;

let formidableServer: any, bodyParserServer: any;

const serveLimits = {
    sessionTotalRamMB: 150,
    sessionTimeMinutes: 40,
    sessionCheckPeriodMinutes: 30,
    fileLimitMB: 10,
    requestLimitMB: 4
};

let pageInRamActivate: () => Promise<void>;

export function pageInRamActivateFunc() {
    return pageInRamActivate;
}

const baseRoutingIgnoreTypes = [...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray, ...BasicSettings.pageCodeFileArray];
const baseValidPath = [(path: string) => path.split('.').at(-2) != 'serv']; // ignoring files that ends with .serv.*

export const Export: ExportSettings = {
    get settingsPath() {
        return workingDirectory + BasicSettings.WebSiteFolder + '/Settings';
    },
    get websiteDirectory() {
        return BasicSettings.WebSiteFolder;
    },
    set websiteDirectory(directory) {
        BasicSettings.WebSiteFolder = directory;
    },
    set development(value) {
        if (DevMode_ == value) return;
        DevMode_ = value;
        if (!value) {
            compilationScan = BuildServer.compileAll(Export);
            process.env.NODE_ENV = 'production';
        }
        fileByUrl.Settings.DevMode = value;
        allowPrint(value);
    },
    get development() {
        return DevMode_;
    },
    middleware: {
        get cookies(): (req: Request, _res: Response<any>, next?: NextFunction) => void {
            return <any>fileByUrl.Settings.Cookies;
        },
        get cookieEncrypter() {
            return fileByUrl.Settings.CookieEncrypter;
        },
        get session() {
            return SessionStore;
        },
        get sessionStore() {
            return sessionStore;
        },
        get formidable() {
            return formidableServer;
        },
        get bodyParser() {
            return bodyParserServer;
        },
        set cookies(value: any) {
            fileByUrl.Settings.Cookies = value;
        },
        set cookieEncrypter(value) {
            fileByUrl.Settings.CookieEncrypter = value;
        },
        set session(value) {
            SessionStore = value;
        },
        set sessionStore(value) {
            sessionStore = value;
            buildSession();
        }
    },
    secret: {
        get cookies() {
            return CookiesSecret;
        },
        get session() {
            return SessionSecret;
        },
        set cookies(value) {
            CookiesSecret = value;
            updateCookiesMiddleware(value);
        },
        set session(value) {
            SessionSecret = value;
            buildSession();
        }
    },
    general: {
        importOnLoad: [],
        set pageInRam(value) {
            ExportRam.PageRam = value;
            pageInRamActivate = async () => {
                const preparations = await compilationScan;
                await preparations?.();
                if (value) {
                    await fileByUrl.LoadAllPagesToRam(Export.development);
                } else {
                    fileByUrl.ClearAllPagesFromRam();
                }
            };
        },
        get pageInRam() {
            return ExportRam.PageRam;
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
            (<any>createNewPrintSettings).PreventErrors = value;
        },
        get ignoreError() {
            return (<any>createNewPrintSettings).PreventErrors;
        },
        set plugins(value) {
            InsertModelsSettings.plugins.length = 0;
            InsertModelsSettings.plugins.push(...value);
        },
        get plugins() {
            return InsertModelsSettings.plugins;
        },
        get define() {
            return defineSettings.define;
        },
        set define(value) {
            defineSettings.define = value;
        },
        get pathAliases() {
            return SyntaxSettings.pathAliases;
        },
        set pathAliases(value) {
            SyntaxSettings.pathAliases = value;
        },
        get globals() {
            return TransformSettings.globals;
        },
        set globals(value) {
            for (const i in value) {
                value[i] = String(value[i]);
            }
            TransformSettings.globals = value;
        }
    },
    routing: {
        rules: {},
        urlStop: [],
        validPath: baseValidPath,
        get allowExt() {
            return DevAllowWebsiteExtensions;
        },
        set allowExt(value) {
            updateDevAllowWebsiteExtensions(value);
        },
        get ignoreExt() {
            return DevIgnoredWebsiteExtensions;
        },
        set ignoreExt(value) {
            updateDevIgnoredWebsiteExtensions(value);
        },
        ignorePaths: [],
        sitemap: {
            get file() {
                return GlobalSitemapBuilder.location;
            },
            set file(value) {
                GlobalSitemapBuilder.location = value;
            },
            get updateAfterHours() {
                return cacheSitemap.internal / HOUR_MILLISECONDS;
            },
            set updateAfterHours(value) {
                cacheSitemap.internal = value * HOUR_MILLISECONDS;
            }
        },
        get errorPages() {
            return fileByUrl.Settings.ErrorPages;
        },
        set errorPages(value) {
            fileByUrl.Settings.ErrorPages = value;
        }
    },
    serveLimits: {
        get cacheDays() {
            return fileByUrl.Settings.CacheDays;
        },
        set cacheDays(value) {
            fileByUrl.Settings.CacheDays = value;
        },
        get cookiesExpiresDays() {
            return fileByUrl.Settings.CookieSettings.maxAge / DAY_MILLISECONDS;
        },
        set cookiesExpiresDays(value) {
            fileByUrl.Settings.CookieSettings.maxAge = value * DAY_MILLISECONDS;
        },
        set sessionTotalRamMB(value: number) {
            if (serveLimits.sessionTotalRamMB == value) return;
            serveLimits.sessionTotalRamMB = value;
            buildSession();
        },
        get sessionTotalRamMB() {
            return serveLimits.sessionTotalRamMB;
        },
        set sessionTimeMinutes(value: number) {
            if (serveLimits.sessionTimeMinutes == value) return;
            serveLimits.sessionTimeMinutes = value;
            buildSession();

        },
        get sessionTimeMinutes() {
            return serveLimits.sessionTimeMinutes;
        },
        set sessionCheckPeriodMinutes(value: number) {
            if (serveLimits.sessionCheckPeriodMinutes == value) return;
            serveLimits.sessionCheckPeriodMinutes = value;
            buildSession();

        },
        get sessionCheckPeriodMinutes() {
            return serveLimits.sessionCheckPeriodMinutes;
        },
        set fileLimitMB(value: number) {
            if (serveLimits.fileLimitMB == value) return;
            serveLimits.fileLimitMB = value;
            buildFormidable();

        },
        get fileLimitMB() {
            return serveLimits.fileLimitMB;
        },
        set requestLimitMB(value: number) {
            if (serveLimits.requestLimitMB == value) return;
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
        maxFileSize: Export.serveLimits.fileLimitMB * MB_IN_BYTES,
        uploadDir: SystemData + '/UploadFiles/',
        multiples: true,
        maxFieldsSize: Export.serveLimits.requestLimitMB * MB_IN_BYTES
    };
}

export function buildBodyParser() {
    bodyParserServer = (<any>bodyParser).json({limit: Export.serveLimits.requestLimitMB + 'mb'});
}


export function buildSession() {
    if (!Export.serveLimits.sessionTimeMinutes || !Export.serveLimits.sessionTotalRamMB) {
        SessionStore = (req, res, next) => next();
        return;
    }

    SessionStore = session({
        cookie: {maxAge: Export.serveLimits.sessionTimeMinutes * MINUIT_MILLISECONDS, sameSite: true},
        secret: SessionSecret,
        resave: false,
        saveUninitialized: false,
        store: Export.middleware.sessionStore ?? new MemoryStore({
            checkPeriod: Export.serveLimits.sessionCheckPeriodMinutes * MINUIT_MILLISECONDS,
            max: Export.serveLimits.sessionTotalRamMB * MB_IN_BYTES
        })
    });
}

function copyJSON(to: any, json: any, rules: string[] = [], rulesType: 'ignore' | 'only' = 'ignore') {
    if (!json) return false;
    let hasImplanted = false;
    for (const i in json) {
        const include = rules.includes(i);
        if (rulesType == 'only' && include || rulesType == 'ignore' && !include) {
            hasImplanted = true;
            to[i] = json[i];
        }
    }
    return hasImplanted;
}

/**
 * Merge the nested objects in the from object into the nested objects in the target object.
 * @param {any} target - any - The target object to merge into.
 * @param from - {[key: string]: {[key: string]: any}}
 */
function mergeNested1(target: any, from?: { [key: string]: { [key: string]: any } }) {
    if (!from) return;
    for (const i in from) {
        target[i] ??= {};
        Object.assign(target[i], from[i]);
    }
}

// read the settings of the website
export async function requireSettings() {
    const Settings: ExportSettings = await GetSettings(Export);
    if (Settings == null) return;

    if (Settings.development)
        mergeNested1(Settings, <any>Settings.implDev);

    else
        mergeNested1(Settings, <any>Settings.implProd);

    copyJSON(Export.compile, Settings.compile);

    copyJSON(Export.routing, Settings.routing, ['validPath', 'sitemap']);
    copyJSON(Export.routing.sitemap, Settings.routing?.sitemap);


    //concat default values of routing
    const concatArray = (name: string, array: any[]) => Settings.routing?.[name] && (Export.routing[name] = Settings.routing[name].concat(array));
    concatArray('validPath', baseValidPath);

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
        Export.general.importOnLoad = <any>await StartRequire(<any>Settings.general.importOnLoad, DevMode_);
    }

    //need to down lasted so it won't interfere with 'importOnLoad'
    if (!copyJSON(Export.general, Settings.general, ['pageInRam'], 'only') && Settings.development) {
        pageInRamActivate = await compilationScan;
    }
}

/**
 * If you change to production build on run time, this you need to call this to make sure the production build is used
 */
export async function waitProductionBuild() {
    await (await compilationScan)?.();
}

export function buildFirstLoad() {
    updateCookiesMiddleware(CookiesSecret);
    buildSession();
    buildFormidable();
    buildBodyParser();
}
