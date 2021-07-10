/// <reference types="node" />
import http from 'http';
import http2 from 'http2';
import { Export as Settings } from './Settings';
declare function UpdateGreenloak(app: any): Promise<{
    server: http.Server;
    listen(port: any): Promise<unknown>;
    close(): void;
} | {
    server: any;
    listen: (port: any) => Promise<[unknown, unknown]>;
    close: () => void;
} | {
    server: http2.Http2SecureServer;
    listen(port: any): void;
    stop(): void;
}>;
export default function StartServer({ SitePath, HttpServer }?: {
    SitePath?: string;
    HttpServer?: typeof UpdateGreenloak;
}): Promise<void>;
export { Settings };
