import type { tagDataObjectArray } from '../../../CompileCode/XMLHelpers/CompileTypes';
export declare function compileValues(value: string): string;
export declare function makeValidationJSON(args: any[], validatorArray: any[]): Promise<boolean | string[]>;
export declare function parseValues(args: any[], validatorArray: any[]): any[];
export declare function parseTagDataStringBoolean(data: tagDataObjectArray, find: string, defaultData?: any): string | null | boolean;
