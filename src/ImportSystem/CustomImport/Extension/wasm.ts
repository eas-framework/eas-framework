import {promises} from "fs";

export default async function (path: string) {
    //@ts-ignore
    const wasmModule = new WebAssembly.Module(await promises.readFile(path));
    //@ts-ignore
    const wasmInstance = new WebAssembly.Instance(wasmModule, {});
    return wasmInstance.exports;
}