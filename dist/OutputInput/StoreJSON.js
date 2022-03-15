import { SystemData } from "../RunTimeBuild/SearchFileSystem.js";
import EasyFs from "./EasyFs.js";
export default class StoreJSON {
    constructor(filePath, autoLoad = true) {
        this.store = {};
        this.savePath = `${SystemData}/${filePath}.json`;
        autoLoad && this.loadFile();
        this.save = this.save.bind(this);
        process.on('SIGINT', this.save);
        process.on('exit', this.save);
    }
    async loadFile() {
        if (await EasyFs.existsFile(this.savePath))
            this.store = JSON.parse(await EasyFs.readFile(this.savePath) || '{}');
    }
    update(key, value) {
        this.store[key] = value;
    }
    have(key, create) {
        let item = this.store[key];
        if (item || !create)
            return item;
        item = create();
        this.update(key, item);
        return item;
    }
    clear() {
        for (const i in this.store) {
            this.store[i] = undefined;
            delete this.store[i];
        }
    }
    save() {
        return EasyFs.writeJsonFile(this.savePath, this.store);
    }
}
//# sourceMappingURL=StoreJSON.js.map