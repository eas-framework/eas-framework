import path from "node:path";
import {directories} from "../Settings/ProjectConsts.js";
import EasyFS from "../Util/EasyFS.js";

const fileLocation = () => path.join(directories.Locate.system.compile, "system-storage.json");
const dataObject = {};

/**
 * It loads the file and parses it into a JSON object.
 */
export async function loadSystemStorage() {
    const content = await EasyFS.readFile(fileLocation(), 'utf8', true) || '{}';
    Object.assign(dataObject, JSON.parse(content));
}

/**
 * When the program is about to exit, save the file.
 */
async function saveFile() {
    await EasyFS.writeJsonFile(fileLocation(), dataObject);
}

process.on('SIGINT', async () => {
    await saveFile();
    setTimeout(() => process.exit());
});

/* "It's a class that stores data in a JSON object."

The class has a single property, `name`, which is the name of the JSON object that will store the
data */
export default class JSONStorage {

    get store() {
        return this.dataJSON[this.name];
    }

    constructor(private name: string, private dataJSON = dataObject) {
        dataJSON[this.name] ??= {};
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
    have(key: string, create?: () => any) {
        let item = this.store[key];
        if (item || !create) {
            return item;
        }

        item = create();
        this.update(key, item);

        return item;
    }

    haveValue(value: string) {
        return Object.values(this.store).includes(value);
    }

    clear() {
        for (const i in this.store) {
            this.store[i] = null;
            delete this.store[i];
        }
    }
}