import ParseBasePage from '../dist/CompileCode/XMLHelpers/PageBase.js';
import StringTracker from '../dist/EasyDebug/StringTracker.js';

const text = new StringTracker(null, `
@[Title=Page, model="website", start='ok', me=a]
@define('name', 'this::so::cool')
@define('age', '58')
@define('code', 'amazing')

<p>my name is: :name:</p>
<p>my age is: :age:</p>
<p>my code is: :code:</p>
`);

const data = new ParseBasePage(text);
data.loadDefine();

console.log(data.clearData.eq);


for(const i of data.valueArray) {
    console.log(i.key + '="'+ i.value.eq + '"');
}