import PPath from "../../../../Settings/PPath.js"

const WaitImport = {}
const CacheImport = {}

type CacheItem = {
    exports: any,
    deps: any
}

export default class CacheWaitImport {
    private wait: any
    private cache: {[key: string]: CacheItem}
    private resolveImportFunc: Function

    constructor(name: string, private file: PPath){
        this.wait = WaitImport[name] ??= {}
        this.cache = CacheImport[name] ??= {}
    }

    // prevent same import simultaneously
    
    async waitSimultaneousImport() {
        await this.wait[this.file.small]
    }

    makeOthersWait() {
        this.wait[this.file.small] = new Promise(res => this.resolveImportFunc = res)
    }

    resolveImport() {
        this.wait[this.file.small] = null
        this.resolveImportFunc?.()
    }

    // use import data

    get(file: PPath){
        return this.cache[file.small]
    }

    update(file: PPath, data: CacheItem){
        this.cache[file.small] = data
        return data
    }
}