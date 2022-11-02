import RequestWrapper from "../ProcessURL/RequestWrapper.js";
import RequestParser from "./RequestParser.js";
import fileSender from "./Senders/StaticFile/index.js";
import createPageRuntime from './Senders/PageRuntime/index.js';
import createApiCall from './Senders/ApiCall/index.js';


export default async function switchContent(wrapper: RequestWrapper) {
    const parser = new RequestParser(wrapper);

    try {
        if (await fileSender(parser)) {
            return;
        }

        if (await createApiCall(parser)) {
            return;
        }

        await createPageRuntime(parser);

    } finally {
        await parser.clear();
    }
}