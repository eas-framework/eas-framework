import server, { Settings } from './MainBuild/Server.js';
import { LocalSql } from './BuildInFunc/Index.js';
import asyncRequire from './ImportFiles/Script.js';
import { getTypes } from './RunTimeBuild/SearchFileSystem.js';
export const AsyncRequire = (path) => asyncRequire(path, getTypes.Static, Settings.DevMode);
export const Server = server;
export { Settings, LocalSql };
//# sourceMappingURL=index.js.map