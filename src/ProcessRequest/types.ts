import type { Request as TinyhttpRequest, Response as TinyhttpResponse } from '@tinyhttp/app';
import type { Fields, Files } from 'formidable'

type AddAny = { [key: string]: any }
export type Request = TinyhttpRequest & { fields?: Fields, files?: Files } & AddAny
export type Response = TinyhttpResponse & AddAny