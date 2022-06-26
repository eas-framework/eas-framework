import bodyParser from "body-parser";
import path from "node:path";
import { MB_IN_BYTES, MINUIT_MILLISECONDS, UPLOAD_FILE_FOLDER } from "../BasicConts";
import { GlobalSettings } from "../GlobalSettings";
import { SystemData } from "../ProjectConsts";
import session from 'express-session';
import { hookSet, hookSetArray, onlyISet, readOnly } from "./Hook";
import cookieEncrypter from 'cookie-encrypter';
import MemorySession from 'memorystore';
import { cookieParser } from '@tinyhttp/cookie-parser';

/**
 * Hooks for middleware
 */

const MEMORY_STORE = MemorySession(session);


/**
 * Create the formidable settings for the formidable middleware
 */
const setFormidableMiddleware = onlyISet(GlobalSettings.middleware, 'formidable')
export function buildFormidableMiddlewareSettings() {
    setFormidableMiddleware({
        maxFileSize: GlobalSettings.serveLimits.fileLimitMB * MB_IN_BYTES,
        uploadDir: path.join(SystemData, UPLOAD_FILE_FOLDER, '/'),
        multiples: true,
        maxFieldsSize: GlobalSettings.serveLimits.requestLimitMB * MB_IN_BYTES
    });
}
hookSetArray(GlobalSettings.serveLimits, ["fileLimitMB", "requestLimitMB"], buildFormidableMiddlewareSettings);

/**
 * Create the body parser middleware from the global settings
 */
const setBodyParserMiddleware = onlyISet(GlobalSettings.middleware, 'bodyParser')
export function buildBodyParserMiddleware() {
    setBodyParserMiddleware(
        bodyParser.json({ limit: GlobalSettings.serveLimits.requestLimitMB + 'mb' })
    )
}
hookSet(GlobalSettings.serveLimits, "requestLimitMB", buildBodyParserMiddleware);

/**
 * Create the session middleware from the global settings
 */
const setSessionMiddleware = onlyISet(GlobalSettings.middleware, 'session')
export function buildSessionMiddleware() {
    if (!GlobalSettings.serveLimits.sessionTimeMinutes || !GlobalSettings.serveLimits.sessionTotalRamMB) {
        setSessionMiddleware((req, res, next) => next())
        return
    }

    setSessionMiddleware(
        session({
            cookie: { maxAge: GlobalSettings.serveLimits.sessionTimeMinutes * MINUIT_MILLISECONDS, sameSite: true },
            secret: GlobalSettings.secret.session,
            resave: false,
            saveUninitialized: false,
            store: new MEMORY_STORE({
                checkPeriod: GlobalSettings.serveLimits.sessionCheckPeriodMinutes * MINUIT_MILLISECONDS,
                max: GlobalSettings.serveLimits.sessionTotalRamMB * MB_IN_BYTES
            })
        })
    )
}
hookSetArray(GlobalSettings.serveLimits, ["sessionTimeMinutes", "sessionTotalRamMB", "sessionCheckPeriodMinutes"], buildSessionMiddleware)
hookSet(GlobalSettings.secret, "session", buildSessionMiddleware)

/**
 * Create the cookie encrypter middleware from the global settings
 */
const setCookiesMiddleware = onlyISet(GlobalSettings.middleware, 'cookies')
const setCookieEncrypterMiddleware = onlyISet(GlobalSettings.middleware, 'cookieEncrypter')
export function buildCookiesMiddleware() {
    setCookiesMiddleware(
        cookieParser(GlobalSettings.secret.cookies)
    )
    setCookieEncrypterMiddleware(
        cookieEncrypter(GlobalSettings.secret.cookies, {})
    )

}
hookSet(GlobalSettings.secret, "cookies", buildCookiesMiddleware)