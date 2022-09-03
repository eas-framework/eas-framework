import { AppLog, BasicLogger } from "../../../Logger/BasicLogger";
import { GlobalSettings } from "../../../Settings/GlobalSettings";
import { loadSettings } from "../../../Settings/SettingsLoader";

export default function(){
    return {
        settings: GlobalSettings,
        loadSettings,
        searchRecord,
        logger: AppLog,
        BasicLogger,
        sitemap: sitemapEventEmitter
    };
}