import { componentPerCompile, componentPerCompilePage, componentPostCompile, componentPostCompilePage } from "../BuildInComponents";
import { deleteCompileRuntimeDepsCache } from "../ImportFiles/compileImport";
import { PageTimeLogger } from "../OutputInput/Logger";
import { CacheCompileScript } from "./CompileScript/Compile";
import { SessionBuild } from "./Session";
import { addSiteMap, GlobalSitemapBuilder } from "./XMLHelpers/SitemapBuilder";

export async function perCompile() {
    GlobalSitemapBuilder.clear();
    componentPerCompile()
}

export async function postCompile() {
    componentPostCompile()

    PageTimeLogger.dispatch('create-sitemap');
    GlobalSitemapBuilder.buildAndSave(); // save sitemap
    PageTimeLogger.dispatch('end-create-sitemap');

    //clear data
    CacheCompileScript.clear();
    deleteCompileRuntimeDepsCache()
}

export async function perCompilePage(sessionInfo: SessionBuild, filePath: string, arrayType: string[]) {
    componentPerCompilePage(sessionInfo)
}

export async function postCompilePage(sessionInfo: SessionBuild, filePath: string, arrayType: string[]) {
    componentPostCompilePage(sessionInfo)
    addSiteMap(sessionInfo, filePath, arrayType) // add ans save on debug mode
}