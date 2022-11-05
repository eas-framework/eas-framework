import {AppLog, BasicLogger} from "./Logger/BasicLogger.js";
import {connectServer} from "./ProcessRequest/ListenServer.js";
import {GlobalSettings} from "./Settings/GlobalSettings.js";
import {Server} from 'http';
import {Http2Server} from 'http2';
import {loadSettings} from './Settings/SettingsLoader.js';
import {loadSystemStorage} from './Storage/JSONStorage.js';
import initSettings from './Settings/Hooks/FirstLoad.js';

async function initialize(server?: Server | Http2Server, settingsFile?: string) {
    await loadSystemStorage();
    await loadSettings(settingsFile);
    await initSettings();

    await connectServer(server, settingsFile);
}

export {
    GlobalSettings as appSettings,
    initialize,
    AppLog as logger,
    BasicLogger
};