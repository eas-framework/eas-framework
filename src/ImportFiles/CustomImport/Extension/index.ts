import json from "./json";
import wasm from "./wasm";

export const customTypes = ["json", "wasm"];

export default async function ImportByExtension(path: string, type: string){
    switch(type){
        case "json":
            return json(path)
        case "wasm":
            return wasm(path);
        default:
            return import(path)
    }
}