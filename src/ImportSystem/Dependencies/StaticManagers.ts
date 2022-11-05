import {importStorage, pagesStorage, staticFilesStorage} from "../../Storage/StaticStorage.js";
import DepManager from "./DepManager.js";
import CacheWaitImport from '../Loader/Imports/FileImporter/CacheWaitImport.js';

export const MSFiles = new DepManager(staticFilesStorage);
export const MImport = new DepManager(importStorage);

export function compileClearStorage() {
    staticFilesStorage.clear();
    importStorage.clear();
    pagesStorage.clear();
    CacheWaitImport.clear();

    MSFiles.init();
    MImport.init();
}