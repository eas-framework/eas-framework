import { StringNumberMap } from "../CompileCode/XMLHelpers/CompileTypes";
import StoreJSON from "./StoreJSON";
export declare const pageDeps: StoreJSON;
export declare function CheckDependencyChange(path: string, dependencies?: StringNumberMap): Promise<boolean>;
