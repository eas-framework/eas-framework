import path from "node:path";
import {directories} from "../../../../../Settings/ProjectConsts.js";
import RequestWrapper from "../../../../ProcessURL/RequestWrapper.js";
import {sendStaticFile} from "./utils.js";

const pageInfoTypes = [{
    ext: '.pub.js',
    type: 'js'
},
    {
        ext: '.pub.mjs',
        type: 'js'
    },
    {
        ext: '.pub.css',
        type: 'css'
    }];

export default async function serverBuildByType(wrapper: RequestWrapper) {
    const havePageExt = pageInfoTypes.find(x => wrapper.path.nested.endsWith(x.ext));
    if (!havePageExt) {
        return;
    }

    const fullCompilePath = path.join(directories.Locate.static.compile, wrapper.path.nested);
    return sendStaticFile(fullCompilePath, havePageExt.type, wrapper);
}