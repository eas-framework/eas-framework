import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
export declare function BuildScriptSmallPath(InStaticPath: string, typeArray: string[], isDebug?: boolean): Promise<string>;
export declare function AddExtension(FilePath: string): string;
export default function LoadImport(importFrom: string, InStaticPath: string, typeArray: string[], isDebug?: boolean, useDeps?: StringAnyMap, withoutCache?: string[]): Promise<any>;
export declare function ImportFile(importFrom: string, InStaticPath: string, typeArray: string[], isDebug?: boolean, useDeps?: StringAnyMap, withoutCache?: string[]): any;
export declare function RequireOnce(filePath: string, isDebug: boolean): Promise<any>;
export declare function RequireCjsScript(content: string): Promise<any>;
export declare function paramsImport(globalPrams: string, scriptLocation: string, inStaticLocationRelative: string, typeArray: string[], isTypeScript: boolean, isDebug: boolean, fileCode: string, sourceMapComment: string): Promise<(...arr: any[]) => Promise<any>>;
