import path from "path";
import { getSettingsDate } from "../MainBuild/ImportModule";
import EasyFs from "../OutputInput/EasyFs";
import { SystemData } from "./SearchFileSystem";

type CState = {
    update: number
    pageArray: string[],
    importArray: string[]
}

export default class CompileState {
    private state: CState = { update: 0, pageArray: [], importArray: [] }
    static filePath = path.join(SystemData, "CompileState.json")
    constructor() {
        this.state.update = getSettingsDate()
    }

    get scripts() {
        return this.state.importArray
    }

    addPage(path: string) {
        if (!this.state.pageArray.includes(path))
            this.state.pageArray.push(path)
    }

    addImport(path: string) {
        if (!this.state.importArray.includes(path))
            this.state.importArray.push(path)
    }

    export() {
        return EasyFs.writeJsonFile(CompileState.filePath, this.state)
    }

    static async checkLoad() {
        if (!await EasyFs.existsFile(this.filePath)) return

        const state = new CompileState()
        state.state = await EasyFs.readJsonFile(this.filePath)

        if (state.state.update != getSettingsDate()) return

        return state
    }
}