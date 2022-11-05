import {
    reFilterExtension
} from "../../ProcessRequest/ScriptLoader/Senders/StaticFile/CustomHooks/StaticExtension/index.js";
import {GlobalSettings} from "../GlobalSettings.js";
import {setDirectories} from "../ProjectConsts.js";
import {
    buildBodyParserMiddleware,
    buildCookiesMiddleware,
    buildFormidableMiddlewareSettings,
    buildSessionMiddleware
} from "./Middlewares.js";
import './General.js';

export default function initSettings() {
    buildFormidableMiddlewareSettings();
    buildBodyParserMiddleware();
    buildSessionMiddleware();
    buildCookiesMiddleware();
    reFilterExtension();
    setDirectories(GlobalSettings.websiteDirectory);
}
