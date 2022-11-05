import StringTracker from "../../../../SourceTracker/StringTracker/StringTracker.js";
import {PageBaseParser} from "../../../ConnectRust/PageBase.js";

export type BaseParserBlock = { key: string, value: StringTracker | true, char?: string }

export default class BaseParser {
    public values: BaseParserBlock[] = [];
    public clearCode: StringTracker = new StringTracker();

    async parse(code: StringTracker) {
        const parser = await PageBaseParser(code.eq);

        if (parser.start == parser.end) {
            this.clearCode = code;
            return;
        }

        for (const {char, end, key, start} of parser.values) {
            this.values.push({key, value: start === end ? true : code.slice(start, end), char});
        }

        this.clearCode = code.slice(0, parser.start).plus(code.slice(parser.end)).trimStart();
    }

    rebuild() {
        if (!this.values.length) return this.clearCode;
        const build = new StringTracker('#[');

        for (const {key, value, char} of this.values) {
            if (value !== true) {
                build.plus$`${key}=${char}${value}${char} `;
            } else {
                build.plus$`${key} `;
            }
        }

        this.clearCode = build.slice(0, build.length - 1).plus(']\n').plus(this.clearCode);
        return this.clearCode;
    }

    clone() {
        const clone = new BaseParser();
        clone.values = this.values.slice();
        clone.clearCode = this.clearCode.clone();
        return clone;
    }
}