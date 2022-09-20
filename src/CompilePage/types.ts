import STSInfo from "../SourceTracker/StringTracker/STSInfo.js"
import { SessionBuild } from "./Session.js"

export type LastSession = {
    session: SessionBuild,
    stack: STSInfo,
    params: string
}

export type CompileOptions = {
    dynamic: boolean
}