import importPage from '../../../../CompilePage/ImportPage.js';
import RequestParser from '../../RequestParser.js';
import PPath from '../../../../Settings/PPath.js';
import returnPageError, {handlePageNotFound, INCLUDE_STATUS_READ_TEXT, INCLUDE_STATUS_SSR_BLOCK} from './PageError.js';
import EasyFS from '../../../../Util/EasyFS.js';
import {ScriptExtension} from '../../../../Settings/ProjectConsts.js';
import createPageSession, {PageSession} from './RequestSession.js';
import PageRequestParser from './PageRequestParser.js';


type includeOptions = { status?: string, fileExt?: string };

function importRuntimeSSRInclude(pageSession: PageSession, parser: RequestParser, lastPath: PPath) {
    return async function (filePath: string, extendsSession = {}, options: includeOptions = {}) {
        const includePath = lastPath.dirname.join(filePath);
        const pageFunc = await importPage(includePath, {defaultPageExtension: options.fileExt ?? ScriptExtension.pages.component});

        if (pageFunc == null) {
            options.status = INCLUDE_STATUS_READ_TEXT;
            return await EasyFS.readFile(includePath.full, 'utf8', true);
        }

        options.status = INCLUDE_STATUS_SSR_BLOCK;
        return importRuntimeSSR(pageFunc.default, {...extendsSession, ...pageSession}, parser, includePath);
    };
}

export function importRuntimeSSRTransfer(includeFunction: ReturnType<typeof importRuntimeSSRInclude>, pageSession: PageSession, parser: RequestParser, lastPath: PPath) {
    return function (filePath: string, preserveForm = false, extendsSession = {}, includeStatus: includeOptions = {}) {
        pageSession.out_run_script.text = '';
        pageSession.transfer = lastPath.nested;

        if (!preserveForm) {
            parser.wrapper.req.body = null;
            parser.wrapper.req.query = {};
        }

        includeStatus.fileExt ??= ScriptExtension.pages.page; // default file extension is a page
        return includeFunction(filePath, extendsSession, includeStatus);
    };
}

async function importRuntimeSSR(pageFunc: any, pageSession: PageSession, parser: RequestParser, lastPath: PPath) {
    const module = {exports: {}};

    const include = importRuntimeSSRInclude(pageSession, parser, lastPath);
    const transfer = importRuntimeSSRTransfer(include, pageSession, parser, lastPath);
    const server = {include, transfer};

    try {
        await pageFunc(
            pageSession,
            module,
            server
        );
    } catch (error) {
        await returnPageError(error, parser, pageSession, server.transfer);
    }

    return module;
}

export default async function createPageRuntime(parser: RequestParser) {
    const pageFunc = await importPage(parser.wrapper.path, {
        defaultPageExtension: ScriptExtension.pages.page,
        options: {
            displayNotFoundError: false
        }
    });

    if (pageFunc == null) {
        if (handlePageNotFound(parser)) {
            await createPageRuntime(parser);
        }
        return;
    }

    const pageParser = new PageRequestParser(parser);
    await pageParser.parse();

    const pageSession = createPageSession(pageParser, pageFunc);
    await importRuntimeSSR(pageFunc.default, pageSession, parser, parser.wrapper.path);

    await pageParser.flashPage(pageSession);
    await parser.finish();
}