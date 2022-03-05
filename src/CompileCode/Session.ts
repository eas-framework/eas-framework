import SourceMapStore from "../EasyDebug/SourceMapStore";
import { SessionInfo } from "./XMLHelpers/CompileTypes";

export function newSession(smallPath: string, typeName: string, debug: boolean): SessionInfo{
    return  {
        connectorArray: [], scriptURLSet: [], styleURLSet: [],
        style: new SourceMapStore(smallPath, debug, true),
        script: new SourceMapStore(smallPath, debug, false),
        scriptModule: new SourceMapStore(smallPath, debug, false),
        headHTML: '',
        typeName,
        cache: {
            style: [],
            script: [],
            scriptModule: []
        },
        cacheComponent: {}
    }
}

export function extendsSession(session: SessionInfo, from: SessionInfo){
    session.connectorArray.push(...from.connectorArray);
    session.scriptURLSet.push(...from.scriptURLSet);
    session.styleURLSet.push(...from.styleURLSet);

    session.style.concat(from.style);
    session.script.concat(from.script);
    session.scriptModule.concat(from.scriptModule);

    session.headHTML += from.headHTML;
    session.cache.style.push(...from.cache.style);
    session.cache.script.push(...from.cache.script);
    session.cache.scriptModule.push(...from.cache.scriptModule);

    Object.assign(session.cacheComponent, from.cacheComponent);
}