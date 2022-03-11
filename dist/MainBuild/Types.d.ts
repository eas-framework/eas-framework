import type { Request as TinyhttpRequest, Response as TinyhttpResponse } from '@tinyhttp/app';
import type { Fields, Files } from 'formidable';
declare type AddAny = {
    [key: string]: any;
};
export declare type Request = TinyhttpRequest & {
    fields?: Fields;
    files?: Files;
} & AddAny;
export declare type Response = TinyhttpResponse & AddAny;
declare type write = (data: any) => void;
declare type echo = (arr: string[], params: any[]) => void;
declare type page = {
    write: write;
    writeSafe: write;
    setResponse: write;
    echo: echo;
    Post: AddAny | null;
    Query: AddAny;
    Session: AddAny | null;
    Files: Files;
    Cookies: AddAny;
    PageVar: AddAny;
    GlobalVar: AddAny;
} & AddAny;
declare global {
    let page: page;
    let write: write;
    let writeSafe: write;
    let setResponse: write;
    let echo: echo;
    let Post: AddAny | null;
    let Query: AddAny;
    let Session: AddAny | null;
    let Files: Files;
    let Cookies: AddAny;
    let PageVar: AddAny;
    let GlobalVar: AddAny;
    function include(path: string, object?: AddAny): Promise<AddAny>;
    function transfer(path: string, preserveForm?: boolean, object?: AddAny): Promise<AddAny>;
}
export {};
