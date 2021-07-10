import { Request, Response } from '@tinyhttp/app';
import { Files } from 'formidable';
declare function SplitFirst(type: string, string: string): string[];
declare const Export: {
    PageLoadRam: {};
    PageRam: boolean;
};
declare function getFullPathCompile(url: string): string;
declare function LoadPage(url: string, ext?: string): Promise<any>;
declare function BuildPage(LoadPageFunc: (...data: any[]) => void, run_script_name: string): (Response: Response<any>, Request: Request, Post: {
    [key: string]: any;
}, Query: {
    [key: string]: any;
}, Cookies: {
    [key: string]: any;
}, Session: {
    [key: string]: any;
}, Files: Files, isDebug: boolean) => Promise<{
    out_run_script: string;
    redirectPath: any;
}>;
export { LoadPage, BuildPage, getFullPathCompile, Export, SplitFirst };
