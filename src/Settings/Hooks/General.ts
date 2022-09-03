import { GlobalSettings } from "../GlobalSettings";
import { hookSet, hookSetArray } from "./Hook";
import { clearPageFromRam, loadPageToRam } from "../../ProcessRequest/ScriptLoader/PageLoader";
import { reFilterExtension } from "../../ProcessRequest/ScriptLoader/Senders/StaticFile/CustomHooks/StaticExtension";
import { setDirectories } from "../ProjectConsts";

/**
 * General settings hooks.
 */

/**
 * If the value is true, load the page to RAM, otherwise clear the page from RAM
 * @param {boolean} value - boolean - This is the value of the checkbox. If it's checked, it's true. If
 * it's not checked, it's false.
 */
function updatePageInRam(value: boolean) {
    if(value){
        loadPageToRam()
    } else {
        clearPageFromRam()
    }
}
hookSet(GlobalSettings.general, 'pageInRam', updatePageInRam)

/**
 * If the value is false, compile the pages
 * @param {boolean} value - boolean - the value of the checkbox
 */
function updateDevelopment(value: boolean) {
    if(!value){
        //compile the pages
    }
}
hookSet(GlobalSettings, 'development', updateDevelopment)

/* It's a hook that runs the function `reFilterExtension` when the values of `allowExt` or `ignoreExt`
change. */
hookSetArray(GlobalSettings.routing, ["allowExt", "ignoreExt"], reFilterExtension)

/**
 * Update project directories when website directory changed
 */
hookSet(GlobalSettings, 'websiteDirectory', setDirectories)