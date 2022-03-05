import { SessionInfo } from "./XMLHelpers/CompileTypes";
export declare function newSession(smallPath: string, typeName: string, debug: boolean): SessionInfo;
export declare function extendsSession(session: SessionInfo, from: SessionInfo): void;
