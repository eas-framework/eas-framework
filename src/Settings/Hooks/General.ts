import {GlobalSettings} from "../GlobalSettings.js";
import {hookSet, hookSetArray} from "./Hook.js";
import {
    reFilterExtension
} from "../../ProcessRequest/ScriptLoader/Senders/StaticFile/CustomHooks/StaticExtension/index.js";
import {setDirectories} from "../ProjectConsts.js";
import {setCookiesExpiresDays} from '../../ProcessRequest/ScriptLoader/RequestParser.js';
import compileAllPages from '../../CompilePage/Scanner.js';

/**
 * General settings hooks.
 */


/**
 * If the value is false, compile the pages
 * @param {boolean} value - boolean - the value of the checkbox
 */
function updateDevelopment(value: boolean) {
    if (!value) { // if not development mode
        compileAllPages();
    }
}

hookSet(GlobalSettings, 'development', updateDevelopment);

/* It's a hook that runs the function `reFilterExtension` when the values of `allowExt` or `ignoreExt`
change. */
hookSetArray(GlobalSettings.routing, ["allowExt", "ignoreExt"], reFilterExtension);

/**
 * Update project directories when website directory changed
 */
hookSet(GlobalSettings, 'websiteDirectory', setDirectories);

/**
 * Update the cookie settings
 */
hookSet(GlobalSettings.serveLimits, 'cookiesExpiresDays', setCookiesExpiresDays);