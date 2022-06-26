import {  buildBodyParserMiddleware, buildCookiesMiddleware, buildFormidableMiddlewareSettings, buildSessionMiddleware } from "./Middlewares";

export default function firstLoad() {
    buildFormidableMiddlewareSettings()
    buildBodyParserMiddleware()
    buildSessionMiddleware()
    buildCookiesMiddleware()
}
