import PPath from '../Settings/PPath.js';
import {FileImporter} from '../ImportSystem/Loader/index.js';
import PageBuilder from '../ImportSystem/Loader/Builders/PageBuilder.js';
import {SessionBuild} from './Session.js';
import {ScriptExtension} from '../Settings/ProjectConsts.js';

export default async function importPage(page: PPath, defaultPageExtension: string, importLine?: string){
    const pageExtension = page.ext.substring(1);
    if(!ScriptExtension.SSRExtensions.includes(pageExtension)){
        page = page.clone();
        page.nested += '.' + defaultPageExtension;
    }

    const moduleScriptFunc = new FileImporter(page, {
        session: SessionBuild.getPageDepsSession(page),
        builder: new PageBuilder(),
        allowAutoExtension: false, // no need for '.js' or '.ts'  extension
        importLine
    });

    return await moduleScriptFunc.createImport();
}