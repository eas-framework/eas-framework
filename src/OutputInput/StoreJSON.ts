import { StringAnyMap } from "../CompileCode/XMLHelpers/CompileTypes";
import { SystemData } from "../RunTimeBuild/SearchFileSystem";
import EasyFs from "./EasyFs";

export default class StoreJSON {
    private savePath: string;
    store: StringAnyMap = {};

    constructor(filePath: string, autoLoad = true) {
        this.savePath = `${SystemData}/${filePath}.json`;
        autoLoad && this.loadFile();

        this.save = this.save.bind(this);
        process.on('SIGINT', this.save)
        process.on('exit', this.save);
    }

    async loadFile() {
        if (await EasyFs.existsFile(this.savePath))
            this.store = JSON.parse(await EasyFs.readFile(this.savePath) || '{}');
    }

    update(key: string, value: any) {
        this.store[key] = value;
    }

    have(key: string, create?: () => string) {
        let item = this.store[key];
        if (item || !create) return item;

        item = create();
        this.update(key, item);

        return item;
    }

    clear(){
        for(const i in this.store){
            this.store[i] = undefined
            delete this.store[i]
        }
    }

    private save() {
        return EasyFs.writeJsonFile(this.savePath, this.store);
    }
}