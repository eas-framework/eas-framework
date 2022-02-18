import * as fileByUrl from '../RunTimeBuild/GetPages';
import { v4 as uuidv4 } from 'uuid';
import { BasicSettings, workingDirectory, SystemData } from '../RunTimeBuild/SearchFileSystem';
import * as BuildServer from '../RunTimeBuild/SearchPages';
import { cookieParser } from '@tinyhttp/cookie-parser';
import cookieEncrypter from 'cookie-encrypter';
import { SetDevMode } from '../OutputInput/Console';
import session from 'express-session';
import { Settings as InsertModelsSettings } from '../CompileCode/InsertModels';
import bodyParser from 'body-parser';
import { StartRequire, GetSettings } from './ImportModule';
import { Request, Response, NextFunction } from '@tinyhttp/app';
import { Settings as PrintIfNewSettings } from '../OutputInput/PrintNew';
import { Options as TransformOptions } from 'sucrase';
import MemorySession from 'memorystore';

const
    CookiesSecret = uuidv4().substring(0, 32),
    SessionSecret = uuidv4(),
    MemoryStore = MemorySession(session),

    CookiesMiddleware = cookieParser(CookiesSecret),
    CookieEncrypterMiddleware = cookieEncrypter(CookiesSecret, {}),
    CookieSettings = { httpOnly: true, signed: true, maxAge: 86400000 * 30 };

fileByUrl.Settings.Cookies = <any>CookiesMiddleware;
fileByUrl.Settings.CookieEncrypter = <any>CookieEncrypterMiddleware;
fileByUrl.Settings.CookieSettings = CookieSettings;

let DevMode_ = true, compilationScan: Promise<() => Promise<void>>, SessionStore;

let formidableServer, bodyParserServer;

export interface GreenLockSite {
    subject: string,
    altnames: string[]
}

interface formidableServer {
    maxFileSize: number,
    uploadDir: string,
    multiples: boolean,
    maxFieldsSize: number,
};

type TinyhttpPlugin = (req: Request, res: Response<any>, next?: NextFunction) => void;

/**
 * example:
 * @param subject example.com
 * @param altnames: www.example.com, cool.example.com
 */
interface SiteSettings {
    subject: string,
    altnames: string[]
}

interface JSXOptions extends TransformOptions {
    name: "JSXOptions"
}

interface TSXOptions extends TransformOptions {
    name: "TSXOptions"
}

interface transformOptions extends TransformOptions {
    name: "transformOptions"
}

