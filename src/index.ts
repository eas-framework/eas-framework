import { AppLog, BasicLogger } from "./Logger/BasicLogger.js";
import { connectServer } from "./ProcessRequest/ListenServer.js";
import { GlobalSettings } from "./Settings/GlobalSettings.js";
import './Settings/index.js'

export {
    GlobalSettings as appSettings,
    connectServer as initialize,
    AppLog as logger,
    BasicLogger
}