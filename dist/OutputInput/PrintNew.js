import { print } from './Console.js';
export const Settings = {
    PreventErrors: []
};
const PreventDoubleLog = [];
export const ClearWarning = () => PreventDoubleLog.length = 0;
export function PrintIfNew({ id, text, type = "warn", errorName }) {
    if (!PreventDoubleLog.includes(id ?? text) && !Settings.PreventErrors.includes(errorName)) {
        print[type](text.replace(/<line>/gi, '\n'));
        PreventDoubleLog.push(id ?? text);
    }
}