interface Markdown {
    name: "markdown",
    theme: 'a11y-dark' | 'a11y-light' | 'agate' | 'an-old-hope' | 'androidstudio' | 'arduino-light' | 'arta' | 'ascetic' | 'atom-one-dark-reasonable' | 'atom-one-dark' | 'atom-one-light' | 'base16/3024' | 'base16/apathy' | 'base16/apprentice' | 'base16/ashes' | 'base16/atelier-cave-light' | 'base16/atelier-cave' | 'base16/atelier-dune-light' | 'base16/atelier-dune' | 'base16/atelier-estuary-light' | 'base16/atelier-estuary' | 'base16/atelier-forest-light' | 'base16/atelier-forest' | 'base16/atelier-heath-light' | 'base16/atelier-heath' | 'base16/atelier-lakeside-light' | 'base16/atelier-lakeside' | 'base16/atelier-plateau-light' | 'base16/atelier-plateau' | 'base16/atelier-savanna-light' | 'base16/atelier-savanna' | 'base16/atelier-seaside-light' | 'base16/atelier-seaside' | 'base16/atelier-sulphurpool-light' | 'base16/atelier-sulphurpool' | 'base16/atlas' | 'base16/bespin' | 'base16/black-metal-bathory' | 'base16/black-metal-burzum' | 'base16/black-metal-dark-funeral' | 'base16/black-metal-gorgoroth' | 'base16/black-metal-immortal' | 'base16/black-metal-khold' | 'base16/black-metal-marduk' | 'base16/black-metal-mayhem' | 'base16/black-metal-nile' | 'base16/black-metal-venom' | 'base16/black-metal' | 'base16/brewer' | 'base16/bright' | 'base16/brogrammer' | 'base16/brush-trees-dark' | 'base16/brush-trees' | 'base16/chalk' | 'base16/circus' | 'base16/classic-dark' | 'base16/classic-light' | 'base16/codeschool' | 'base16/colors' | 'base16/cupcake' | 'base16/cupertino' | 'base16/danqing' | 'base16/darcula' | 'base16/dark-violet' | 'base16/darkmoss' | 'base16/darktooth' | 'base16/decaf' | 'base16/default-dark' | 'base16/default-light' | 'base16/dirtysea' | 'base16/dracula' | 'base16/edge-dark' | 'base16/edge-light' | 'base16/eighties' | 'base16/embers' | 'base16/equilibrium-dark' | 'base16/equilibrium-gray-dark' | 'base16/equilibrium-gray-light' | 'base16/equilibrium-light' | 'base16/espresso' | 'base16/eva-dim' | 'base16/eva' | 'base16/flat' | 'base16/framer' | 'base16/fruit-soda' | 'base16/gigavolt' | 'base16/github' | 'base16/google-dark' | 'base16/google-light' | 'base16/grayscale-dark' | 'base16/grayscale-light' | 'base16/green-screen' | 'base16/gruvbox-dark-hard' | 'base16/gruvbox-dark-medium' | 'base16/gruvbox-dark-pale' | 'base16/gruvbox-dark-soft' | 'base16/gruvbox-light-hard' | 'base16/gruvbox-light-medium' | 'base16/gruvbox-light-soft' | 'base16/hardcore' | 'base16/harmonic16-dark' | 'base16/harmonic16-light' | 'base16/heetch-dark' | 'base16/heetch-light' | 'base16/helios' | 'base16/hopscotch' | 'base16/horizon-dark' | 'base16/horizon-light' | 'base16/humanoid-dark' | 'base16/humanoid-light' | 'base16/ia-dark' | 'base16/ia-light' | 'base16/icy-dark' | 'base16/ir-black' | 'base16/isotope' | 'base16/kimber' | 'base16/london-tube' | 'base16/macintosh' | 'base16/marrakesh' | 'base16/materia' | 'base16/material-darker' | 'base16/material-lighter' | 'base16/material-palenight' | 'base16/material-vivid' | 'base16/material' | 'base16/mellow-purple' | 'base16/mexico-light' | 'base16/mocha' | 'base16/monokai' | 'base16/nebula' | 'base16/nord' | 'base16/nova' | 'base16/ocean' | 'base16/oceanicnext' | 'base16/one-light' | 'base16/onedark' | 'base16/outrun-dark' | 'base16/papercolor-dark' | 'base16/papercolor-light' | 'base16/paraiso' | 'base16/pasque' | 'base16/phd' | 'base16/pico' | 'base16/pop' | 'base16/porple' | 'base16/qualia' | 'base16/railscasts' | 'base16/rebecca' | 'base16/ros-pine-dawn' | 'base16/ros-pine-moon' | 'base16/ros-pine' | 'base16/sagelight' | 'base16/sandcastle' | 'base16/seti-ui' | 'base16/shapeshifter' | 'base16/silk-dark' | 'base16/silk-light' | 'base16/snazzy' | 'base16/solar-flare-light' | 'base16/solar-flare' | 'base16/solarized-dark' | 'base16/solarized-light' | 'base16/spacemacs' | 'base16/summercamp' | 'base16/summerfruit-dark' | 'base16/summerfruit-light' | 'base16/synth-midnight-terminal-dark' | 'base16/synth-midnight-terminal-light' | 'base16/tango' | 'base16/tender' | 'base16/tomorrow-night' | 'base16/tomorrow' | 'base16/twilight' | 'base16/unikitty-dark' | 'base16/unikitty-light' | 'base16/vulcan' | 'base16/windows-10-light' | 'base16/windows-10' | 'base16/windows-95-light' | 'base16/windows-95' | 'base16/windows-high-contrast-light' | 'base16/windows-high-contrast' | 'base16/windows-nt-light' | 'base16/windows-nt' | 'base16/woodland' | 'base16/xcode-dusk' | 'base16/zenburn' | 'brown-paper' | 'codepen-embed' | 'color-brewer' | 'dark' | 'default' | 'devibeans' | 'docco' | 'far' | 'foundation' | 'github-dark-dimmed' | 'github-dark' | 'github' | 'gml' | 'googlecode' | 'gradient-dark' | 'gradient-light' | 'grayscale' | 'hybrid' | 'idea' | 'intellij-light' | 'ir-black' | 'isbl-editor-dark' | 'isbl-editor-light' | 'kimbie-dark' | 'kimbie-light' | 'lightfair' | 'lioshi' | 'magula' | 'mono-blue' | 'monokai-sublime' | 'monokai' | 'night-owl' | 'nnfx-dark' | 'nnfx-light' | 'nord' | 'obsidian' | 'paraiso-dark' | 'paraiso-light' | 'pojoaque' | 'purebasic' | 'qtcreator-dark' | 'qtcreator-light' | 'rainbow' | 'routeros' | 'school-book' | 'shades-of-purple' | 'srcery' | 'stackoverflow-dark' | 'stackoverflow-light' | 'sunburst' | 'tomorrow-night-blue' | 'tomorrow-night-bright' | 'vs' | 'vs2015' | 'xcode' | 'xt256',
    linkify: boolean,
    breaks: boolean,
    typographer: boolean,
    hljsClass: boolean
}

type pluginsOptions = "MinAll" | "MinHTML" | "MinCss" | "MinSass" | "MinJS" | "MinTS" | "MinJSX" | JSXOptions | "MinTSX" | TSXOptions | transformOptions | "SafeDebug" | Markdown;

interface serveLimits {
    cacheDays?: number,
    fileLimitMB?: number,
    requestLimitMB?: number,
    cookiesExpiresDays?: number,
    sessionTotalRamMB?: number,
    sessionTimeMinutes?: number,
    sessionCheckPeriodMinutes?: number
}

