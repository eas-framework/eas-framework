import StringTracker from '../../EasyDebug/StringTracker';
import { BuildInComponent } from '../../CompileCode/XMLHelpers/CompileTypes';

export default async function isolate(BetweenTagData: StringTracker): Promise<BuildInComponent> {
    const compiledString = new StringTracker(BetweenTagData.StartInfo);

    compiledString.Plus$ `<%{%>${BetweenTagData}<%}%>`;

    return {
        compiledString,
        checkComponents: true
    }
}