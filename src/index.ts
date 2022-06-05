import server, {Settings}  from './MainBuild/Server';
import asyncRequire from './ImportFiles/Script';
import {getTypes} from './RunTimeBuild/SearchFileSystem';
import SearchRecord from './Global/SearchRecord';
import { waitProductionBuild } from './MainBuild/Settings';
import { SitemapEventEmitter } from './CompileCode/XMLHelpers/SitemapBuilder';
export { PageTimeLogger } from './OutputInput/Logger';
export type {Request, Response} from './MainBuild/Types';

export const AsyncImport = (path:string, importFrom = 'async import') => asyncRequire([importFrom], path, getTypes.Static, {isDebug: Settings.development});
export {Settings, SearchRecord, waitProductionBuild, SitemapEventEmitter};
export default server;