const serveLimits = {
    sessionTotalRamMB: 150,
    sessionTimeMinutes: 40,
    sessionCheckPeriodMinutes: 30,
    fileLimitMB: 10,
    requestLimitMB: 4
}

interface GlobalSettings {
    general?: {
        pageInRam?: boolean,
        importOnLoad?: ((...data: any) => any)[]
    },
    compile?: {
        compileSyntax?: ("Razor" | "TypeScript" | string | { [key: string]: any })[]
        ignoreError?: ("close-tag" | "querys-not-found" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" |
            "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning" | "markdown-parser")[],
        plugins?: pluginsOptions[]
    },
    routing?: {
        rules?: ((req: Request, _res: Response<any>, url: string) => string)[],
        errorPages?: fileByUrl.ErrorPages
        urlStop?: string[],
        ignoreTypes?: string[],
        ignorePaths?: string[],
    },
    serveLimits: serveLimits
    serve?: {
        port?: number,
        http2?: boolean,
        greenLock?: {
            staging?: null,
            cluster?: null,
            email?: string,
            agent?: null,
            agreeToTerms?: boolean,
            sites?: SiteSettings[]
        }
    }
}

let pageInRamActivate: () => Promise<void>;
export function pageInRamActivateFunc(){
    return pageInRamActivate;
}

const baseRoutingIgnoreTypes = [...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray, ...BasicSettings.pageCodeFileArray];

interface ExportSettings extends GlobalSettings {
    development: boolean,
    settingsPath: string,
    middleware: {
        cookies: TinyhttpPlugin
        cookieEncrypter: TinyhttpPlugin
        session: TinyhttpPlugin
        bodyParser: TinyhttpPlugin
        formidable: formidableServer
    }

    secret: {
        cookies: string
        session: string
    }

    implDev?: GlobalSettings,
    implProd?: GlobalSettings
}

export const Export: ExportSettings = {
    get settingsPath() {
        return workingDirectory + BasicSettings.WebSiteFolder + "/Settings";
    },
    set development(value) {
        DevMode_ = value;
        if (!value) {
            compilationScan = BuildServer.compileAll();
            process.env.NODE_ENV = "production";
        }
        fileByUrl.Settings.DevMode = value;
        SetDevMode(value);
    },
    get development() {
        return DevMode_;
    },
    middleware: {
        get cookies(): (req: Request, _res: Response<any>, next?: NextFunction) => void {
            return <any>CookiesMiddleware;
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
            fileByUrl.Settings.PageRam = value;
            pageInRamActivate = async () => {
                const preparations = await compilationScan;
                await preparations?.();
                if (!fileByUrl.Settings.PageRam) {
                    await fileByUrl.LoadAllPagesToRam();
                } else if (!value) {
                    fileByUrl.ClearAllPagesFromRam();
                }
            }
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
            (<any>PrintIfNewSettings).PreventErrors = value;
        },
        get ignoreError() {
            return (<any>PrintIfNewSettings).PreventErrors;
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
        set sessionTotalRamMB(value: number) {
            serveLimits.sessionTotalRamMB = value;
            buildSession();
        },
        get sessionTotalRamMB(){
            return serveLimits.sessionTotalRamMB;
        },
        set sessionTimeMinutes(value: number) {
            serveLimits.sessionTimeMinutes = value;
            buildSession();

        },
        get sessionTimeMinutes() {
            return serveLimits.sessionTimeMinutes;
        },
        set sessionCheckPeriodMinutes(value: number) {
            serveLimits.sessionCheckPeriodMinutes = value;
            buildSession();

        },
        get sessionCheckPeriodMinutes() {
            return serveLimits.sessionCheckPeriodMinutes;
        },
        set fileLimitMB(value: number) {
            serveLimits.fileLimitMB = value;
            buildFormidable();

        },
        get fileLimitMB() {
            return serveLimits.fileLimitMB;
        },
        set requestLimitMB(value: number) {
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
}

export function buildFormidable() {
    formidableServer = {
        maxFileSize: Export.serveLimits.fileLimitMB * 1048576,
        uploadDir: SystemData + "/UploadFiles/",
        multiples: true,
        maxFieldsSize: Export.serveLimits.requestLimitMB * 1048576
    };
}

export function buildBodyParser() {
    bodyParserServer = (<any>bodyParser).json({ limit: Export.serveLimits.requestLimitMB + 'mb' });
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

function copyJSON(to: any, json: any, rules: string[] = [], rulesType: 'ignore' | 'only' = 'ignore') {
    if(!json) return false;
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
    const Settings: ExportSettings = await GetSettings(Export.settingsPath, DevMode_);
    if(Settings == null) return;

    if (Settings.development)
        Object.assign(Settings, Settings.implDev);

    else
        Object.assign(Settings, Settings.implProd);


    copyJSON(Export.compile, Settings.compile);

    copyJSON(Export.routing, Settings.routing, ['ignoreTypes']);

    if(Settings.routing?.ignoreTypes)
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
    if(DevMode_ != Settings.development){
        Export.development = Settings.development
    }

    if (Settings.general?.importOnLoad) {
        Export.general.importOnLoad = <any>await StartRequire(<any>Settings.general.importOnLoad, DevMode_);
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