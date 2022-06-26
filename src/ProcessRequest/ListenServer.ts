import { Server, createServer } from "http";
import { Http2Server } from "http2";
import { App as TinyApp } from '@tinyhttp/app';
import compression from 'compression';
import { GlobalSettings } from "../Settings/GlobalSettings";
import {promisify} from 'node:util'
import { callImportOnLoadMethods } from "../Settings/SettingsLoader";
import { connectRequests } from "./ProcessData";


export async function connectServer(server: Server | Http2Server = createServer(), settingsFile: string){
    const app = new TinyApp();
    app.use(<any>compression());

    server.on('request', app.attach)
    await callImportOnLoadMethods(app, server)

    //@ts-ignore
    await promisify(server.listen)(GlobalSettings.serve.port)
    console.log(`Server started on port ${GlobalSettings.serve.port}`)

    connectRequests(app, settingsFile)
}