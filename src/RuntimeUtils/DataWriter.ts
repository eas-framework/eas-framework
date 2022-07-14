import { GlobalSettings } from "../Settings/GlobalSettings";

export default class DataWriter {
    constructor(private writeFunc: (text: string, override?: boolean) => void){
        this.setResponse = this.setResponse.bind(this)
        this.write = this.write.bind(this)
        this.writeSafe = this.writeSafe.bind(this)
        this.echo = this.echo.bind(this)
    }

    static toStringInfo(str: any) {
        const asString = str?.toString?.();
        if (asString == null || asString.startsWith('[object Object]')) {
            return JSON.stringify(str, null, GlobalSettings.development ? 2: 0);
        }
        return asString;
    }

    static escape(str: string) {
        let build = ''
        for (const i of str) {
            build += '&#' + i.charCodeAt(0) + ';';
        }
        return build
    }


    setResponse(text: any) {
        this.writeFunc(DataWriter.toStringInfo(text), true)
    }

    write(text = '') {
        this.writeFunc(DataWriter.toStringInfo(text))
    }

    writeSafe(str = '') {
        str = DataWriter.toStringInfo(str);

        this.writeFunc(
            DataWriter.escape(str)
        )
    }

    echo(arr: string[], ...params: any[]) {
        let build = ''
        for (const i in params) {
            build += arr[i] + DataWriter.escape(params[i])
        }

        build += arr.at(-1)
        this.writeFunc(build)
    }
}