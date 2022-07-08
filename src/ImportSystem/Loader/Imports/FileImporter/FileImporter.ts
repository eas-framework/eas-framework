import { SystemLog } from "../../../../Logger/BasicLogger";
import { LogData } from "../../../../Logger/Logger";
import { GlobalSettings } from "../../../../Settings/GlobalSettings";
import PPath from "../../../../Settings/PPath";
import EasyFS from "../../../../Util/EasyFS";
import { Capitalize } from "../../../../Util/Strings";
import { customImportFile, isCustomFile } from "../../../CustomImport";
import DepCreator, { ShareOptions } from "../../../Dependencies/DepCreator";
import { MPages } from "../../../Dependencies/StaticManagers";
import { addExtension } from "../../Builders/BaseBuilders";
import FileBuilder from "../../Builders/FileBuilder";
import IBuilder from "../../Builders/IBuilder";
import { locationParser } from "../../LocationParser";
import { normalize } from "../../utils";
import IImporter from "../IImporter";
import PackageImporter from "../PackageImporter";
import CacheWaitImport from "./CacheWaitImport";
import { CircleDependenciesError, ImportNotFound } from "./Errors";
import { nodeImportWithoutCache } from "./NodeImporter";

type CacheOptions = 'skip-loading' | // skip loading from cache
    'recompile-file' | // recompile even if there is no change
    'skip-write-tree' // don't write the dep tree when building the file

export default class FileImporter extends IImporter {
    private session: DepCreator
    private skipCache: CacheOptions[]
    private cache: CacheWaitImport
    private builder: IBuilder<any>
    private alreadyCreated = false
    private exportFile: PPath
    private importParams: any[]
    private shareOptions: ShareOptions = { disableCache: false }

    /**
     * Create a file importer
     * @note do not create a 'session' yourself, but if you do - you need to add 'shareOptions' so you can disable the cache once the import completed
     * @param file - the file to import
     * @param options - extra options for the builder
     * @param session - dependency session 
     * @param importLine - the line of the import (include exact location, useful for debugging)
     * @param importStack - the stack of imports (useful to detect circular dependencies)
     * @param exportFile - custom path that the build will be saved to
     * @param skipCache - prevent loading this import from the cache, if this equals to 'rebuild' then the file will be recompile even if there is no change
     * @param builder - custom compilation for the file content
     * @param importParams - extra prams for the import - something like 'require', '__filename'
     */
    constructor(file: PPath, { options, session, exportFile = file, importLine = file.small, importStack = [], skipCache = [], builder = new FileBuilder(), importParams = [] }: { options?: any, exportFile?: PPath, session?: DepCreator, importLine?: string, importStack?: IImporter[], skipCache?: CacheOptions[], builder?: IBuilder<any>, importParams?: any[] } = {}) {
        super(file, importLine, importStack, options)
        this.skipCache = skipCache
        this.session = session ?? MPages.createSession(this.shareOptions)
        this.cache = new CacheWaitImport(this.constructor.name, file)
        this.builder = builder
        this.exportFile = exportFile
        this.importParams = importParams
    }

    private checkCircularDependencies() {

        const haveIndex = this.importStack.findIndex(x => x.file.small == this.file.small)
        if (haveIndex == -1) {
            return
        }

        const sliceStack = this.importStack.slice(haveIndex)
        SystemLog.error('circle-dependencies', new CircleDependenciesError(sliceStack))
        return true

    }

    private addExtension() {
        this.file = addExtension(this.file)
    }

    async createImport(): Promise<any> {
        if (this.alreadyCreated) {
            SystemLog.error('import-already-created', `Import "${this.file.small}" already created`, 1)
            return
        }
        this.alreadyCreated = true

        if (await this.customImport()) {
            return this.imported
        }

        if (this.checkCircularDependencies()) {
            return null
        }

        this.addExtension()
        await this.importAndBuildFile()

        return this.imported
    }

    private async fileExits() {
        return await this.session.getNewTime(this.file)
    }

    private async returnCache(changed: 'isDepChanged' | 'treeChanged') {
        return !this.skipCache.includes('skip-loading') && this.cache.get(this.file) && (!GlobalSettings.development || !await this.session[changed](this.file))
    }

    private async updateFileDep() {
        GlobalSettings.development && await this.session.updateDep(this.file)
    }

    private async buildFile() {
        const content = await this.builder.build(this.file, this.options)
        await EasyFS.writeFileAndPath(this.exportFile.compile, content)

        if (!this.skipCache.includes('skip-write-tree')) {
            await this.updateFileDep()
        }
    }

    private async requireNestedFile(file: string, options: any) {
        const importStack = this.importStack.concat([this])
        const importLine = FileImporter.importLocation()

        const parse = locationParser(normalize(file), this.file)

        let importer: IImporter
        if (parse.type == 'package') {
            importer = new PackageImporter(parse.location, { options, importLine, importStack })
        } else {
            importer = new FileImporter(parse.location, { options, importLine, importStack, session: this.session.nestedDepFile(this.file) })
        }

        return await importer.createImport()
    }

    private async importFile() {
        const module = await nodeImportWithoutCache(this.file.compile)
        this.cache.resolveImport() // resolve cache before importing to prevent non stop circular waiting

        const invokeModule = module(this.requireNestedFile, ...this.importParams)
        return this.cache.update(this.file, invokeModule)
    }

    private async importAndBuildFile() {

        await this.cache.waitSimultaneousImport()
        this.cache.makeOthersWait()

        if (await this.returnCache('treeChanged')) {
            this.imported = this.cache.get(this.file)
            this.cache.resolveImport()
            return
        }

        if (this.skipCache.includes('recompile-file') || await this.session.treeChanged(this.file)) {
            if (!await this.fileExits()) {
                SystemLog.error('import-file-not-found', new ImportNotFound(this))
                this.cache.resolveImport()
                return // error file not found
            }
            await this.buildFile()
        }

        this.imported = await this.importFile()
        this.shareOptions.disableCache = true
    }

    private async customImport() {
        if (!isCustomFile(this.file)) {
            return false
        }

        await this.cache.waitSimultaneousImport()
        this.cache.makeOthersWait() // make new imports of this file wait for this import, so they can be loaded from cache

        if (await this.returnCache('isDepChanged')) {
            this.imported = this.cache.get(this.file)
            return true
        }

        this.imported = this.cache.update(this.file, await customImportFile(this.file))
        await this.updateFileDep()
        this.cache.resolveImport()

        return true
    }
}