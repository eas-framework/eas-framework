import {JscConfig as TransformOptions} from '@swc/core';
import {NextFunction, Request, Response} from '@tinyhttp/app';

export type StringNumberMap = { [key: string]: number }
export type StringAnyMap = { [key: string]: any };
export type StringMap = { [key: string]: string };

export interface ErrorPages {
    notFound?: {
        path: string,
        code?: number
    },
    serverError?: {
        path: string,
        code?: number
    }
}

interface formidableServer {
    maxFileSize: number,
    uploadDir: string,
    multiples: boolean,
    maxFieldsSize: number,
};

type TinyhttpPlugin = (req: Request, res: Response<any>, next?: NextFunction) => void;


export interface JSXOptions extends TransformOptions {
    name: "JSXOptions";
}

export interface TSXOptions extends TransformOptions {
    name: "TSXOptions";
}

export interface transformOptions extends TransformOptions {
    name: "transformOptions";
}

export interface Markdown {
    name: "markdown",
    codeTheme: 'none' | 'atom-one' | 'a11y-dark' | 'a11y-light' | 'agate' | 'an-old-hope' | 'androidstudio' | 'arduino-light' | 'arta' | 'ascetic' | 'atom-one-dark-reasonable' | 'atom-one-dark' | 'atom-one-light' | 'base16/3024' | 'base16/apathy' | 'base16/apprentice' | 'base16/ashes' | 'base16/atelier-cave-light' | 'base16/atelier-cave' | 'base16/atelier-dune-light' | 'base16/atelier-dune' | 'base16/atelier-estuary-light' | 'base16/atelier-estuary' | 'base16/atelier-forest-light' | 'base16/atelier-forest' | 'base16/atelier-heath-light' | 'base16/atelier-heath' | 'base16/atelier-lakeside-light' | 'base16/atelier-lakeside' | 'base16/atelier-plateau-light' | 'base16/atelier-plateau' | 'base16/atelier-savanna-light' | 'base16/atelier-savanna' | 'base16/atelier-seaside-light' | 'base16/atelier-seaside' | 'base16/atelier-sulphurpool-light' | 'base16/atelier-sulphurpool' | 'base16/atlas' | 'base16/bespin' | 'base16/black-metal-bathory' | 'base16/black-metal-burzum' | 'base16/black-metal-dark-funeral' | 'base16/black-metal-gorgoroth' | 'base16/black-metal-immortal' | 'base16/black-metal-khold' | 'base16/black-metal-marduk' | 'base16/black-metal-mayhem' | 'base16/black-metal-nile' | 'base16/black-metal-venom' | 'base16/black-metal' | 'base16/brewer' | 'base16/bright' | 'base16/brogrammer' | 'base16/brush-trees-dark' | 'base16/brush-trees' | 'base16/chalk' | 'base16/circus' | 'base16/classic-dark' | 'base16/classic-light' | 'base16/codeschool' | 'base16/colors' | 'base16/cupcake' | 'base16/cupertino' | 'base16/danqing' | 'base16/darcula' | 'base16/dark-violet' | 'base16/darkmoss' | 'base16/darktooth' | 'base16/decaf' | 'base16/default-dark' | 'base16/default-light' | 'base16/dirtysea' | 'base16/dracula' | 'base16/edge-dark' | 'base16/edge-light' | 'base16/eighties' | 'base16/embers' | 'base16/equilibrium-dark' | 'base16/equilibrium-gray-dark' | 'base16/equilibrium-gray-light' | 'base16/equilibrium-light' | 'base16/espresso' | 'base16/eva-dim' | 'base16/eva' | 'base16/flat' | 'base16/framer' | 'base16/fruit-soda' | 'base16/gigavolt' | 'base16/github' | 'base16/google-dark' | 'base16/google-light' | 'base16/grayscale-dark' | 'base16/grayscale-light' | 'base16/green-screen' | 'base16/gruvbox-dark-hard' | 'base16/gruvbox-dark-medium' | 'base16/gruvbox-dark-pale' | 'base16/gruvbox-dark-soft' | 'base16/gruvbox-light-hard' | 'base16/gruvbox-light-medium' | 'base16/gruvbox-light-soft' | 'base16/hardcore' | 'base16/harmonic16-dark' | 'base16/harmonic16-light' | 'base16/heetch-dark' | 'base16/heetch-light' | 'base16/helios' | 'base16/hopscotch' | 'base16/horizon-dark' | 'base16/horizon-light' | 'base16/humanoid-dark' | 'base16/humanoid-light' | 'base16/ia-dark' | 'base16/ia-light' | 'base16/icy-dark' | 'base16/ir-black' | 'base16/isotope' | 'base16/kimber' | 'base16/london-tube' | 'base16/macintosh' | 'base16/marrakesh' | 'base16/materia' | 'base16/material-darker' | 'base16/material-lighter' | 'base16/material-palenight' | 'base16/material-vivid' | 'base16/material' | 'base16/mellow-purple' | 'base16/mexico-light' | 'base16/mocha' | 'base16/monokai' | 'base16/nebula' | 'base16/nord' | 'base16/nova' | 'base16/ocean' | 'base16/oceanicnext' | 'base16/one-light' | 'base16/onedark' | 'base16/outrun-dark' | 'base16/papercolor-dark' | 'base16/papercolor-light' | 'base16/paraiso' | 'base16/pasque' | 'base16/phd' | 'base16/pico' | 'base16/pop' | 'base16/porple' | 'base16/qualia' | 'base16/railscasts' | 'base16/rebecca' | 'base16/ros-pine-dawn' | 'base16/ros-pine-moon' | 'base16/ros-pine' | 'base16/sagelight' | 'base16/sandcastle' | 'base16/seti-ui' | 'base16/shapeshifter' | 'base16/silk-dark' | 'base16/silk-light' | 'base16/snazzy' | 'base16/solar-flare-light' | 'base16/solar-flare' | 'base16/solarized-dark' | 'base16/solarized-light' | 'base16/spacemacs' | 'base16/summercamp' | 'base16/summerfruit-dark' | 'base16/summerfruit-light' | 'base16/synth-midnight-terminal-dark' | 'base16/synth-midnight-terminal-light' | 'base16/tango' | 'base16/tender' | 'base16/tomorrow-night' | 'base16/tomorrow' | 'base16/twilight' | 'base16/unikitty-dark' | 'base16/unikitty-light' | 'base16/vulcan' | 'base16/windows-10-light' | 'base16/windows-10' | 'base16/windows-95-light' | 'base16/windows-95' | 'base16/windows-high-contrast-light' | 'base16/windows-high-contrast' | 'base16/windows-nt-light' | 'base16/windows-nt' | 'base16/woodland' | 'base16/xcode-dusk' | 'base16/zenburn' | 'brown-paper' | 'codepen-embed' | 'color-brewer' | 'dark' | 'default' | 'devibeans' | 'docco' | 'far' | 'foundation' | 'github-dark-dimmed' | 'github-dark' | 'github' | 'gml' | 'googlecode' | 'gradient-dark' | 'gradient-light' | 'grayscale' | 'hybrid' | 'idea' | 'intellij-light' | 'ir-black' | 'isbl-editor-dark' | 'isbl-editor-light' | 'kimbie-dark' | 'kimbie-light' | 'lightfair' | 'lioshi' | 'magula' | 'mono-blue' | 'monokai-sublime' | 'monokai' | 'night-owl' | 'nnfx-dark' | 'nnfx-light' | 'nord' | 'obsidian' | 'paraiso-dark' | 'paraiso-light' | 'pojoaque' | 'purebasic' | 'qtcreator-dark' | 'qtcreator-light' | 'rainbow' | 'routeros' | 'school-book' | 'shades-of-purple' | 'srcery' | 'stackoverflow-dark' | 'stackoverflow-light' | 'sunburst' | 'tomorrow-night-blue' | 'tomorrow-night-bright' | 'vs' | 'vs2015' | 'xcode' | 'xt256',
    theme: 'dark' | 'light' | 'auto' | 'none',
    headerLink: boolean
    attrs: boolean
    abbr: boolean
    copyCode: boolean
    linkify: boolean,
    breaks: boolean,
    typographer: boolean,
    hljsClass: boolean
}

