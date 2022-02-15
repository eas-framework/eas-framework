import server, {Settings}  from './MainBuild/Server';
import {LocalSql, dump} from './BuildInFunc/Index';
import asyncRequire from './ImportFiles/Script';
import {getTypes} from './RunTimeBuild/SearchFileSystem';
export type {Request, Response} from './MainBuild/Types';

export const AsyncImport = (path:string, importFrom = 'async import') => asyncRequire(importFrom, path, getTypes.Static, Settings.development);
export const Server = server;
export {Settings, LocalSql, dump};