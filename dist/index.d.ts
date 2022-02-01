import server, { Settings } from './MainBuild/Server';
import { LocalSql } from './BuildInFunc/Index';
export declare const AsyncRequire: (path: string) => Promise<any>;
export declare const Server: typeof server;
export { Settings, LocalSql };
