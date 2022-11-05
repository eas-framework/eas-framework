import {pool} from "./Pool.js";

export async function HTMLAttrParser(text: string): Promise<{
    sk: number,
    ek: number,
    sv: number,
    ev: number,
    space: boolean,
    char: string
}[]> {
    const parse = await pool.exec('HTMLAttrParser', [text]);
    return JSON.parse(parse);
}