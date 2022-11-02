import {StringAnyMap} from '../../../../Settings/types.js';
import RequestWrapper from '../../../ProcessURL/RequestWrapper.js';
import PPath from '../../../../Settings/PPath.js';

const URL_SPLIT = '/';
export default class RequestWrapperAPI {
    defineObject: StringAnyMap = {};
    validateURL: any[] = [];
    workingPath: string[];
    workingPathCount = 0;
    APIError: any = false;
    APIResponse: any;

    constructor(public request: RequestWrapper, public module: any) {
    }

    private static splitURL(url: string) {
        return url.substring(URL_SPLIT.length).split(URL_SPLIT); // urls starts with '/' and that not part of the api
    }

    setWorkingPath(original: PPath) {
        const restOfPath = this.request.path.nested.substring(original.nested.length);
        this.workingPath = RequestWrapperAPI.splitURL(restOfPath);

        this.workingPathCount = RequestWrapperAPI.splitURL(original.nested).length;
        this.workingPathCount -= this.workingPath.length;
    }

    nextPathStep() {
        this.workingPathCount++;
        return this.workingPath.shift();
    }
}