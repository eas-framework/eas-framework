import StringTracker from '../EasyDebug/StringTracker';
import { SessionBuild } from '../CompileCode/Session';
export default class AddPlugin {
    SettingsObject: any;
    constructor(SettingsObject: {
        [key: string]: any;
    });
    private get defaultSyntax();
    BuildBasic(text: StringTracker, OData: string | any, path: string, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
    /**
     * Execute plugins for pages
     * @param text all the code
     * @param path file location
     * @param pathName file location without start folder (small path)
     * @returns compiled code
     */
    BuildPage(text: StringTracker, path: string, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
    /**
     * Execute plugins for components
     * @param text all the code
     * @param path file location
     * @param pathName file location without start folder (small path)
     * @returns compiled code
     */
    BuildComponent(text: StringTracker, path: string, pathName: string, sessionInfo: SessionBuild): Promise<StringTracker>;
}
