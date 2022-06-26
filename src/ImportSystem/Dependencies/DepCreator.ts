import PPath from "../../Settings/PPath";
import JSONStorage from "../../Storage/JSONStorage";
import type DepManager from "./DepManager";
import { getChangeDate } from "./utils";

export default class DepCreator {
    private cacheTime = {}

    constructor(private manager: DepManager, private storage: JSONStorage) {

    }

    private update(file: PPath, value: any = true) {
        this.storage.update(file.small, value)
    }

    private async getNewTime(file: PPath) {
        const fileString = file.small
        const newTime = this.cacheTime[fileString] ?? await getChangeDate(file)
        this.cacheTime[fileString] = newTime
        return newTime
    }

    async isDepChanged(file: PPath) {
        const lastTime = this.manager.getSavedTime(file)
        const newTime = await this.getNewTime(file)

        return newTime != lastTime || newTime == null
    }

    private static flatTree(tree: any, files = []) {
        for(const key in tree) {
            const value = tree[key]
            const file = new PPath(key)

            files.push(file)

            if(typeof value !== 'boolean'){
                this.flatTree(value, files)
            }
        }
        return files
    }

    async treeChanged(file: PPath) {
        const files = DepCreator.flatTree(this.storage.store[file.small])
        files.push(file)

        for(const f of files) {
            if(await this.isDepChanged(f)){
                return true
            }
        }

        return false
    }

    async updateDep(file: PPath) {
        const newTime = await this.getNewTime(file)
        this.manager.timeUpdate(file, newTime)
        newTime && this.update(file)

        return newTime
    }

    nestedDepFile(file: PPath) {
        const have = this.storage.have(file.small)
        if(!have || typeof have !== 'object') {
            this.update(file, {})
        }
        const nested = new DepCreator(
            this.manager,
            new JSONStorage(file.small, this.storage.store)
        )
        nested.cacheTime = this.cacheTime
        return nested
    }
}