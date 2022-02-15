import { print } from './Console';


export interface PreventLog {
    id?: string,
    text: string,
    errorName: string,
    type?: "warn" | "error"
}

export const Settings: {PreventErrors: string[]} = {
    PreventErrors: []
}

const PreventDoubleLog: string[] = [];

export const ClearWarning = () => PreventDoubleLog.length = 0;

export function PrintIfNew({id, text, type = "warn", errorName}: PreventLog) {
    if(!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)){
        print[type](text.replace(/<line>/gi, ' -> '), `\n\nError code: ${errorName}\n\n`);
        PreventDoubleLog.push(id ?? text);
    }
}
