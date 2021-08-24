import { StringNumberMap } from '../CompileCode/XMLHelpers/CompileTypes';
export declare function BuildScriptSmallPath(InStaticPath: string, typeArray: string[], isDebug?: boolean): Promise<string>;
export declare function AddExtension(FilePath: string): string;
export default function LoadImport(InStaticPath: string, typeArray: string[], isDebug?: boolean, useDeps?: StringNumberMap, withoutCache?: number): Promise<any>;
export declare function ImportFile(InStaticPath: string, typeArray: string[], isDebug?: boolean, useDeps?: StringNumberMap, withoutCache?: number): any;
export declare function RequireOnce(filePath: string, isDebug: boolean): Promise<any>;
export declare function RequireCjsScript(content: string): Promise<any>;
