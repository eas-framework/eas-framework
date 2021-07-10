import server, { Settings } from './MainBuild/Server';
import { FastSqlite, req_get } from './BuildInFunc/Index';
export declare const AsyncRequire: (path: string) => Promise<any>;
export declare const Server: typeof server;
export { Settings, FastSqlite, req_get };
