import { AppLog, BasicLogger } from "../../../Logger/BasicLogger";
import { GlobalSettings } from "../../../Settings/GlobalSettings";

export default function(){
    return {settings: GlobalSettings, searchRecord, logger: AppLog, BasicLogger, sitemap: sitemapEventEmitter};
}