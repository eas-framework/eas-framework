import { StringNumberMap } from '../CompileCode/XMLHelpers/CompileTypes';
declare type RequireFiles = {
    path: string;
    status?: number;
    model: any;
    dependencies?: StringNumberMap;
    static?: boolean;
};
export default function RequireFile(filePath: string, pathname: string, typeArray: string[], LastRequire: {
    [key: string]: RequireFiles;
}, isDebug: boolean): Promise<any>;
export {};
