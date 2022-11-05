import PPath from '../Settings/PPath.js';
import {ScriptExtension} from '../Settings/ProjectConsts.js';
import JSONStorage from '../Storage/JSONStorage.js';
import importPage from './ImportPage.js';
import {FileImporter} from '../ImportSystem/Loader/index.js';
import {compileClearStorage} from '../ImportSystem/Dependencies/StaticManagers.js';
import {getSettingsFile} from '../Settings/SettingsLoader.js';
import {getChangeDate} from '../ImportSystem/Dependencies/utils.js';

class CompileState {
    private pages: PPath[];
    private scripts: PPath[];
    private storage: JSONStorage;
    private lastStateChange: number;

    constructor() {
        this.storage = new JSONStorage('compile-state');
        this.loadState();
    }

    addFile(file: PPath) {
        const fileExt = file.ext.substring(1);

        if (ScriptExtension.SSRExtensions.includes(fileExt)) {
            this.pages.push(file);

        } else if (ScriptExtension.scriptArray.includes(fileExt)) {

            this.scripts.push(file);
        }
    }

    async updateStateChangeTime() {
        const settingsFile = await getSettingsFile();
        const changeTime = await getChangeDate(settingsFile);

        if (this.lastStateChange != changeTime) {
            this.lastStateChange = changeTime;
            return true;
        }

        return false;
    }

    async activate() {
        const pagesImport = this.pages.map(page => importPage(page, {defaultPageExtension: page.ext.substring(1)}));
        const scriptsImport = this.scripts.map(scriptFile => new FileImporter(scriptFile).buildFileOnChange());
        await Promise.all(pagesImport.concat(scriptsImport));
    }

    private loadState() {
        const pages: string[] = this.storage.store.pages ?? [];
        this.pages = pages.map(file => new PPath(file));


        const scripts: string[] = this.storage.store.pages ?? [];
        this.scripts = scripts.map(file => new PPath(file));

        this.lastStateChange = this.storage.store.lastStateChange;
    }

    save() {
        const pages = this.pages.map(x => x.small);
        const scripts = this.scripts.map(x => x.small);

        this.storage.update('pages', pages);
        this.storage.update('scripts', scripts);
        this.storage.update('lastStateChange', this.lastStateChange);
    }

    clear() {
        compileClearStorage();

        this.pages = [];
        this.scripts = [];
        this.storage.clear();
    }
}

const compileState = new CompileState();
export default compileState;