import AddSyntax from './Syntax/Index.js';
export default class AddPlugin {
    SettingsObject;
    constructor(SettingsObject) {
        this.SettingsObject = SettingsObject;
    }
    async BuildBasic(text, OData, path, pathName, sessionInfo) {
        //add Syntax
        if (!OData) {
            return text;
        }
        if (!Array.isArray(OData)) {
            OData = [OData];
        }
        for (const i of OData) {
            const Syntax = await AddSyntax(i);
            if (Syntax) {
                text = Syntax(text, i, path, pathName, sessionInfo);
            }
        }
        return text;
    }
    /**
     * Execute plugins for pages
     * @param text all the code
     * @param path file location
     * @param pathName file location without start folder (small path)
     * @returns compiled code
     */
    async BuildPage(text, path, pathName, sessionInfo) {
        text = await this.BuildBasic(text, this.SettingsObject.AddCompileSyntax, path, pathName, sessionInfo);
        return text;
    }
    /**
     * Execute plugins for components
     * @param text all the code
     * @param path file location
     * @param pathName file location without start folder (small path)
     * @returns compiled code
     */
    async BuildComponent(text, path, pathName, sessionInfo) {
        text = await this.BuildBasic(text, this.SettingsObject.AddCompileSyntax, path, pathName, sessionInfo);
        return text;
    }
}
//# sourceMappingURL=Index.js.map