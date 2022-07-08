import { pool } from "./Pool";
import { ParseBlocks } from "./utils";

export async function RazorToEJS(text: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('RazorToEJS', [text]));
}

export async function RazorToEJSCompile(text: string): Promise<ParseBlocks> {
    return JSON.parse(await pool.exec('RazorToEJSCompile', [text]));
}