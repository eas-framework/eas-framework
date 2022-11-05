import easyFS from '../Util/EasyFS.js';
import {directories} from '../Settings/ProjectConsts.js';
import {Dirent} from 'fs';
import PPath from '../Settings/PPath.js';
import compileState from './State.js';

async function scanFilesState(nestedSearch = '') {
    const staticWebsite = PPath.fromNested(directories.Locate.static, nestedSearch);
    const files = <Dirent[]>await easyFS.readdir(staticWebsite.full, {withFileTypes: true});

    const promises = [];
    for (const file of files) {
        const nestedJoin = staticWebsite.clone().join(file.name);

        if (file.isDirectory()) {
            await easyFS.mkdirIfNotExists(nestedJoin.compile, {recursive: true});
            promises.push(scanFilesState(nestedJoin.nested));

        } else {
            compileState.addFile(nestedJoin);
        }
    }

    await Promise.all(promises);
}

export default async function compileAllPages() {
    if (!await compileState.updateStateChangeTime()) {
        await compileState.activate();
        return;
    }


    compileState.clear();
    await scanFilesState();
    compileState.save();

    await compileState.activate();
}