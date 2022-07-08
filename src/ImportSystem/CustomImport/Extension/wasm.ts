import { promises } from "fs";

export default async function (path: string) {
    const wasmModule = new WebAssembly.Module(await promises.readFile(path));
    const wasmInstance = new WebAssembly.Instance(wasmModule, {});
    return wasmInstance.exports;
}