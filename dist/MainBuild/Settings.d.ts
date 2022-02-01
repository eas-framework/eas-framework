import * as fileByUrl from '../RunTimeBuild/GetPages';
import { Request, Response, NextFunction } from '@tinyhttp/app';
import { Options as TransformOptions } from 'sucrase';
declare let formidableServer: any;
export interface GreenLockSite {
    subject: string;
    altnames: string[];
}
interface formidableServer {
    maxFileSize: number;
    uploadDir: string;
    multiples: boolean;
    maxFieldsSize: number;
}
declare type TinyhttpPlugin = (req: Request, res: Response<any>, next?: NextFunction) => void;
/**
 * example:
 * @param subject example.com
 * @param altnames: www.example.com, cool.example.com
 */
interface SiteSettings {
    subject: string;
    altnames: string[];
}
interface JSXOptions extends TransformOptions {
    name: "JSXOptions";
}
interface TSXOptions extends TransformOptions {
    name: "TSXOptions";
}
interface transformOptions extends TransformOptions {
    name: "transformOptions";
}
declare type pluginsOptions = "MinAll" | "MinHTML" | "MinCss" | "MinSass" | "MinJS" | "MinTS" | "MinJSX" | JSXOptions | "MinTSX" | TSXOptions | transformOptions | "SafeDebug";
interface GlobalSettings {
    RequestLimitMB?: number;
    MaxFileUploadMB?: number;
    SessionTimeMinutes?: number;
    ReapIntervalSessionMinutes?: number;
    CacheDays?: number;
    PageRam?: boolean;
    CookiesExpiresDays?: number;
    Serve?: {
        AppPort?: number;
        http2?: boolean;
        greenlock?: {
            staging?: null;
            cluster?: null;
            email?: string;
            agent?: null;
            agreeToTerms?: boolean;
            sites?: SiteSettings[];
        };
    };
    Routing?: {
        RuleObject?: ((req: Request, _res: Response<any>, url: string) => string)[];
        StopCheckUrls?: string[];
        IgnoreTypes?: string[];
        IgnorePaths?: string[];
        arrayFuncServer?: ((...data: any) => any)[];
    };
    preventCompilationError?: ("close-tag" | "querys-not-found" | "component-not-found" | "ts-warning" | "js-warning" | "page-not-found" | "sass-import-not-found" | "css-warning" | "compilation-error" | "jsx-warning" | "tsx-warning")[];
    AddCompileSyntax?: ("JTags" | "Razor" | "TypeScript" | string | {
        [key: string]: any;
    })[];
    plugins?: pluginsOptions[];
    ErrorPages?: fileByUrl.ErrorPages;
}
interface ExportSettings extends GlobalSettings {
    DevMode: boolean;
    SettingsPath: string;
    CookiesSecret: string;
    SessionSecret: string;
    CookiesMiddleware: TinyhttpPlugin;
    CookieEncrypterMiddleware: TinyhttpPlugin;
    SessionMiddleware: TinyhttpPlugin;
    bodyParser: TinyhttpPlugin;
    formidable: formidableServer;
    OnDev: GlobalSettings;
    OnProduction: GlobalSettings;
}
export declare const Export: ExportSettings;
export declare function ReformidableServer(): void;
export declare function RebodyParserServer(): void;
export declare function ReSessionStore(): Promise<void>;
export declare function requireSettings(): Promise<void>;
export {};
