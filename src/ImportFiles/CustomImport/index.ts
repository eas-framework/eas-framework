import json from "./json";
import wasm from "./wasm";

export const customTypes = ["json", "wasm"];

export default async function (path: string, type: string, require: (p: string) => Promise<any>){
    switch(type){
        case "json":
            return json(path)
        case "wasm":
            return wasm(path);
        default:
            return import(path)
    }
}