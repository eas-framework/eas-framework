import PPath from '../Settings/PPath.js';
import {FileImporter} from '../ImportSystem/Loader/index.js';
import PageBuilder from '../ImportSystem/Loader/Builders/PageBuilder.js';
import {ScriptExtension} from '../Settings/ProjectConsts.js';
import DepManager from '../ImportSystem/Dependencies/DepManager.js';
import JSONStorage from '../Storage/JSONStorage.js';
import {pagesStorage} from '../Storage/StaticStorage.js';
import DepCreator from '../ImportSystem/Dependencies/DepCreator.js';
import {FileImporterOptions} from '../ImportSystem/Loader/Imports/FileImporter/FileImporter.js';

function createPageDepCreator(page: PPath) {
    const storage = new JSONStorage(page.small, pagesStorage.store);
    const manager = new DepManager(storage);


    const storageUpLevel = new JSONStorage('main', { // fake deep level deps object
        main: {
            [page.small]: storage.store.deps
        }
    });

    return new DepCreator(manager, storageUpLevel);
}

export function pageExitPerCompile(page: PPath) {
    return Boolean(pagesStorage.store[page.small]);
}

type importPageOptions = { defaultPageExtension?: string, options?: FileImporterOptions };
export default async function importPage(page: PPath, {defaultPageExtension, options}: importPageOptions) {

    const pageExtension = page.ext.substring(1);
    if (!ScriptExtension.SSRExtensions.includes(pageExtension)) {
        page = page.clone();
        page.nested += '.' + defaultPageExtension;
    }

    const moduleScriptFunc = new FileImporter(page, {
        session: createPageDepCreator(page),
        builder: new PageBuilder(),
        allowAutoExtension: false, // no need for '.js' or '.ts'  extension
        allowNestedDep: false, // every request require the imports again - there is no need
        ...options
    });

    return await moduleScriptFunc.createImport();
}