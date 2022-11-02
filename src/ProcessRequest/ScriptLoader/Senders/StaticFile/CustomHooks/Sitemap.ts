import path from "node:path";
import {GlobalSettings} from "../../../../../Settings/GlobalSettings.js";
import RequestWrapper from "../../../../ProcessURL/RequestWrapper.js";

export default async function sitemapFile(wrapper: RequestWrapper) {
    if (wrapper.path.nested !== GlobalSettings.routing.sitemap?.file) {
        return;
    }

    //@ts-ignore
    const sitemapContent = await getSitemap(wrapper);

    if (!sitemapContent) {
        return;
    }

    wrapper.res.type(path.extname(wrapper.path.nested));
    wrapper.res.end(sitemapContent);

    return true;
}
