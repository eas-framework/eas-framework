import RequestParser from '../../RequestParser.js';
import {promisify} from 'node:util';
import easyFS from '../../../../Util/EasyFS.js';
import {getFullPath} from './utils.js';
import type {PageSession} from './RequestSession.js';

export default class PageRequestParser {

    private pageWasRedirect: boolean = false;
    private readonly realRedirect: Function;
    private readonly realSendFile: Function;
    private sendFileInfo?: { path: string, deleteAfter };

    constructor(public parser: RequestParser) {
        this.realRedirect = parser.wrapper.res.redirect.bind(parser.wrapper.res);
        this.realSendFile = parser.wrapper.res.sendFile.bind(parser.wrapper.res);

        this.redirect = this.redirect.bind(this);
        this.sendFile = this.sendFile.bind(this);
        this.reload = this.reload.bind(this);
    }

    async parse(){
        await this.parser.parse();
    }

    redirect(url: string, status?: number){
        this.pageWasRedirect = true;
        this.realRedirect(url, status);
        return this.parser.wrapper.res;
    }

    sendFile(path: string, deleteAfter = false){
        this.sendFileInfo = {path, deleteAfter};
        return this.parser.wrapper.res;
    }

    reload(){
        return this.redirect(this.parser.wrapper.req.url);
    }

    async flashPage(pageSession: PageSession){
        await this.parser.finish();

        if(this.pageWasRedirect){
            return;
        }

        if(this.sendFileInfo){
            const fullFilePath = getFullPath(this.sendFileInfo.path, this.parser.wrapper.path.full);
            await promisify(this.realSendFile)(fullFilePath);

            if(this.sendFileInfo.deleteAfter){
                await easyFS.unlinkIfExists(fullFilePath);
            }
            return;
        }

        const pageHTMLResponse = pageSession.out_run_script.text.trim();
        if(pageHTMLResponse){
            this.parser.wrapper.res.send(pageHTMLResponse);
        } else {
            this.parser.wrapper.res.end();
        }
    }
}