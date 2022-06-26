export type LastSession {
    session: SessionBuild,
    stack: STSInfo,
    params: string
}

export type CompileOptions = {
    dynamic: boolean
}