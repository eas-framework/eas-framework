import sourceMapSupport from 'source-map-support'; sourceMapSupport.install(); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
            return (async function (page) {
                const require = (p) => _require(page, p);
                const include = (p, WithObject) => _include(page, p, WithObject);
        
                var module = { exports: {} },
                    exports = module.exports,
                    { sendFile, safeWrite, write, setResponse, out_run_script, run_script_name, Response, Request, Post, Query, Session, Files, Cookies, isDebug, RequireVar, codebase} = page,
                    
                    run_script_code = run_script_name; 

                {try {

run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Models\Website.mode:0:38
run_script_name=`Static/index.page`;
out_run_script.text+=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"></meta>
    <title>Home Page</title>
    <style>

        body {
            font-size: 16px;
            margin: 0;
            padding: 0;
        }

        .nav-bar {
            margin-top: 10px;
            border-bottom: solid 1px #777676;
            margin-bottom: 30px;
            padding: 10px;
            display: flex;
            justify-content: space-around;
            font-size: 20px;
        }

        .nav-bar p {
            margin: 8px;
        }

        .nav-bar a button {
            margin: 5px;
            color: #2a5b86;
            border: solid 1px #1467ce;
            background-color: aliceblue;
            border-radius: 2px;
            padding: 5px;
            min-width: 80px;
            cursor: pointer;
            transition: .3s;
        }

        .nav-bar a button:hover {
            border: solid 1px #b65a5a;
        }

        .main {
            margin:  10px;
            color: #1c1e1e;
            text-align: center;
        }
    
</style>
</head>
<body>
    <div class="nav-bar">
        <p>Website</p>
        `;
run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Components\ButtonLink.inte:0:38
run_script_name=`Static/index.page`;{"use strict";out_run_script.text+=`<a href="/">
    <button>Home</button>
</a>
`;};
out_run_script.text+=`
        `;
run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Components\ButtonLink.inte:0:38
run_script_name=`Static/index.page`;{"use strict";out_run_script.text+=`<a href="/About">
    <button>About</button>
</a>
`;};
out_run_script.text+=`
        `;
run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Components\ButtonLink.inte:0:38
run_script_name=`Static/index.page`;{"use strict";out_run_script.text+=`<a href="/PrivatePage">
    <button>Private page</button>
</a>
`;};
out_run_script.text+=`
        `;
run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Components\ButtonLink.inte:0:38
run_script_name=`Static/index.page`;{"use strict";out_run_script.text+=`<a href="/CannotSee.json">
    <button>Private file</button>
</a>
`;};
out_run_script.text+=`
    </div>
    <div class="main">
        
`;
run_script_code=`

    m();
    import DateString from './DateString.serv.js';

    if(Session){
        if(!Session.count)
            Session.count = 0;
        Session.count++;
    }
;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:4:3

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:5:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:6:9
    m();
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:7:51
    const {default:DateString} = await require('./DateString.serv.js');
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:8:1

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:9:17
    if(Session){
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:10:27
        if(!Session.count)
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:11:31
            Session.count = 0;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:12:25
        Session.count++;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:13:6
    }
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:13:7
;
out_run_script.text+=`
<p>Today date: `;
run_script_code=`write((DateString()));`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:15:30
write((DateString()));
out_run_script.text+=`</p>
<p>Debug Mode? `;
run_script_code=`write(debug);`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:16:21
write(true);
out_run_script.text+=`</p>
<p>Session count: `;
run_script_code=`write((Session?.count));`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:17:35
write((_optionalChain([Session, 'optionalAccess', _ => _.count])));
out_run_script.text+=`</p>
`;
run_script_code=`run_script_name=\`Static/index.page\`;`;
//!Static/index.page -><line>D:\Code\Projects\beyond-easy\tests\core\Website\Components\ButtonLink.inte:0:38
run_script_name=`Static/index.page`;{"use strict";out_run_script.text+=`<a onclick="window.location.reload()"  href="#">
    <button>Reload page</button>
</a>
`;};
out_run_script.text+=`
<p>If you change/remove the key ‘ignore-start-paths’ at the settings file, you will be able to see the private page.</p>

    </div>
</body>
</html></html>`;
}
                catch(e){
                    run_script_name += ' -> <line>' + e.stack.split(/\n( )*at /)[2];
                    out_run_script.text += '<p style="color:red;text-align:left;font-size:16px;"><p>Error path: ' + run_script_name.replace(/<line>/gi, '<br/>') + '</p><p>Error message: ' + e.message + '</p></p>';
        
                    console.error("Error path: " + run_script_name.replace(/<line>/gi, '\n'));
                    console.error("Error message: " + e.message);
                    console.error("Error runing this code: '" + run_script_code + "'");
                    console.error("Error stack: " + e.stack);
                }}});}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3RzL2NvcmUvV2Vic2l0ZS9Nb2RlbHMvV2Vic2l0ZS5tb2RlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL1N0YXRpYy9pbmRleC5wYWdlIiwiLi4vLi4vLi4vdGVzdHMvY29yZS9XZWJzaXRlL0NvbXBvbmVudHMvQnV0dG9uTGluay5pbnRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLEFBREEsQUFDQTtBQUNBO0FBQ0EsQUFIQSxBQUdBLEFBQ0E7QUFDQSxBQ0pBLEFESUE7QUFDQSxBQTBDQTs7QUE5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUEsQUFLQTtBQUFBLEFBOUNBLEFBK0NBO0FBQ0E7QUFDQSxBQW5EQSxBQW1EQTtBQUNBO0FBQ0E7OztBRW5EQTtBQUNBO0FBQ0E7QUFDQTtBRmdEQTtBQUNBOzs7QUVwREE7QUFDQTtBQUNBO0FBQ0E7QUZpREE7QUFDQTs7O0FFckRBO0FBQ0E7QUFDQTtBQUNBO0FGa0RBO0FBQ0E7OztBRXREQTtBQUNBO0FBQ0E7QUFDQTtBRm1EQTtBQUNBLEFBTkEsQUFNQTtBQUNBLEFBMURBLEFBMERBO0FBQ0EsQUN6REE7QUFBQTs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUFBO0FBQ0E7QUFDQTs7O0FBQUE7QUFDQSxBQURBO0FBQ0E7OztBQUFBO0FBQ0EsQUFEQTtBQUNBOzs7QUFBQTtBQUNBLEFBREE7QUFBQTs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QURZQTtBQUNBO0FEeUNBO0FBQ0EsQUFGQSxBQUVBO0FBQUEsQUFWQSxBQVdBO0FBQUEsQUE1REEsQUE2REEiLCJmaWxlIjoiaW5kZXgucGFnZS5qcyJ9