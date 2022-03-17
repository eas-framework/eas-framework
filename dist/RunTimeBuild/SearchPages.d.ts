import { ExportSettings } from '../MainBuild/SettingsTypes';
export declare function FastCompile(path: string, arrayType: string[]): Promise<void>;
export declare function compileAll(Export: ExportSettings): Promise<() => Promise<void>>;
