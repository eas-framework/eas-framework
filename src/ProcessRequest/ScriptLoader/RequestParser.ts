import RequestWarper from "../ProcessURL/RequestWarper";

export default class RequestParser {
    private copyCookies: any;

    constructor(public warper: RequestWarper) {
    }

    async parser(){

    }

    async finish(){

        await this.clear();
    }

    async clear(){

    }
}