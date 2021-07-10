import { Request, Response } from '@tinyhttp/app';
export interface ErrorPages {
    NotFound?: {
        path: string;
        code?: number;
    };
    ServerError?: {
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
declare function GetErrorPage(code: number, LocSettings: 'NotFound' | 'ServerError'): {
    url: string;
    arrayType: string[];
    code: number;
};
declare function DynamicPage(Request: Request | any, Response: Response | any, url: string, arrayType?: string[], code?: number): any;
declare function urlFix(url: string): string;
export { Settings, DynamicPage, LoadAllPagesToRam, ClearAllPagesFromRam, urlFix, GetErrorPage };
