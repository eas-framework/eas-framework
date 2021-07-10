import AddSyntax from './Syntax/Index';
import StringTracker from '../EasyDebug/StringTracker';
import {StringAnyMap} from '../CompileCode/XMLHelpers/CompileTypes';

export default class AddPlugin {
	public SettingsObject: any;

    constructor(SettingsObject: {[key: string]: any}) {
        this.SettingsObject = SettingsObject
    }

    async BuildBasic(text: StringTracker, OData:string |any, path:string, pathName: string, sessionInfo: StringAnyMap) {

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
    async BuildPage(text: StringTracker, path: string, pathName: string, sessionInfo: StringAnyMap): Promise<StringTracker>{
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
    async BuildComponent(text: StringTracker, path: string, pathName: string, sessionInfo: StringAnyMap): Promise<StringTracker>{
        text = await this.BuildBasic(text, this.SettingsObject.AddCompileSyntax, path, pathName, sessionInfo);
        return text;
    }
}