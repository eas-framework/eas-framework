import {AppLog} from "../../../Logger/BasicLogger.js";
import {connectServer} from "../../../ProcessRequest/ListenServer.js";
import {GlobalSettings} from "../../../Settings/GlobalSettings.js";

export default function () {
    return {
        appSettings: GlobalSettings,
        initialize: connectServer,
        //searchRecord,
        logger: AppLog
    };
}