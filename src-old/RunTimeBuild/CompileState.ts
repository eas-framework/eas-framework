import path from "path";
import { getSettingsDate } from "../MainBuild/ImportModule";
import EasyFs from "../OutputInput/EasyFs";
import { SystemData } from "./SearchFileSystem";

type CState = {
    update: number
    pageArray: string[][],
    importArray: string[]
    fileArray: string[]
}

/* This class is used to store the state of the project */
export default class CompileState {
    private state: CState = { update: 0, pageArray: [], importArray: [], fileArray: [] }
    static filePath = path.join(SystemData, "CompileState.json")
    constructor() {
        this.state.update = getSettingsDate()
    }

    get scripts() {
        return this.state.importArray
    }

    get pages() {
        return this.state.pageArray
    }

    get files() {
        return this.state.fileArray
    }

    addPage(path: string, type: string) {
        if (!this.state.pageArray.find(x => x[0] == path && x[1] == type))
            this.state.pageArray.push([path, type])
    }

    addImport(path: string) {
        if (!this.state.importArray.includes(path))
            this.state.importArray.push(path)
    }

    addFile(path: string) {
        if (!this.state.fileArray.includes(path))
            this.state.fileArray.push(path)
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