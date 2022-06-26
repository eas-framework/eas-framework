import { GlobalSettings } from "../../Settings/GlobalSettings";
import PPath from "../../Settings/PPath";
import { directories } from "../../Settings/ProjectConsts";
import { Request, Response } from "../types";

const DEFAULT_ERROR_CODE = 500
const START_ERROR_CODE = 400

export default class RequestWarper{

    get notError(){
        return this.code < START_ERROR_CODE
    }

    constructor(public path: PPath, public req: Request, public res: Response, public code = 200){
    }

    private makeError({path, code}: {path: string, code?: number}){
        this.path = PPath.fromNested(directories.Locate.Static, path)
        this.code = code ?? DEFAULT_ERROR_CODE
    }

    makeNotFound(){
        this.makeError(GlobalSettings.routing.errorPages.notFound)
    }

    makeServerError(){
        this.makeError(GlobalSettings.routing.errorPages.serverError)
    }
}