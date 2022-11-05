import {ExportSettings} from "./types.js";
import {v4 as uuidv4} from 'uuid';

const
    CookiesSecret = uuidv4().substring(0, 32),
    SessionSecret = uuidv4();

type BuildStatus = {
    name: 'ok' | 'compiling',
    wait: Promise<any>
}

export const buildStatus: BuildStatus = {
    name: 'ok',
    wait: null
};

const HookBuilt = null;
export const GlobalSettings: ExportSettings = {
    settingsFile: "app.config",
    websiteDirectory: ".",
    development: true,
    middleware: {
        cookies: HookBuilt,
        cookieEncrypter: HookBuilt,
        session: HookBuilt,
        bodyParser: HookBuilt,
        formidable: HookBuilt
    },
    secret: {
        cookies: CookiesSecret,
        session: SessionSecret,
    },
    general: {
        importOnLoad: [],
        logger: {
            level: 'debug'
        },
        pathAlias: {},
    },
    compile: {
        typescript: false,
        ignoreError: [],
        plugins: [],
        define: {},
        globals: {},
    },
    routing: {
        allowExt: [],
        ignoreExt: [],
        ignorePaths: [],
        rewriteURL: {},
        sitemap: {
            file: 'sitemap.xml',
            updateAfterHours: 0
        },
        errorPages: {
            notFound: {
                path: 'error/not-found',
                code: 404
            },
            serverError: {
                path: 'error/server-error',
                code: 500
            }
        }
    },
    serveLimits: {
        cacheDays: 0,
        cookiesExpiresDays: 30,
        sessionTotalRamMB: 512,
        sessionTimeMinutes: 40,
        sessionCheckPeriodMinutes: 30,
        fileLimitMB: 10,
        requestLimitMB: 4,
    },
    serve: {
        port: 3000,
        http2: false,
    }
};