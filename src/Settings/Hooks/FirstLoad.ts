import { reFilterExtension } from "../../ProcessRequest/ScriptLoader/Senders/StaticFile/CustomHooks/StaticExtension";
import {  buildBodyParserMiddleware, buildCookiesMiddleware, buildFormidableMiddlewareSettings, buildSessionMiddleware } from "./Middlewares";

export default function firstLoad() {
    buildFormidableMiddlewareSettings()
    buildBodyParserMiddleware()
    buildSessionMiddleware()
    buildCookiesMiddleware()
    reFilterExtension()
}
