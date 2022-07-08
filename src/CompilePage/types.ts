import STSInfo from "../SourceTracker/StringTracker/STSInfo"
import { SessionBuild } from "./Session"

export type LastSession {
    session: SessionBuild,
    stack: STSInfo,
    params: string
}

export type CompileOptions = {
    dynamic: boolean
}