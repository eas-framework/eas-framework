import {SystemLog} from "../../../../Logger/BasicLogger.js";
import {GlobalSettings} from "../../../../Settings/GlobalSettings.js";
import PPath from "../../../../Settings/PPath.js";
import EasyFS from "../../../../Util/EasyFS.js";
import {customImportFile, isCustomFile} from "../../../CustomImport/index.js";
import DepCreator, {ShareOptions} from "../../../Dependencies/DepCreator.js";
import {MImport} from "../../../Dependencies/StaticManagers.js";
import {addExtension} from "../../Builders/BaseBuilders.js";
import FileBuilder from "../../Builders/FileBuilder.js";
import IBuilder from "../../Builders/IBuilder.js";
import {locationParser} from "../../LocationParser.js";
import IImporter from "../IImporter.js";
import PackageImporter from "../PackageImporter.js";
import CacheWaitImport from "./CacheWaitImport.js";
import {CircleDependenciesError, ImportNotFound} from "./Errors.js";
import {importEASScript} from "./NodeImporter.js";
import {defaultExportFile} from './utils.js';

type CacheOptions = 'skip-loading' | // skip loading from cache
    'recompile-file' | // recompile even if there is no change
    'skip-write-tree-on-build' // don't write the dep tree when building the file

export type FileImporterOptions = {
    options?: any,
    exportFile?: PPath,
    session?: DepCreator,
    importLine?: string,
    importStack?: IImporter[],
    skipCache?: CacheOptions[],
    builder?: IBuilder<any>,
    importParams?: any[],
    allowAutoExtension?: boolean
    allowNestedDep?: boolean
    displayNotFoundError?: boolean
}
export default class FileImporter extends IImporter {
    public session: DepCreator;
    private skipCache: CacheOptions[];
    private cache: CacheWaitImport;
    private builder: IBuilder<any>;
    private alreadyCreated = false;
    private exportFile: PPath;
    private readonly importParams: any[];
    private readonly allowAutoExtension: boolean;
    private shareOptions: ShareOptions = {disableCache: false};
    private readonly allowNestedDep: boolean;
    private readonly displayNotFoundError: boolean;

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
     * @param allowAutoExtension - allow to auto generate file extension
     * @param allowNestedDep - if the nested dependency change then it will reload all the parents
     * @param displayNotFoundError - log import not found error
     */
    constructor(file: PPath, {
        options,
        session,
        exportFile = defaultExportFile(file),
        importLine = file.small,
        importStack = [],
        skipCache = [],
        builder = new FileBuilder(),
        importParams = [],
        allowAutoExtension = true,
        allowNestedDep = true,
        displayNotFoundError = true
    }: FileImporterOptions = {}) {
        super(file, importLine, importStack, options);

        this.session = session || MImport.createSession(this.shareOptions);
        this.cache = new CacheWaitImport(this.constructor.name, file);

        this.skipCache = skipCache;
        this.builder = builder;
        this.exportFile = exportFile;
        this.importParams = importParams;
        this.allowAutoExtension = allowAutoExtension;
        this.allowNestedDep = allowNestedDep;
        this.displayNotFoundError = displayNotFoundError;

        //bind methods
        this.requireNestedFile = this.requireNestedFile.bind(this);
    }

    private checkCircularDependencies() {

        const haveIndex = this.importStack.findIndex(x => x.file.small == this.file.small);
        if (haveIndex == -1) {
            return;
        }

        const sliceStack = this.importStack.slice(haveIndex);
        SystemLog.error('circle-dependencies', new CircleDependenciesError(sliceStack));
        return true;

    }

    private addExtension() {
        if (this.allowAutoExtension) {
            this.file = addExtension(this.file);
        }
    }

    async createImport(): Promise<any> {
        if (this.alreadyCreated) {
            SystemLog.error('import-already-created', `Import "${this.file.small}" already created`, 1);
            return;
        }
        this.alreadyCreated = true;

        if (await this.customImport()) {
            return this.imported;
        }

        if (this.checkCircularDependencies()) {
            return null;
        }

        this.addExtension();
        await this.importAndBuildFile();

        return this.imported;
    }

    private async fileExits() {
        return await this.session.getNewTime(this.file);
    }

    private async returnCache(notChanged: 'isDepChanged' | 'treeChanged') {
        return !this.skipCache.includes('skip-loading') && this.cache.get(this.file) && (!GlobalSettings.development || !await this.session[notChanged](this.file));
    }

    private async updateFileDep(value?: any) {
        GlobalSettings.development && await this.session.updateDep(this.file, false, value);
    }

    private async buildFile() {
        const content = await this.builder.build(this.file, this.options);
        await EasyFS.writeFileAndPath(this.exportFile.compile, content);

        if (!this.skipCache.includes('skip-write-tree-on-build')) {
            await this.updateFileDep();
        }
    }

    private async requireNestedFile(file: string, options: any) {
        const importStack = this.importStack.concat([this]);
        const importLine = FileImporter.importLocation();

        const parse = locationParser(file, this.file);

        let importer: IImporter;
        if (parse.type == 'package') {
            importer = new PackageImporter(parse.location, {options, importLine, importStack});
        } else {
            importer = new FileImporter(parse.location, {
                options,
                importLine,
                importStack,
                session: this.allowNestedDep && this.session.nestedDepFile(this.file)
            });
        }

        return await importer.createImport();
    }

    private async importFile() {
        const module = await importEASScript(this.exportFile.compile);

        const exportModule = {exports: {}};
        await module(this.requireNestedFile, exportModule, ...this.importParams);
        this.cache.update(this.file, {
            exports: exportModule.exports,
            deps: this.session.getStoreJSON(this.file)
        });

        return exportModule.exports;
    }

    async buildFileOnChange() {
        if (this.skipCache.includes('recompile-file') || await this.session.treeChanged(this.file)) {
            if (!await this.fileExits()) {
                if (this.displayNotFoundError) {
                    SystemLog.error('import-file-not-found', new ImportNotFound(this));
                }
                return false; // error file not found
            }
            await this.buildFile();
        }
        return true;
    }

    private async loadImportFromCache() {
        if (await this.returnCache('treeChanged')) {
            const {deps, exports} = this.cache.get(this.file);
            this.imported = exports;
            await this.updateFileDep(deps);
            return true;
        }
        return false;
    }

    private async importAndBuildFile() {

        await this.cache.waitSimultaneousImport();
        this.cache.makeOthersWait();

        try {

            if (await this.loadImportFromCache()) {
                return;
            }

            if (!await this.buildFileOnChange()) {
                return; // error file not found
            }

            this.imported = await this.importFile();
            this.shareOptions.disableCache = true;
        } finally {
            this.cache.resolveImport();
        }
    }

    private async customImport() {
        if (!isCustomFile(this.file, this.options)) {
            return false;
        }

        await this.cache.waitSimultaneousImport();
        this.cache.makeOthersWait(); // make new imports of this file wait for this import, so they can be loaded from cache

        try {
            if (await this.returnCache('isDepChanged')) {
                this.imported = this.cache.get(this.file);
                return true;
            }

            this.imported = this.cache.update(this.file, await customImportFile(this.file, this.options));
            await this.updateFileDep();
        } finally {
            this.cache.resolveImport();
        }

        return true;
    }
}