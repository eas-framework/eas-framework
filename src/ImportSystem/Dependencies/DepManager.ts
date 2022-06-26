import PPath from "../../Settings/PPath";
import JSONStorage from "../../Storage/JSONStorage";
import DepCreator from "./DepCreator";
import { getChangeDate } from "./utils";

export default class DepManager {
    private deps: JSONStorage
    private times: JSONStorage

    constructor(storage: JSONStorage) {
        this.times = new JSONStorage("times", storage.store)
        this.deps = new JSONStorage("deps", storage.store)
    }

    async timeUpdate(file: PPath, time?: number) {
        const change = time ?? await getChangeDate(file)
        this.times.update(file.toString(), change)
        return change
    }

    getSavedTime(file: PPath) {
        return this.times.have(file.toString())
    }

    createSession(){
        return new DepCreator(this, this.deps)
    }
}