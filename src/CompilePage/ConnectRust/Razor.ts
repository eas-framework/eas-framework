import { pool } from "./Pool.js";
import { ParseBlocks } from "./utils.js";

export async function RazorToEJS(text: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('RazorToEJS', [text]));
}

export async function RazorToEJSCompile(text: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('RazorToEJSCompile', [text]));
}