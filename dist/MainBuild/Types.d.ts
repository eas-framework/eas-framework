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
export {};
