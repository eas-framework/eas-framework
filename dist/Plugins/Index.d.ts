import StringTracker from '../EasyDebug/StringTracker';
import { StringAnyMap } from '../CompileCode/XMLHelpers/CompileTypes';
export default class AddPlugin {
    SettingsObject: any;
    constructor(SettingsObject: {
        [key: string]: any;
    });
    BuildBasic(text: StringTracker, OData: string | any, path: string, pathName: string, sessionInfo: StringAnyMap): Promise<StringTracker>;
    /**
     * Execute plugins for pages
     * @param text all the code
     * @param path file location
     * @param pathName file location without start folder (small path)
     * @returns compiled code
     */
    BuildPage(text: StringTracker, path: string, pathName: string, sessionInfo: StringAnyMap): Promise<StringTracker>;
    /**
     * Execute plugins for components
     * @param text all the code
     * @param path file location
     * @param pathName file location without start folder (small path)
     * @returns compiled code
     */
    BuildComponent(text: StringTracker, path: string, pathName: string, sessionInfo: StringAnyMap): Promise<StringTracker>;
}
