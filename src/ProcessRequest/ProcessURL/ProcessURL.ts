import { GlobalSettings } from '../../Settings/GlobalSettings'
import PPath from '../../Settings/PPath'
import { directories } from '../../Settings/ProjectConsts'
import { Request, Response } from '../types'
import RequestWarper from './RequestWarper'
import URLHooks from './URLHooks'


export default async function processURL(req: Request, res: Response) {
    const urlPath = PPath.fromNested(directories.Locate.Static, req.path)
    const warper = new RequestWarper(urlPath, req, res)

    URLHooks(warper) // basic hook to change the path

    urlStopRule(warper) // stop the url if it starts with a stop path
    ignorePath(warper) // ignore the url if it starts with an ignore path

    if(warper.notError){
        await urlMethod(warper) // change the url if it starts with a method path
    }

    return warper
}

function urlStopRule(warper: RequestWarper) {
    for (let start of GlobalSettings.routing.urlStop) {
        if (warper.path.nested.startsWith(start)) {
            warper.path.nested = start
            break
        }
    }
}

async function urlMethod(warper: RequestWarper) {
    const methodName = Object.keys(GlobalSettings.routing.rules).find(start => warper.path.nested.startsWith(start));

    if (methodName) {
        warper.path.nested = await GlobalSettings.routing.rules[methodName](warper) ?? warper.path.nested;
    }
}

function ignorePath(warper: RequestWarper){
    const notValid = GlobalSettings.routing.ignorePaths.find(i => warper.path.nested.startsWith(i))

    if(notValid){
        warper.makeNotFound()
    }
}