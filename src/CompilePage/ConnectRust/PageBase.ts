import { pool } from "./Pool";

type PageBaseParseValues = {
    start: number,
    end: number,
    values: {
        start: number,
        end: number,
        key: string,
        char: string
    }[]
}

export async function PageBaseParser(text: string): Promise<PageBaseParseValues> {
    const parse = await pool.exec('PageBaseParser', [text]);
    return JSON.parse(parse);
}