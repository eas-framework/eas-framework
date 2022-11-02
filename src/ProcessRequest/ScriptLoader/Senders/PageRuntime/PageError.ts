import RequestParser from '../../RequestParser.js';
import {PageSession} from './RequestSession.js';
import {GlobalSettings} from '../../../../Settings/GlobalSettings.js';
import type {importRuntimeSSRTransfer} from './index.js';
import {StringAnyMap} from '../../../../Settings/types.js';
import path from 'node:path';
import {NOT_FOUND_ERROR_CODE} from '../../../ProcessURL/RequestWrapper.js';

export const INCLUDE_STATUS_READ_TEXT = 'read-text-file';
export const INCLUDE_STATUS_SSR_BLOCK = 'including-ssr-block';
function simpleErrorPrint(error: Error, parser: RequestParser){
    if(GlobalSettings.development){
        parser.wrapper.res.send(error.stack);
    } else {
        parser.wrapper.res.sendStatus(parser.wrapper.req.statusCode);
    }
}

export default async function returnPageError(error: Error, parser: RequestParser, pageSession: PageSession, transfer: ReturnType<typeof importRuntimeSSRTransfer>) {
    if (parser.pageHadError){
        return;
    }
    parser.pageHadError = true;
    pageSession.error = error;

    if(parser.wrapper.makeServerError()){
        const includeStatus: StringAnyMap = {};
        await transfer(path.join('/', parser.wrapper.path.nested), false, {}, includeStatus);

        if(includeStatus.status === INCLUDE_STATUS_SSR_BLOCK){
            return; // page returns error successfully
        }
    }

    await simpleErrorPrint(error, parser);
}

function pageNotFoundSimpleError(parser: RequestParser){
    parser.wrapper.res.sendStatus(NOT_FOUND_ERROR_CODE);
}

/**
 * Handle page not found error
 * @param parser
 * @return {Boolean} retry render page
 */
export function handlePageNotFound(parser: RequestParser){
    if(parser.wrapper.notError){
        parser.wrapper.makeNotFound();
        return true;
    } else {
        pageNotFoundSimpleError(parser);
    }
}