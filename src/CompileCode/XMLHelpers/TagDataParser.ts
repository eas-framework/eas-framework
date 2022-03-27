import StringTracker from "../../EasyDebug/StringTracker";
import { pool } from "../BaseReader/Reader";

async function HTMLAttrParser(text: string): Promise<{
    sk: number,
    ek: number,
    sv: number,
    ev: number,
    space: boolean,
    char: string
}[]> {
    const parse = await pool.exec('HTMLAttrParser', [text])
    return JSON.parse(parse);
}

export default class TagDataParser {
    valueArray: {
        key?: StringTracker
        value: StringTracker | true,
        space: boolean,
        char?: string
    }[] = []

    constructor(private text: StringTracker) {

    }

    async parser() {
        const parse = await HTMLAttrParser(this.text.eq);

        for (const { char, ek, ev, sk, space, sv } of parse) {
            this.valueArray.push({ char, space, key: this.text.substring(sk, ek), value: sv == ev ? true : this.text.substring(sv, ev) })
        }
    }

    private popItem(key: string){
        key = key.toLowerCase();
        const index = this.valueArray.findIndex(x => x.key.eq.toLowerCase() == key);
        return index == -1 ? null: this.valueArray.splice(index, 1).shift();
    }

    popTracker(key: string): StringTracker | null | boolean {
        return this.popItem(key)?.value
    }

    popHaveDefaultTracker<T = string>(key: string, value: T = <any>''): StringTracker | null | T {
        const data = this.popTracker(key);
        return typeof data === 'boolean' ? value : data;
    }

    popAnyTracker<T = string>(key: string, value: T = <any>''): string | null | T {
        const data = this.popTracker(key);
        return data instanceof StringTracker ? data.eq: value;
    }

    popString(key: string): string | null | boolean {
        const value = this.popItem(key)?.value
        return value instanceof StringTracker ? value.eq : value;
    }

    popBoolean(key: string, defaultValue?: boolean) {
        return Boolean(this.popString(key) ?? defaultValue)
    }

    exists(key: string) {
        return this.valueArray.find(x => x.key.eq.toLowerCase() == key) != null
    }

    popHaveDefault<T = string>(key: string, value: T = <any>''): string | null | T {
        const data = this.popString(key);
        return typeof data === 'boolean' ? value : data;
    }

    popAnyDefault<T = string>(key: string, value: T = <any>''): string | null | T {
        const data = this.popString(key);
        return typeof data === 'string' ? data: value;
    }

    addClass(className: string) {
        const have = this.valueArray.find(x => x.key.eq.toLowerCase() == 'class');
        if (have?.value instanceof StringTracker)
            have.value.AddTextAfterNoTrack(' ' + className).trimStart();
        else if (have?.value === true) {
            have.value = new StringTracker(null, className);
        } else {
            this.pushValue('class', className);
        }
    }

    rebuildSpace() {
        const newAttributes = new StringTracker();

        for (const { value, char, key, space } of this.valueArray) {
            space && newAttributes.AddTextAfterNoTrack(' ');

            if (value === true) {
                newAttributes.Plus(key);
            } else {
                newAttributes.Plus$`${key}=${char}${value}${char}`;
            }
        }

        return newAttributes;
    }

    pushValue(key: string, value: string) {
        const have = this.valueArray.find(x => x.key.eq.toLowerCase() == key);
        if (have) return (have.value = new StringTracker(null, value));

        this.valueArray.push({ key: new StringTracker(null, value), value: new StringTracker(null, value), char: '"', space: true });
    }

    map() {
        const attrMap: { [key: string]: string | true } = {};

        for (const { key, value } of this.valueArray) {
            if (key) attrMap[key.eq] = value === true ? true : value.eq;
        }

        return attrMap;
    }
}