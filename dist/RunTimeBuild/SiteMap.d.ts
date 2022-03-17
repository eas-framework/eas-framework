import { ExportSettings } from "../MainBuild/SettingsTypes";
import CompileState from "./CompileState";
export declare function debugSiteMap(Export: ExportSettings): Promise<void>;
export declare function createSiteMap(Export: ExportSettings, state: CompileState): Promise<void>;
