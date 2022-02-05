import {parseBase} from '../dist/CompileCode/XMLHelpers/PageBase.js';
import StringTracker from '../dist/EasyDebug/StringTracker.js';

const text = new StringTracker(null, `
@[Title=Page, model="website", start='ok', me=a]
`);

const data = parseBase(text);

for(const i of data) {
    console.log(i.key.eq + '="'+ i.value.eq + '"');
}