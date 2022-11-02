import PPath from '../../../../Settings/PPath.js';
import {SessionBuild} from '../../../Session.js';
import {PageBuilder} from './PageBuilder.js';

export default async function fullPageBuilder(page: PPath, session: SessionBuild){
    const build = await PageBuilder.newPage(page, session);
    await build.build(page, page);

    return build.codeFileScript.plus(build.content);
}