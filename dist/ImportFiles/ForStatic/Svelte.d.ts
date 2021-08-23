import { StringNumberMap } from '../../CompileCode/XMLHelpers/CompileTypes';
export declare function preprocess(fullPath: string, smallPath: string, dependenceObject?: StringNumberMap): Promise<{
    code: string;
    dependenceObject: StringNumberMap;
    map: string | object;
}>;
export default function BuildScript(inputPath: string, isDebug: boolean): Promise<{
    thisFile: any;
}>;
