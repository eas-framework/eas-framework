import server, {Settings}  from './MainBuild/Server';
import asyncRequire from './ImportFiles/Script';
import {getTypes} from './RunTimeBuild/SearchFileSystem';
import SearchRecord from './Global/SearchRecord';
import { waitProductionPromise } from './MainBuild/Settings';
export type {Request, Response} from './MainBuild/Types';

export const AsyncImport = (path:string, importFrom = 'async import') => asyncRequire([importFrom], path, getTypes.Static, {isDebug: Settings.development});
export {Settings, SearchRecord, waitProductionPromise};
export default server;