import { ExportSettings } from './SettingsTypes';
export declare function pageInRamActivateFunc(): () => Promise<void>;
export declare const Export: ExportSettings;
export declare function buildFormidable(): void;
export declare function buildBodyParser(): void;
export declare function buildSession(): void;
export declare function requireSettings(): Promise<void>;
export declare function buildFirstLoad(): void;
