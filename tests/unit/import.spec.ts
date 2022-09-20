import assert from "node:assert";
import { FileImporter } from "../../src/ImportSystem/Loader/index.js";
import { GlobalSettings } from "../../src/Settings/GlobalSettings.js";
import { createImportPath, triggerHotReload } from "./contents/import/mock.js";

const FILE_RELATIVE_PATH = 'import1.hide.ts'
const FILE_RELATIVE_NESTED_PATH = 'import2.hide.ts'

function callImportFile(file: string){
    const importFile = createImportPath(file)
    return new FileImporter(importFile).createImport();
}


describe('EAS importing system', () => {
    let lastImport: any
    it('simple import', async () => {
        GlobalSettings.development = true
        lastImport = await callImportFile(FILE_RELATIVE_PATH)
    })

    it('cache check', async () => {
        const sameImport = await callImportFile(FILE_RELATIVE_PATH)
        assert.equal(lastImport, sameImport)
    })

    it('cache reload', async () => {
        await triggerHotReload(FILE_RELATIVE_PATH)
        const sameImport = await callImportFile(FILE_RELATIVE_PATH)
        assert.notEqual(lastImport, sameImport)
        lastImport = sameImport
    })

    it('cache reload nested', async () => {
        await triggerHotReload(FILE_RELATIVE_NESTED_PATH)
        const sameImport = await callImportFile(FILE_RELATIVE_PATH)
        assert.notEqual(lastImport, sameImport)
    })
})

describe('EAS importing system PRODUCTION', () => {
    let lastImport: any
    it('simple import', async () => {
        GlobalSettings.development = false
        lastImport = await callImportFile(FILE_RELATIVE_PATH)
    })

    it('cache check', async () => {
        const sameImport = await callImportFile(FILE_RELATIVE_PATH)
        assert.equal(lastImport, sameImport)
    })

    it('cache not reload', async () => {
        await triggerHotReload(FILE_RELATIVE_PATH)
        const sameImport = await callImportFile(FILE_RELATIVE_PATH)
        assert.equal(lastImport, sameImport)
        lastImport = sameImport
    })

    it('cache not reload nested', async () => {
        await triggerHotReload(FILE_RELATIVE_NESTED_PATH)
        const sameImport = await callImportFile(FILE_RELATIVE_PATH)
        assert.equal(lastImport, sameImport)
    })
})
