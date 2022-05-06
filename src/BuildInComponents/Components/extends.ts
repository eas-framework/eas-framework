import StringTracker from '../../EasyDebug/StringTracker';
import { BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';
import TagDataParser from '../../CompileCode/XMLHelpers/TagDataParser';

export default async function extendsAttributes(compiledString: StringTracker, addAttributes: TagDataParser): Promise<BuildInComponent> {
    return {
        compiledString,
        addAttributes,
        checkComponents: true
    }
}