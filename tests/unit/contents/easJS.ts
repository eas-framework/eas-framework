export const exampleScript = `
'www'
//!static/index.page:1:45 -> static/index.page.js:1:41
import {getNumber} from './some.hide.js';

//!static/index.page:1:45 -> static/index.page.js:3:36
export const myNumber = getNumber();

import Moo, {a as bb, cc} from './ddd' assert {type: "json"}
Moo()
a()
bb()
cc()
import 'fff'
await import('jdrjj')
stop(2)
stop

export const v = 9
export {a, b, c} from 'ddd'
export {e as k}
export default function me(){

}
`;

export const exampleScriptExpectedOutput = `var _ddd = await require4('ddd');
_export(exports, {
    a: ()=>_ddd.a,
    b: ()=>_ddd.b,
    c: ()=>_ddd.c,
    k: ()=>e,
    default: ()=>me
});
'www';
//!static/index.page:1:45 -> static/index.page.js:1:41
var { getNumber  } = await require4('./some.hide.js');
getNumber();
var { default: Moo , bb: a1 , cc  } = await require4('./ddd', {
    type: "json"
});
Moo();
a();
bb();
cc();
await require4('fff');
await require4('jdrjj');
_return(2);
_return;
function me() {}
`;