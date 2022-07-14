import PPath from "../../Settings/PPath";
import JSONStorage from "../../Storage/JSONStorage";
import type DepManager from "./DepManager";
import { getChangeDate, updateInAllTree } from "./utils";

export type ShareOptions = {disableCache: boolean}
export default class DepCreator {
    private cacheTime = {}

    constructor(private manager: DepManager, private storage: JSONStorage, private shareOptions: ShareOptions= {disableCache: false}) {

    }

    private update(file: PPath, value: any = true) {
        this.storage.update(file.small, value)
    }

    async getNewTime(file: PPath) {
        if(this.shareOptions.disableCache){
            return await getChangeDate(file)
        }

        const fileString = file.small
        const newTime = this.cacheTime[fileString] ?? await getChangeDate(file)
        this.cacheTime[fileString] = newTime
        return newTime
    }

    async isDepChanged(file: PPath, mustExits = false) {
        const value = this.storage.store[file.small]
        if(value === false){ // dep has changed in the past
            return true
        }

        const lastTime = this.manager.getSavedTime(file)
        const newTime = await this.getNewTime(file)

        return newTime != lastTime || !mustExits && newTime == null
    }

    private static flatTree(tree: any, files: PPath[] = []) {
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
        const value = this.storage.store[file.small]
        if(typeof value == 'boolean' || value == null){
            return this.isDepChanged(file)
        }

        const files = DepCreator.flatTree(value)
        files.push(file)

        for(const f of files) {
            if(await this.isDepChanged(f)){
                return true
            }
        }

        return false
    }

    async updateDep(file: PPath, notToOthers = false) {
        const newTime = await this.getNewTime(file)
        const lastTime = this.manager.getSavedTime(file)

        this.manager.timeUpdate(file, newTime)

        /* Updating the tree of dependencies, so others will see this dependency as changed */
        if(!notToOthers && newTime != lastTime){
            updateInAllTree(file, false, this.storage.store)
        }

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
            new JSONStorage(file.small, this.storage.store),
            this.shareOptions
        )
        nested.cacheTime = this.cacheTime
        return nested
    }
}