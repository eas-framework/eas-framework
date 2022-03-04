import path from "path";
import { getSettingsDate } from "../MainBuild/ImportModule.js";
import EasyFs from "../OutputInput/EasyFs.js";
import { SystemData } from "./SearchFileSystem.js";
export default class CompileState {
    constructor() {
        this.state = { update: 0, pageArray: [], importArray: [] };
        this.state.update = getSettingsDate();
    }
    get scripts() {
        return this.state.importArray;
    }
    addPage(path) {
        if (!this.state.pageArray.includes(path))
            this.state.pageArray.push(path);
    }
    addImport(path) {
        if (!this.state.importArray.includes(path))
            this.state.importArray.push(path);
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