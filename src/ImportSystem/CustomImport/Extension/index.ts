import PPath from "../../../Settings/PPath.js";
import {StringAnyMap} from "../../../Settings/types.js";
import json from "./json.js";
import wasm from "./wasm.js";

export const customTypes = ["json", "wasm"];

export default async function importByExtension(path: PPath, options: StringAnyMap) {
    switch (path.ext.substring(1)) {
        case "json":
            return json(path.full);
        case "wasm":
            return wasm(path.full);
        default:
            return import(path.full, options);
    }
}