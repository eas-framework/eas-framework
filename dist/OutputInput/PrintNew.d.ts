export interface PreventLog {
    id?: string;
    text: string;
    errorName: string;
    type?: "warn" | "error";
}
export declare const Settings: {
    PreventErrors: string[];
};
export declare const ClearWarning: () => number;
export declare function PrintIfNew({ id, text, type, errorName }: PreventLog): void;
