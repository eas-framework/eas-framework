import StringTracker from '../../EasyDebug/StringTracker';
import { BuildScriptWithoutModule } from './CompileTypes';
declare function ParseDebugLine(code: StringTracker, path: string): Promise<StringTracker>;
declare function NoTrackStringCode(code: StringTracker, path: string, isDebug: boolean, buildScript: BuildScriptWithoutModule): Promise<StringTracker>;
export declare function AddDebugInfo(pageName: string, FullPath: string, SmallPath: string, cache?: {
    value?: string;
}): Promise<{
    allData: StringTracker;
    stringInfo: string;
}>;
export declare function CreateFilePathOnePath(filePath: string, inputPath: string, folder: string, pageType: string, pathType?: number): string;
export interface PathTypes {
    SmallPathWithoutFolder?: string;
    SmallPath?: string;
    FullPath?: string;
    FullPathCompile?: string;
}
declare function CreateFilePath(filePath: string, smallPath: string, inputPath: string, folder: string, pageType: string): PathTypes;
export { ParseDebugLine, CreateFilePath, NoTrackStringCode };
