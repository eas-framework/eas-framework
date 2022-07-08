import PPath from "../../../Settings/PPath";
import json from "./json";
import wasm from "./wasm";

export const customTypes = ["json", "wasm"];

export default async function importByExtension(path: PPath){
    switch(path.ext.substring(1)){
        case "json":
            return json(path.full)
        case "wasm":
            return wasm(path.full);
        default:
            return import(path.full)
    }
}