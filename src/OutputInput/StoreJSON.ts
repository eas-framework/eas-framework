import { StringAnyMap } from "../CompileCode/XMLHelpers/CompileTypes";
import { SystemData } from "../RunTimeBuild/SearchFileSystem";
import EasyFs from "./EasyFs";

/* It's a JSON file manager */
export default class StoreJSON {
    private savePath: string;
    store: StringAnyMap = {};

    constructor(filePath: string, autoLoad = true) {
        this.savePath = `${SystemData}/${filePath}.json`;
        autoLoad && this.loadFile();

        process.on('SIGINT', () => {
            this.save();
            setTimeout(() => process.exit());
        });
        process.on('exit', this.save.bind(this));
    }

    async loadFile() {
        if (await EasyFs.existsFile(this.savePath))
            this.store = JSON.parse(await EasyFs.readFile(this.savePath) || '{}');
    }

    update(key: string, value: any) {
        this.store[key] = value;
    }

    /**
     * If the key is in the store, return the value. If not, create a new value, store it, and return it
     * @param {string} key - The key to look up in the store.
     * @param [create] - A function that returns a string.
     * @returns The value of the key in the store.
     */
    have(key: string, create?: () => string) {
        let item = this.store[key];
        if (item || !create) return item;

        item = create();
        this.update(key, item);

        return item;
    }

    clear() {
        for (const i in this.store) {
            this.store[i] = undefined
            delete this.store[i]
        }
    }

    private save() {
        return EasyFs.writeJsonFile(this.savePath, this.store);
    }
}