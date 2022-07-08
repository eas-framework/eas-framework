import { GlobalSettings } from "../Settings/GlobalSettings";

export default function createDateWriter(out_run_script: {text: string}){
    function ToStringInfo(str: any) {
        const asString = str?.toString?.();
        if (asString == null || asString.startsWith('[object Object]')) {
            return JSON.stringify(str, null, GlobalSettings.development ? 2: 0);
        }
        return asString;
    }

    function setResponse(text: any) {
        out_run_script.text = ToStringInfo(text);
    }

    function write(text = '') {
        out_run_script.text += ToStringInfo(text);
    };

    function writeSafe(str = '') {
        str = ToStringInfo(str);

        for (const i of str) {
            out_run_script.text += '&#' + i.charCodeAt(0) + ';';
        }
    }

    function echo(arr: string[], ...params: any[]) {
        for (const i in params) {
            out_run_script.text += arr[i];
            writeSafe(params[i]);
        }

        out_run_script.text += arr.at(-1);
    }

    return {ToStringInfo, setResponse, write, writeSafe, echo};
}