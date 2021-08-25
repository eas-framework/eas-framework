import StringTracker from '../../EasyDebug/StringTracker.js';
export default async function isolate(BetweenTagData) {
    const compiledString = new StringTracker(BetweenTagData.StartInfo);
    compiledString.Plus$ `<%{%>${BetweenTagData}<%}%>`;
    return {
        compiledString,
        checkComponents: true
    };
}
