import { pool } from "./Pool";
import { ParseBlocks } from "./utils";

export async function EJSParserRust(text: string, start: string, end: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('EJSParser', [text, start, end]));
}