import { StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
export declare function preprocess(fullPath: string, smallPath: string, dependenceObject?: StringNumberMap, makeAbsolute?: (path: string) => string, svelteExt?: string): Promise<{
    code: string;
    dependenceObject: StringNumberMap;
    map: string | object;
}>;
export declare function capitalize(name: string): string;
export declare function registerExtension(filePath: string, smallPath: string, dependenceObject: StringNumberMap, isDebug: boolean): Promise<string>;
export default function BuildScript(inputPath: string, isDebug: boolean): Promise<{
    thisFile: any;
}>;
