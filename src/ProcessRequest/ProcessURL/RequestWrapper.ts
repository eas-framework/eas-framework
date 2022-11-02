import {GlobalSettings} from "../../Settings/GlobalSettings.js";
import PPath from "../../Settings/PPath.js";
import {directories} from "../../Settings/ProjectConsts.js";
import {Request, Response} from "../types.js";

export const SERVER_ERROR_CODE = 500;
export const NOT_FOUND_ERROR_CODE = 404;
const START_ERROR_CODE = 400;

export default class RequestWrapper {

    get notError() {
        return this.code < START_ERROR_CODE;
    }

    constructor(public path: PPath, public req: Request, public res: Response, public code = 200) {
    }

    private makeError({path, code}: { path?: string, code?: number } = {}, defaultCode = SERVER_ERROR_CODE) {
        this.code = code ?? defaultCode;
        if (path) {
            this.path = PPath.fromNested(directories.Locate.static, path);
            return true;
        }
        return false;
    }

    makeNotFound() {
        return this.makeError(GlobalSettings.routing.errorPages.notFound, SERVER_ERROR_CODE);
    }

    makeServerError() {
        return this.makeError(GlobalSettings.routing.errorPages.serverError, NOT_FOUND_ERROR_CODE);
    }
}