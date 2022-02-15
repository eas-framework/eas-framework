import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
declare type RequireFiles = {
    path: string;
    status?: number;
    model: any;
    dependencies?: StringAnyMap;
    static?: boolean;
};
export default function RequireFile(filePath: string, importFrom: string, pathname: string, typeArray: string[], LastRequire: {
    [key: string]: RequireFiles;
}, isDebug: boolean): Promise<any>;
export {};
