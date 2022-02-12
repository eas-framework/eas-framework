import server, {Settings}  from './MainBuild/Server';
import {LocalSql} from './BuildInFunc/Index';
import asyncRequire from './ImportFiles/Script';
import {getTypes} from './RunTimeBuild/SearchFileSystem';
export type {Request, Response} from './MainBuild/Types';

export const AsyncRequire = (path:string) => asyncRequire(path, getTypes.Static, Settings.development);
export const Server = server;
export {Settings, LocalSql};