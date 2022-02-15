import server, { Settings } from './MainBuild/Server.js';
import { LocalSql, dump } from './BuildInFunc/Index.js';
import asyncRequire from './ImportFiles/Script.js';
import { getTypes } from './RunTimeBuild/SearchFileSystem.js';
export const AsyncImport = (path, importFrom = 'async import') => asyncRequire(importFrom, path, getTypes.Static, Settings.development);
export const Server = server;
export { Settings, LocalSql, dump };
//# sourceMappingURL=index.js.map