import * as sourceMapSupport from 'source-map-support'; sourceMapSupport.install();export default (__dirname, __filename, _require, _include, private_var, handelConnector) => {
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
    import DateString from './DateString.serv.js';
;`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:4:3

//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:5:51
    const {default:DateString} = await require('./DateString.serv.js');
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:5:52
;
out_run_script.text+=`
<p>Today date: `;
run_script_code=`write((DateString()));`;
//!D:\Code\Projects\beyond-easy\tests\core/Website/Static/index.page:7:30
write((DateString()));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxDb2RlXFxQcm9qZWN0c1xcYmV5b25kLWVhc3lcXHRlc3RzXFxjb3JlXFxXZWJzaXRlXFxNb2RlbHNcXFdlYnNpdGUubW9kZSIsIkQ6XFxDb2RlXFxQcm9qZWN0c1xcYmV5b25kLWVhc3lcXHRlc3RzXFxjb3JlXFxXZWJzaXRlXFxTdGF0aWNcXGluZGV4LnBhZ2UiLCJEOlxcQ29kZVxcUHJvamVjdHNcXGJleW9uZC1lYXN5XFx0ZXN0c1xcY29yZVxcV2Vic2l0ZVxcQ29tcG9uZW50c1xcQnV0dG9uTGluay5pbnRlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBLEFBREEsQUFDQTtBQUNBO0FBQ0EsQUFIQSxBQUdBLEFBQ0E7QUFDQSxBQ0pBLEFESUE7QUFDQSxBQTBDQTs7QUE5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUEsQUFLQTtBQUFBLEFBOUNBLEFBK0NBO0FBQ0E7QUFDQSxBQW5EQSxBQW1EQTtBQUNBO0FBQ0E7OztBRW5EQTtBQUNBO0FBQ0E7QUFDQTtBRmdEQTtBQUNBOzs7QUVwREE7QUFDQTtBQUNBO0FBQ0E7QUZpREE7QUFDQTs7O0FFckRBO0FBQ0E7QUFDQTtBQUNBO0FGa0RBO0FBQ0E7OztBRXREQTtBQUNBO0FBQ0E7QUFDQTtBRm1EQTtBQUNBLEFBTkEsQUFNQTtBQUNBLEFBMURBLEFBMERBO0FBQ0EsQUN6REE7QUFBQTs7Ozs7QUFDQTs7QUFDQTs7QUFBQTtBQUNBO0FBQ0E7OztBQUFBO0FBQ0EsQUFEQTtBQUFBOzs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBREVBO0FBQ0E7QURtREE7QUFDQSxBQUZBLEFBRUE7QUFBQSxBQVZBLEFBV0E7QUFBQSxBQTVEQSxBQTZEQSIsImZpbGUiOiJEOlxcQ29kZVxcUHJvamVjdHNcXGJleW9uZC1lYXN5XFxkaXN0XFxTeXN0ZW1EYXRhXFxTdGF0aWNDb21waWxlXFxpbmRleC5wYWdlLmpzIn0=