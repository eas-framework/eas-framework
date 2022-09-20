import PPath from "../../Settings/PPath.js";
import JSONStorage from "../../Storage/JSONStorage.js";
import DepCreator, { ShareOptions } from "./DepCreator.js";
import { getChangeDate } from "./utils.js";

export default class DepManager {
    private deps: JSONStorage
    private times: JSONStorage

    constructor(storage: JSONStorage) {
        this.times = new JSONStorage("times", storage.store)
        this.deps = new JSONStorage("deps", storage.store)
    }

    async timeUpdate(file: PPath, time?: number) {
        const change = time ?? await getChangeDate(file)
        this.times.update(file.small, change)
        return change
    }

    getSavedTime(file: PPath) {
        return this.times.have(file.small)
    }

    createSession(shareOptions?: ShareOptions) {
        return new DepCreator(this, this.deps, shareOptions)
    }
}