import { Request, Response } from '@tinyhttp/app';
export interface ErrorPages {
    notFound?: {
        path: string;
        code?: number;
    };
    serverError?: {
        path: string;
        code?: number;
    };
}
interface GetPagesSettings {
    CacheDays: number;
    PageRam: boolean;
    DevMode: boolean;
    CookieSettings?: any;
    Cookies?: (...args: any[]) => Promise<any>;
    CookieEncrypter?: (...args: any[]) => Promise<any>;
    SessionStore?: (...args: any[]) => Promise<any>;
    ErrorPages: ErrorPages;
}
declare const Settings: GetPagesSettings;
declare function LoadAllPagesToRam(): Promise<void>;
declare function ClearAllPagesFromRam(): void;
declare function GetErrorPage(code: number, LocSettings: 'notFound' | 'serverError'): {
    url: string;
    arrayType: string[];
    code: number;
};
declare function DynamicPage(Request: Request | any, Response: Response | any, url: string, arrayType?: string[], code?: number): Promise<void>;
declare function urlFix(url: string): string;
export { Settings, DynamicPage, LoadAllPagesToRam, ClearAllPagesFromRam, urlFix, GetErrorPage };
