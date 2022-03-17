import StringTracker from "../../../EasyDebug/StringTracker";
import sass from 'sass';
import { StringNumberMap } from "../../../CompileCode/XMLHelpers/CompileTypes";
import { RawSourceMap } from "source-map-js";
export declare function createImporter(originalPath: string): {
    findFileUrl(url: string): URL;
};
export declare function sassStyle(language: string, SomePlugins: any): "compressed" | "expanded";
export declare function sassSyntax(language: 'sass' | 'scss' | 'css'): "scss" | "css" | "indented";
export declare function sassAndSource(sourceMap: RawSourceMap, source: string): void;
export declare function compileSass(language: string, BetweenTagData: StringTracker, dependenceObject: StringNumberMap, InsertComponent: any, isDebug: boolean, outStyle?: string): Promise<{
    result: sass.CompileResult;
    outStyle: string;
    compressed: boolean;
}>;
