import path from "path";
import { getSettingsDate } from "../MainBuild/ImportModule.js";
import EasyFs from "../OutputInput/EasyFs.js";
import { SystemData } from "./SearchFileSystem.js";
export default class CompileState {
    constructor() {
        this.state = { update: 0, pageArray: [], importArray: [], fileArray: [] };
        this.state.update = getSettingsDate();
    }
    get scripts() {
        return this.state.importArray;
    }
    get pages() {
        return this.state.pageArray;
    }
    get files() {
        return this.state.fileArray;
    }
    addPage(path, type) {
        if (!this.state.pageArray.find(x => x[0] == path && x[1] == type))
            this.state.pageArray.push([path, type]);
    }
    addImport(path) {
        if (!this.state.importArray.includes(path))
            this.state.importArray.push(path);
    }
    addFile(path) {
        if (!this.state.fileArray.includes(path))
            this.state.fileArray.push(path);
    }
    export() {
        return EasyFs.writeJsonFile(CompileState.filePath, this.state);
    }
    static async checkLoad() {
        if (!await EasyFs.existsFile(this.filePath))
            return;
        const state = new CompileState();
        state.state = await EasyFs.readJsonFile(this.filePath);
        if (state.state.update != getSettingsDate())
            return;
        return state;
    }
}
CompileState.filePath = path.join(SystemData, "CompileState.json");
//# sourceMappingURL=CompileState.js.map