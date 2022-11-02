import RequestWrapper from "../ProcessURL/RequestWrapper.js";
import {GlobalSettings} from '../../Settings/GlobalSettings.js';
import {promisify} from 'node:util';
import easyFS from '../../Util/EasyFS.js';
import {DAYS_IN_SECONDS} from '../../Settings/BasicConts.js';

const COOKIE_SETTINGS = {
    httpOnly: true,
    signed: true,
    maxAge: GlobalSettings.serveLimits.cookiesExpiresDays * DAYS_IN_SECONDS
};

export function setCookiesExpiresDays(days: number) {
    COOKIE_SETTINGS.maxAge = DAYS_IN_SECONDS * days;
}

export default class RequestParser {
    private copyCookies: any;
    public pageHadError = false;

    constructor(public wrapper: RequestWrapper) {
    }

    async parse() {
        const {res, req} = this.wrapper;
        const {cookies, cookieEncrypter, session} = GlobalSettings.middleware;

        await promisify(cookies)(req, res);
        await promisify(cookieEncrypter)(req, res);
        await promisify(session)(req, res);
        await promisify(cookies)(req, res);
        this.copyCookies = req.signedCookies;
    }

    private handleCookies() {
        if (!this.copyCookies) {
            return;
        }

        const {res, req} = this.wrapper;
        for (const name in req.signedCookies) {//update cookies
            const checkCookieChange = typeof req.signedCookies[name] != 'object' && req.signedCookies[name] != this.copyCookies[name] ||
                JSON.stringify(req.signedCookies[name]) != JSON.stringify(this.copyCookies[name]);

            if (checkCookieChange) {
                res.cookie(name, req.signedCookies[name], COOKIE_SETTINGS);
            }
        }

        for (const name in this.copyCookies) {// delete not exits cookies
            if (res.signedCookies[name] == null) {
                res.clearCookie(name);
            }
        }
    }

    private async deleteFileUpload(){
        const files = this.wrapper.req.files;
        if(!files){
            return;
        }

        const deleteFiles = [];
        for(const fileName in files){
            const file = files[fileName];
            if(Array.isArray(file)){
                deleteFiles.push(...file.map(x => x.filepath));
            } else {
                deleteFiles.push(file.filepath);
            }
        }

        if(deleteFiles.length){
            const promiseDelete = deleteFiles.map(filePath => easyFS.unlinkIfExists(filePath));
            await Promise.all(promiseDelete);
        }
    }

    async finish() {
        this.handleCookies();
    }

    async clear() {
        await this.deleteFileUpload();
    }
}