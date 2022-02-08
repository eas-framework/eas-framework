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
import { StartRequire, GetSettings, SettingsExsit } from './ImportModule';
import { Request, Response, NextFunction } from '@tinyhttp/app';
import { Settings as PrintIfNewSettings } from '../OutputInput/PrintNew';
import { Options as TransformOptions } from 'sucrase';
import BetterSqlite3 from 'better-sqlite3';
import ConnectSession from 'better-sqlite3-session-store';

const
    CookiesSecret = uuidv4().substring(0, 32),
    SessionSecret = uuidv4(),
    SequelizeStore = ConnectSession(session),

    CookiesMiddleware = cookieParser(CookiesSecret),
    CookieEncrypterMiddleware = cookieEncrypter(CookiesSecret, {}),
    CookieSettings = { httpOnly: true, signed: true, maxAge: 86400000 * 30 };

fileByUrl.Settings.Cookies = <any>CookiesMiddleware;
fileByUrl.Settings.CookieEncrypter = <any>CookieEncrypterMiddleware;
fileByUrl.Settings.CookieSettings = CookieSettings;

let DevMode_ = true, CompilationEnded: Promise<() => Promise<void>>, SessionStore;

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

interface GlobalSettings {
    RequestLimitMB?: number,
    MaxFileUploadMB?: number,
    SessionTimeMinutes?: number,
    ReapIntervalSessionMinutes?: number,
    CacheDays?: number,
    PageRam?: boolean,
    CookiesExpiresDays?: number,
    Serve?: {
        AppPort?: number,
        http2?: boolean,
        greenlock?: {
            staging?: null,
            cluster?: null,
            email?: string,
            agent?: null,
            agreeToTerms?: boolean,
            sites?: SiteSettings[]
        }
    },
    Routing?: {
        RuleObject?: ((req: Request, _res: Response<any>, url: string) => string)[],
        StopCheckUrls?: string[],
        IgnoreTypes?: string[],
        IgnorePaths?: string[],
        arrayFuncServer?: ((...data: any) => any)[]
    },
    preventCompilationError?: ("close-tag" | "querys-not-found" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" |
        "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning" | "markdown-parser")[],
    AddCompileSyntax?: ("Razor" | "TypeScript" | string | { [key: string]: any })[]
    plugins?: pluginsOptions[],
    ErrorPages?: fileByUrl.ErrorPages
}

interface ExportSettings extends GlobalSettings {
    DevMode: boolean,
    SettingsPath: string,
    CookiesSecret: string,
    SessionSecret: string,
    CookiesMiddleware: TinyhttpPlugin,
    CookieEncrypterMiddleware: TinyhttpPlugin,
    SessionMiddleware: TinyhttpPlugin,
    bodyParser: TinyhttpPlugin
    formidable: formidableServer,
    OnDev: GlobalSettings,
    OnProduction: GlobalSettings
}

export const Export: ExportSettings = {
    set DevMode(value) {
        DevMode_ = value;
        if (!value) {
            CompilationEnded = BuildServer.compileAll();
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
    get CookiesMiddleware(): (req: Request, _res: Response<any>, next?: NextFunction) => void {
        return <any>CookiesMiddleware;
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
        (<any>PrintIfNewSettings).PreventErrors = value;
    },
    get preventCompilationError() {
        return (<any>PrintIfNewSettings).PreventErrors;
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
    OnDev: {

    },
    OnProduction: {

    }
}

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
    bodyParserServer = (<any>bodyParser).json({ limit: Export.RequestLimitMB + 'mb' });
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
    sequelize.pragma('journal_mode = WAL');

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
}

// read the settings of the website
export async function requireSettings() {
    if (await SettingsExsit(Export.SettingsPath)) {
        const Settings = await GetSettings(Export.SettingsPath, DevMode_);

        if (Settings.development)
            Object.assign(Settings, Settings["on-dev"]);

        else
            Object.assign(Settings, Settings["on-production"]);


        if (Settings['add-compile-syntax'])
            Export.AddCompileSyntax = Settings['add-compile-syntax'];


        if (Settings['plugins'])
            Export.plugins = Settings['plugins'];


        if (Settings["prevent-compilation-error"])
            Export.preventCompilationError = Settings["prevent-compilation-error"];


        let makeCompile: () => Promise<void>;
        if (firstLoad || Settings.development != null && Settings.development !== DevMode_) {
            Export.DevMode = Settings.development;
            makeCompile = await CompilationEnded;
        }

        if (Settings["error-pages"])
            Export.ErrorPages = Settings["error-pages"];


        if (Settings["cache-days"])
            Export.CacheDays = Settings["cache-days"];


        if (Settings.rules)
            Export.Routing.RuleObject = Settings.rules;

        if (Settings["stop-url-check"])
            Export.Routing.StopCheckUrls = Settings["stop-url-check"];

        if (Settings["cookies-expires-days"])
            Export.CookiesExpiresDays = Settings["cookies-expires-days"];

        if (Settings['request-limit-mb'] && Settings['request-limit-mb'] != Export.RequestLimitMB) {
            Export.RequestLimitMB = Settings['request-limit-mb'];
            if (!firstLoad) {
                RebodyParserServer();
            }
        }

        if (firstLoad)
            firstLoad = false;

        if (Settings['session-time-minutes'] !== undefined && Settings['session-time-minutes'] != Export.SessionTimeMinutes) {
            Export.SessionTimeMinutes = Settings['session-time-minutes'];
            await ReSessionStore();
        }

        if (Settings['ignore-types']) {
            Export.Routing.IgnoreTypes = Settings['ignore-types'];
            Export.Routing.IgnoreTypes.push(...BasicSettings.ReqFileTypesArray, ...BasicSettings.pageTypesArray);
        }

        if (Settings['ignore-start-paths'])
            Export.Routing.IgnorePaths = Settings['ignore-start-paths'];

        if (Settings['require-on-start'])
            Export.Routing.arrayFuncServer = <any>await StartRequire(Settings['require-on-start'], DevMode_);
        else
            Export.Routing.arrayFuncServer = [];

        Export.Routing.arrayFuncServer.push(async () => {
            await makeCompile?.();

            if (Settings["save-page-ram"] != null) {
                if (!Export.PageRam && Settings["save-page-ram"]) {
                    await fileByUrl.LoadAllPagesToRam();
                }
                Export.PageRam = Settings["save-page-ram"];
                if (!Export.PageRam) {
                    fileByUrl.ClearAllPagesFromRam();
                }
            }
        });

        if (CheckChange(ReserverChange, Settings))
            ReformidableServer();

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

    } else {
        Export.DevMode = DevMode_;
        await (await CompilationEnded)?.();
    }
}