type pluginsOptions =
    "minify"
    | "not-minify-HTML"
    | "safe-debug"
    | JSXOptions
    | TSXOptions
    | transformOptions
    | Markdown;

export interface serveLimits {
    cacheDays?: number,
    fileLimitMB?: number,
    requestLimitMB?: number,
    cookiesExpiresDays?: number,
    sessionTotalRamMB?: number,
    sessionTimeMinutes?: number,
    sessionCheckPeriodMinutes?: number
}

interface GlobalSettings {
    general?: {
        importOnLoad?: string[],
        logger?: {
            level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off',
            file?: string
        }
        pathAlias?: StringMap
    },
    compile?: {
        typescript?: boolean
        ignoreError?: ("close-tag" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" |
            "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning" | "markdown-parser")[],
        plugins?: pluginsOptions[]
        define: { [key: string]: string | number | boolean | null }
        globals?: StringMap
    },
    routing?: {
        errorPages?: ErrorPages
        allowExt?: string[], // extends allowed file extensions, only thous can be served - default list on StaticFiles.ts
        ignoreExt?: string[], // ignore file extensions - override default allowed extension (default - common server files)
        ignorePaths?: string[], // hide paths from the server
        rewriteURL: StringMap, // https://www.npmjs.com/package/express-urlrewrite
        sitemap?: {
            rules?: boolean,
            urlStop?: boolean,
            errorPages?: boolean,
            ignoreExt?: boolean
            file?: string // where to save the sitemap
            updateAfterHours?: number // update sitemap on new request after x hours
        }
    },
    serveLimits: serveLimits
    serve?: {
        port?: number,
        http2?: boolean,
    }
}

export interface ExportSettings extends GlobalSettings {
    development: boolean,
    settingsFile: string,
    websiteDirectory: string,
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
    reload?: (settingsFile?: string) => Promise<void>
}