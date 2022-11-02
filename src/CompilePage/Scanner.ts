import easyFS from '../Util/EasyFS.js';
import {directories, ScriptExtension} from '../Settings/ProjectConsts.js';
import {Dirent} from 'fs';
import PPath from '../Settings/PPath.js';
import importPage from './ImportPage.js';

async function scanForPages(nestedSearch = '', pages: PPath[] = []) {
    const staticWebsite = PPath.fromNested(directories.Locate.static, nestedSearch);
    const files = <Dirent[]>await easyFS.readdir(staticWebsite.full, {withFileTypes: true});

    const promises = [];
    for(const file of files){
        const nestedJoin = staticWebsite.clone().join(file.name);
        const fileExt = nestedJoin.ext.substring(1);

        if(file.isDirectory()){
            await easyFS.mkdirIfNotExists(nestedJoin.compile, {recursive: true});
            promises.push(scanForPages(nestedJoin.nested, pages));

        } else if(ScriptExtension.SSRExtensions.includes(fileExt)){
            pages.push(nestedJoin);
        }
    }

    await Promise.all(promises);
    return pages;
}

export default async function compileAllPages(){
    const pages = await scanForPages();
    const pagesImport = pages.map(page => importPage(page, page.ext.substring(1)));

    await Promise.all(pagesImport);
}