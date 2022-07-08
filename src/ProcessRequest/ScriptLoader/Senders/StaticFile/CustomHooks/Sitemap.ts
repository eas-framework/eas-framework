import path from "node:path";
import { GlobalSettings } from "../../../../../Settings/GlobalSettings";
import RequestWarper from "../../../../ProcessURL/RequestWarper";

export default async function sitemapFile(warper: RequestWarper) {
    if (warper.path.nested !== GlobalSettings.routing.sitemap?.file){
        return
    }

    const sitemapContent = await getSitemap(warper)

    if(!sitemapContent){
        return
    }

    warper.res.type(path.extname(warper.path.nested))
    warper.res.end(sitemapContent)

    return true
}
