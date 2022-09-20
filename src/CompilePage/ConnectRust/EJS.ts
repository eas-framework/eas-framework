import { pool } from "./Pool.js";
import { ParseBlocks } from "./utils.js";

export async function EJSParserRust(text: string, start: string, end: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('EJSParser', [text, start, end]));
}